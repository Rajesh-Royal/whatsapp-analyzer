import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { createLogger } from '@/lib/logger';
import { chunkArray } from '@/lib/utils/chunkArray';

const logger = createLogger('app/api/whatsapp-chat');

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const limit = Number(urlParams.get('limit')) || 50; // Default limit is 50
    const offset = Number(urlParams.get('offset')) || 0; // Default offset is 0

    const [paginatedMessages, totalMessagesCount] = await prisma.$transaction([
      prisma.message.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          date: 'asc'
        }
      }),
      prisma.message.count()
    ]);

    return NextResponse.json({ message: 'Fetched messages successfully', status: 200, data: paginatedMessages, count: totalMessagesCount });
  } catch (error: any) {
    const status = error.status || 500;
    return NextResponse.json({ message: 'Failed to fetch messages', status, data: [] }, { status })
  }
}

export const uploadChatDataToDB = async (messages: any[]) => {
  const messagesChunks = chunkArray(messages, 500);

  const createManyQueries = messagesChunks.map((messagesChunk) => {
    return prisma.message.createMany({
      data: messagesChunk,
      skipDuplicates: true,
    });
  });

  logger.info("Started creating whatsapp messages");

  const result = await prisma.$transaction(createManyQueries);

  logger.info("finished executing prisma transactions for whatsapp messages");

  return result;
}

// TODO: Add auth to routes
// TODO: Rate Limit user so a user can't use this feature more than once in a day
export async function POST(request: NextRequest) {
  const { messages = [] } = await request.json();

  try {
    const result = await uploadChatDataToDB(messages);

    const insertCount = result.reduce((acc, item) => acc + item.count, 0);

    return NextResponse.json({ message: 'Data inserted successfully', status: 200, data: [], count: insertCount })
  } catch (error: any) {
    const status = error.status || 500;

    logger.error(`Failed to upload chat messages - error: ${error.message}`);

    return NextResponse.json({ message: 'Failed to insert messages', status, data: [] }, { status })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    logger.info('started deleting messages');

    const result = await prisma.message.deleteMany();

    logger.info(`deleted all the messages successfully`, {deleteCount: result.count});

    return NextResponse.json({ message: 'Data deleted successfully', status: 200, data: [], count: result.count })
  } catch (error: any) {
     const status = error.status || 500;
    
    logger.error(`Failed to delete chat messages - error: ${error.message}`);

    return NextResponse.json({ message: 'Failed to delete messages', status, data: [] }, { status })
  }
}


