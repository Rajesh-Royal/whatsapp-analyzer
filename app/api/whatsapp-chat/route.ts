import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { createLogger } from '@/lib/logger';
import { getPaginationParams } from '@/lib/utils/getPaginationParams';
import { NextApiErrorHandler } from '@/lib/apiError';
import { uploadChatDataToDB } from '@/actions/uploadChatDataToDB';
import { getAllWhatsappChat } from '@/data/whatsapp-chat/get-all-chat';

const logger = createLogger('app/api/whatsapp-chat');

export async function GET(request: NextRequest) {
  try {
    const { limit, offset } = getPaginationParams(request);

    const {paginatedMessages, totalMessagesCount} = await getAllWhatsappChat(limit, offset);

    return NextResponse.json({ message: 'Fetched messages successfully', status: 200, data: paginatedMessages, count: totalMessagesCount });
  } catch (error: any) {
    return NextApiErrorHandler(error, 'Failed to fetch messages')
  }
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


