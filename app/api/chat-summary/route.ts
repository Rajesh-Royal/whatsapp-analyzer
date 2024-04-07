import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { createLogger } from '@/lib/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const logger = createLogger("app/api/chat-summary");

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const author = urlParams.get('author');

    logger.info('incoming GET request', { params: { author } });

    const result = await getSummary(author);
  
    return NextResponse.json({ message: 'Fetched messages analytics successfully', status: 200, data: [result], count: result.authors.length });
  } catch (error: any) {
    logger.error(error)
    return NextResponse.json({ message: 'Failed to fetch messages analytics data', status: 500, data: [], errorMessage: (error as PrismaClientKnownRequestError).message }, { status: 500 })
  }
}

const getSummary = async (author: string | null) => {
  // Get the date of the first and last message
  const firstAndLastMessage = prisma.message.aggregate({
    _min: {
      date: true,
    },
    _max: {
      date: true,
    },
    where: {
      ...(author ? {author: {
        equals: author,
        mode: 'insensitive'
      }}: '')
    }
  });
  
  // Get the total number of messages
  const totalMessages = prisma.message.count({
    where: {
      ...(author ? {author: {
        equals: author,
        mode: 'insensitive'
      }}: '')
    }
  });
  
  // Get the list of authors
  const authors = prisma.message.groupBy({
    by: ['author'],
  });

  const [{_max: lastMessageResult, _min: firstMessageResult}, totalMessagesResult, authorsResult] = await prisma.$transaction([firstAndLastMessage, totalMessages, authors]);

  // Calculate the difference in days between the first and last message
  const diffInDays = firstMessageResult.date && lastMessageResult.date && Math.ceil((lastMessageResult.date.getTime() - firstMessageResult.date.getTime()) / (1000 * 60 * 60 * 24));

  const authorNames = authorsResult.map(author => author.author);

  return {
    firstMessage: firstMessageResult?.date,
    lastMessage: lastMessageResult?.date,
    totalDays: diffInDays,
    totalMessages: totalMessagesResult,
    authors: authorNames,
  };
}

