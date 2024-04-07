import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { getPaginationParams } from '@/lib/utils/getPaginationParams';
import { getDateParams } from '@/lib/utils/getDateParams';
import { createLogger } from '@/lib/logger';
import { NextApiErrorHandler } from '@/lib/apiError';

const logger = createLogger("app/api/get-by-messages-per-author");

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const author = urlParams.get('author');
    const { fromDate, toDate } = getDateParams(request);
    const {limit, offset} = getPaginationParams(request);

    logger.info('incoming GET request', { params: { fromDate, toDate } });

    const result = await prisma.message.groupBy({
      by: ['author'],
      _count: {
        message: true,
      },
      where: {
        ...(fromDate || toDate ? {
          date: {
            ...(fromDate ? { gte: fromDate } : {}),
            ...(toDate ? { lte: toDate } : {}),
          }
        } : {}),
        ...(author ? {author: {
          equals: author,
          mode: 'insensitive'
        }} : {})
      },
      orderBy: {
        _count: {
          message: 'desc',
        },
      },
    skip: offset,
    take: limit
    });
    
    if (result.length === 0) {
      return NextResponse.json({ message: 'No messages analytics data found for this search', status: 204, data: [], count: 0 });
    }

    return NextResponse.json({ message: 'Fetched messages analytics successfully', status: 200, data: result, count: result.length });
  } catch (error: any) {
    return NextApiErrorHandler(error, 'Failed to fetch messages analytics data');
  }
}