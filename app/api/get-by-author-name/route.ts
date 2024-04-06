import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const author = urlParams.get('author');
    const limit = Number(urlParams.get('limit')) || 50;
    const offset = Number(urlParams.get('offset')) || 0;

    if (!author) {
      return NextResponse.json({ message: 'Author name is required', status: 400, data: [] }, { status: 400 })
    }

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
    const status = error.status || 500;
    return NextResponse.json({ message: 'Failed to fetch message', status, data: [] }, { status })
  }
}