import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { createLogger } from '@/lib/logger';
import { NextApiErrorHandler } from '@/lib/apiError';
import { getChatSummary } from '@/data/whatsapp-chat/chat-summary';

const logger = createLogger("app/api/chat-summary");

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const author = urlParams.get('author');

    logger.info('incoming GET request', { params: { author } });

    const result = await getChatSummary(author);
  
    return NextResponse.json({ message: 'Fetched messages analytics successfully', status: 200, data: [result], count: result.authors.length });
  } catch (error: any) {
    return NextApiErrorHandler(error, 'Failed to fetch messages analytics data')
  }
}



