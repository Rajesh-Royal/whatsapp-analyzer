import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { getPaginationParams } from '@/lib/utils/getPaginationParams';
import { getDateParams } from '@/lib/utils/getDateParams';
import { createLogger } from '@/lib/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const logger = createLogger("app/api/get-by-date-range");

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const { limit, offset } = getPaginationParams(request);
    const { fromDate, toDate } = getDateParams(request);
    const author = urlParams.get('author');

    logger.info('incoming GET request', { params: { limit, offset, fromDate, toDate, author } });

    if (!author) {
      return NextResponse.json({ message: 'Author name is required', status: 400, data: [] }, { status: 400 })
    }

    const result = await prisma.message.findMany({
      where: {
        author: {
          equals: String(author),
          mode: 'insensitive',
        },
        ...(fromDate || toDate ? {
          date: {
            ...(fromDate ? { gte: fromDate } : {}),
            ...(toDate ? { lte: toDate } : {}),
          }
        } : {}),
      },
      skip: offset,
      take: limit,
      orderBy: {
        date: "asc"
      }
    });

    if (result.length === 0) {
      return NextResponse.json({ message: 'No message found for this search', status: 204, data: [], count: 0 });
    }

    return NextResponse.json({ message: 'Fetched messages successfully', status: 200, data: result, count: result.length });
  } catch (error: any) {
    logger.error(error)
    return NextResponse.json({ message: 'Failed to fetch messages', status: 500, data: [], errorMessage: (error as PrismaClientKnownRequestError).message }, { status: 500 })
  }
}