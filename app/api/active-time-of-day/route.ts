import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { createLogger } from '@/lib/logger';
import { NextApiErrorHandler } from '@/lib/apiError';

const logger = createLogger("app/api/active-time-of-day");

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const author = urlParams.get('author');

    logger.info('incoming GET request', { params: { author } });

    const result = await getMostActiveTime(author);

    return NextResponse.json({ message: 'Fetched active time analytics data successfully', status: 200, data: [result], count: null });
  } catch (error: any) {
    return NextApiErrorHandler(error, 'Failed to fetch active time analytics data');
  }
}

interface Author {
  author: string
  time: string
  count: number
}

const getMostActiveTime = async (author: string | null) => {
  // Get all messages
  const messages = await prisma.message.findMany({
    select: {
      author: true,
      date: true,
    },
    where: {
      ...(author ? {author: {
        equals: author,
        mode: 'insensitive'
      }} : {})
    }
  });

  // Group messages by author and hour of day
  const mostActiveTimeByEachAuthorEachHour = messages.reduce((acc, message) => {
    const hour = message.date.getHours();
    const amPm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour); // convert 24-hour format to 12-hour format
    const time = `${hour12}${amPm}`;
    const messageAuthor = message.author as string;
    const key = `${messageAuthor}-${time}`;

    if (!acc[messageAuthor]) {
      acc[messageAuthor] = [];
    }

    const existing = acc[messageAuthor].find(item => item.time === time);

    if (existing) {
      existing.count += 1;
    } else {
      acc[messageAuthor].push({
        author: messageAuthor,
        time: time,
        count: 1,
      });
    }

    return acc;
  }, {} as {
    [author: string]: Author[]
  });

   // For each author, find the time with the highest message count
   const mostActiveTimeByEachAuthor: { [author: string]: Author } = {};
   for (const author in mostActiveTimeByEachAuthorEachHour) {
     mostActiveTimeByEachAuthor[author] = mostActiveTimeByEachAuthorEachHour[author].sort((a, b) => b.count - a.count)[0];
   }

  return {mostActiveTimeByEachAuthorEachHour, mostActiveTimeByEachAuthor};
}
