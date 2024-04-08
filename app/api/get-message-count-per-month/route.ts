import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextApiErrorHandler } from '@/lib/apiError';
import {z} from 'zod';

// to solve Prisma: TypeError: Do not know how to serialize a BigInt
// @ts-ignore
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

const schema = z.object({
  year: z.string().optional().nullable().refine(value => !isNaN(Number(value)), {
    message: 'Year must be a 4 digit number',
  }),
  month: z.string().optional().nullable().refine(value => !isNaN(Number(value)), {
    message: 'Month must be a number',
  }),
  author: z.string().optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const year = Number(urlParams.get('year'));
    const month = Number(urlParams.get('month'));
    const author = String(urlParams.get('author') || '');

    if (!year && !month) {
      return NextResponse.json({ message: 'Year or month parameter is required', status: 400, data: {} }, { status: 400 });
    }

    let result: { author: string, month: number, message_count: number }[] = [];
    if (year && month) {
      // Fetch message count for the specified month and year
      result = await prisma.$queryRawUnsafe(`
      SELECT
        "author",
        EXTRACT(MONTH FROM "date") AS "month",
        COUNT(*) AS "message_count"
      FROM
        "verceldb"."public"."Message"
      WHERE
        EXTRACT(YEAR FROM "date") = ${year} AND
        EXTRACT(MONTH FROM "date") = ${month}
        ${author ? `AND LOWER(author) = '${author.toLowerCase()}'` : ''}
      GROUP BY
        "author", "month"
    `);
    } else if (year) {
      // Fetch message count for each month of the specified year
      result = await prisma.$queryRawUnsafe(`
      SELECT
        "author",
        EXTRACT(MONTH FROM "date") AS "month",
        COUNT(*) AS "message_count"
      FROM
        "verceldb"."public"."Message"
      WHERE
        EXTRACT(YEAR FROM "date") = ${year}
        ${author ? `AND LOWER(author) = '${author.toLowerCase()}'` : ''}
      GROUP BY
        "author", "month"
    `);
    }

    // Format the result
    const formattedResult: {
      [x: string]: {
        [x: string]: number
      }
    } = {};

    result.forEach(row => {
      const { author, month, message_count } = row;
      if (!formattedResult[author]) {
        formattedResult[author] = {};
      }
      formattedResult[author][month] = message_count;
    });

    return NextResponse.json({ message: 'Fetched message count per month successfully', status: 200, data: formattedResult });
  } catch (error: any) {
    return NextApiErrorHandler(error, 'Failed to fetch message count per month');
  }
}
