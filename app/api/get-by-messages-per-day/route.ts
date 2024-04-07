import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { getPaginationParams } from '@/lib/utils/getPaginationParams';
import { getDateParams } from '@/lib/utils/getDateParams';
import { createLogger } from '@/lib/logger';
import { NextApiErrorHandler } from '@/lib/apiError';

const logger = createLogger("app/api/get-by-messages-per-day");

// to solve Prisma: TypeError: Do not know how to serialize a BigInt
// @ts-ignore
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const author = urlParams.get('author');
    const { fromDate, toDate } = getDateParams(request, {fromDate: true, toDate: false});
    const {limit, offset} = getPaginationParams(request);

    logger.info('incoming GET request', { params: { fromDate, toDate } });

    const result: any[] = await prisma.$queryRawUnsafe(
      `SELECT DATE(date) as date, ${author ? 'author,' : ''} COUNT(*) as count
      FROM verceldb.public."Message"
      WHERE date >= '${fromDate}' ${toDate ? `AND date <= '${toDate}'`: ''} ${author ? `AND LOWER(author) = '${author.toLowerCase()}'` : ''}
      GROUP BY DATE(date) ${author ? `, author` : ''}
      ORDER BY count DESC
      ${limit ? `LIMIT ${limit} OFFSET ${offset || 0}` : ''}`
    )
    
    if (result.length === 0) {
      return NextResponse.json({ message: 'No messages analytics data found for this search', status: 204, data: [], count: 0 });
    }

    return NextResponse.json({ message: 'Fetched messages analytics successfully', status: 200, data: result, count: result.length });
  } catch (error: any) {
    return NextApiErrorHandler(error, 'Failed to fetch messages analytics data')
  }
}
