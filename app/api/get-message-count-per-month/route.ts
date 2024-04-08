import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// to solve Prisma: TypeError: Do not know how to serialize a BigInt
// @ts-ignore
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const year = Number(urlParams.get('year'));
    const month = Number(urlParams.get('month'));
    const author = String(urlParams.get('author') || '');

    if (!year && !month) {
      return NextResponse.json({ message: 'Year or month parameter is required', status: 400, data: {} }, { status: 400 });
    }

    let result;
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
    console.log(result);
    // Format the result
    const formattedResult = {};
    result.forEach(row => {
      const { author, month, message_count } = row;
      if (!formattedResult[author]) {
        formattedResult[author] = {};
      }
      formattedResult[author][month] = message_count;
    });

    return NextResponse.json({ message: 'Fetched message count successfully', status: 200, data: formattedResult });
  } catch (error: any) {
    const status = error.status || 500;
    return NextResponse.json({ message: 'Failed to fetch message count', status, data: {}, errorMessage: (error as PrismaClientKnownRequestError).message }, { status });
  }
}
