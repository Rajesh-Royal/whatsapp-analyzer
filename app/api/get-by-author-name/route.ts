import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma';
import { getPaginationParams } from '@/lib/utils/getPaginationParams';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createLogger } from '@/lib/logger';
import { ZOD_VALIDATION_ERROR } from '@/lib/utils/constants';

const logger = createLogger("app/api/get-by-author-name");

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const author = urlParams.get('author');
    const { limit, offset } = getPaginationParams(request);

    logger.info('incoming GET request', { params: { limit, offset, author } });

    const result = await prisma.message.findMany({
      where: {
        author: {
          equals: String(author),
          mode: 'insensitive',
        }
      },
      skip: offset,
      take: limit,
      orderBy: {
        date: "asc"
      }
    });

    if (result.length === 0) {
      return NextResponse.json({ message: 'No message found for this author', status: 204, data: [], count: 0 });
    }

    return NextResponse.json({ message: 'Fetched message successfully', status: 200, data: result, count: result.length });
  } catch (error: any) {
    console.log(error);
    const status = error.status || 500;
    if (error.cause === ZOD_VALIDATION_ERROR) {
      const validationErrors = JSON.parse(error.message) as z.ZodIssue[];
      return NextResponse.json({ message: 'Invalid Params', status, data: [], errorMessage: validationErrors[0].message, validationErrors }, { status })
    }

    return NextResponse.json({ message: 'Failed to fetch message', status, data: [], errorMessage: (error as PrismaClientKnownRequestError).message }, { status })
  }
}