import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { getPaginationParams } from '@/lib/utils/getPaginationParams';
import { getDateParams } from '@/lib/utils/getDateParams';
import { createLogger } from '@/lib/logger';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const logger = createLogger("app/api/get-by-messages-day");

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const author = urlParams.get('author');
    const { fromDate, toDate } = getDateParams(request);

    logger.info('incoming GET request', { params: { fromDate, toDate } });

    const result: any[] = await prisma.$queryRawUnsafe(
      `SELECT DATE(date) as date, ${author ? 'author,' : ''} COUNT(*) as count
      FROM verceldb.public."Message"
      WHERE date >= '${fromDate}' AND date <= '${toDate}' ${author ? `AND author = '${author}'` : ''}
      GROUP BY DATE(date) ${author ? `, author` : ''}
      ORDER BY count DESC`
    )
    
    if (result.length === 0) {
      return NextResponse.json({ message: 'No messages analytics data found for this search', status: 204, data: [], count: 0 });
    }

    return NextResponse.json({ message: 'Fetched messages analytics successfully', status: 200, data: result, count: result.length });
  } catch (error: any) {
    logger.error(error)
    return NextResponse.json({ message: 'Failed to fetch messages analytics data', status: 500, data: [], errorMessage: (error as PrismaClientKnownRequestError).message }, { status: 500 })
  }
}
