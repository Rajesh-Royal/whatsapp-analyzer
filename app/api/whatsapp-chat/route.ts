import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { createLogger } from '@/lib/logger';
import { chunkArray } from '@/lib/utils/chunkArray';
import { getPaginationParams } from '@/lib/utils/getPaginationParams';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextApiErrorHandler } from '@/lib/apiError';

const logger = createLogger('app/api/whatsapp-chat');

export async function GET(request: NextRequest) {
  try {
    const { limit, offset } = getPaginationParams(request);

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
    return NextApiErrorHandler(error, 'Failed to fetch messages')
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
    return NextApiErrorHandler(error, 'Failed to insert messages')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    logger.info('started deleting messages');

    const result = await prisma.message.deleteMany();

    logger.info(`deleted all the messages successfully`, { deleteCount: result.count });

    return NextResponse.json({ message: 'Data deleted successfully', status: 200, data: [], count: result.count })
  } catch (error: any) {
    return NextApiErrorHandler(error, 'Failed to delete messages')
  }
}


