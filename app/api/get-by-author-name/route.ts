import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const author = urlParams.get('author');

    if(!author) {
      return NextResponse.json({ message: 'Author name is required', status: 400, data: [] }, { status: 400 })
    }
    
    const result =  await prisma.message.findFirst({
      where: {
        author: String(author)
      }
    });

    let data: any[] = [];
    let count = 0;
    if(result?.id){
      count = 1;
      data.push(result);
    }else {
      return NextResponse.json({ message: 'No message found for this author', status: 204, data, count });
    }

    return NextResponse.json({ message: 'Fetched message successfully', status: 200, data, count });
  } catch (error: any) {
    const status = error.status || 500;
    return NextResponse.json({ message: 'Failed to fetch message', status, data: [] }, { status })
  }
}