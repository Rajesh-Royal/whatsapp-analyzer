import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client';
import * as whatsapp from '@/utils/whatsapp-parser';
import { logger } from '@/utils/logger';


export async function POST(request: NextRequest) {
  try {
    logger.info('started parsing uploaded file');

    // Read the file from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileText = await file.text();

    const messages = whatsapp.parseString(fileText);

    logger.info(`parsed uploaded file total messages found ${messages.length}`);

    

    return NextResponse.json({ message: 'Fetched successfully', status: 200, data: [], count: messages.length })
  } catch (error:any) {
    logger.error(`Something went wrong: ${error.message} ${JSON.stringify(error)}`)

    return NextResponse.json({message: error.message, data: [], stackTrace: JSON.stringify(error)}, {status: 500})
  }
}
