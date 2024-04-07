import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { createLogger } from '@/lib/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const logger = createLogger("app/api/chat-fun-facts");

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const author = urlParams.get('author');

    logger.info('incoming GET request', { params: { author } });

    const result = await getFunFacts(author);

    return NextResponse.json({ message: 'Fetched messages fun facts successfully', status: 200, data: [result], count: Object.keys(result).length || 0 });
  } catch (error: any) {
    logger.error(error)
    return NextResponse.json({ message: 'Failed to fetch messages fun facts data', status: 500, data: [], errorMessage: (error as PrismaClientKnownRequestError).message }, { status: 500 })
  }
}

const getFunFacts = async (authorParam: string | null) => {
  // Get all authors
  const authors = authorParam ? [{author: authorParam}] : await prisma.message.groupBy({
    by: ['author'],
  });

  const funFacts: { [x: string]: {} } = {};

  for (const author of authors) {
    if (!author.author) continue;

    // Get all messages for this author
    const messages = await prisma.message.findMany({
      where: {
        author: {
          equals: author.author,
          mode: 'insensitive'
        },
      },
      select: {
        message: true,
      },
    });

    // Calculate fun facts
    const words = messages.flatMap(message => message.message.split(' '));
    const uniqueWords = new Set(words);
    const longestMessage = messages.reduce((a, b) => a.message.length > b.message.length ? a : b);

    funFacts[author.author] = {
      numberOfWords: words.length,
      averageMessageLength: Math.floor(words.length / messages.length),
      uniqueWords: uniqueWords.size,
      charactersInLongestMessage: longestMessage.message.length,
    };
  }

  return funFacts;
}
