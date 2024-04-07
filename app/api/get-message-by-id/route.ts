import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma';
import { createLogger } from '@/lib/logger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const logger = createLogger('app/api/get-message-by-id');

export async function GET(request: NextRequest) {
  try {
    // Process a GET request
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const messageId = Number(urlParams.get('messageId'));

    if(!messageId) {
      return NextResponse.json({ message: 'Message id is required', status: 400, data: [] }, { status: 400 })
    }
    
    const result =  await prisma.message.findFirst({
      where: {
        id: messageId
      }
    });

    let data: any[] = [];
    let count = 0;
    if(result?.id){
      count = 1;
      data.push(result);
    }

    return NextResponse.json({ message: 'Fetched messages successfully', status: 200, data, count });
  } catch (error: any) {
    const status = error.status || 500;
    return NextResponse.json({ message: 'Failed to fetch messages', status, data: [], errorMessage: (error as PrismaClientKnownRequestError).message }, { status })
  }
}