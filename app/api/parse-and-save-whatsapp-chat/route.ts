import { NextRequest, NextResponse } from 'next/server'
import * as whatsapp from '@/lib/utils/whatsapp-parser';
import { createLogger } from '@/lib/logger';
import { makeTimeStampUnique } from '@/lib/utils/addUniqueTimestamp';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextApiErrorHandler } from '@/lib/apiError';
import { uploadChatDataToDB } from '@/actions/uploadChatDataToDB';

const logger = createLogger('app/api/parse-and-save-whatsapp-chat');

export async function POST(request: NextRequest) {
  try {
    logger.info('started parsing uploaded file');

    // Read the file from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileText = await file.text();

    const messages = whatsapp.parseString(fileText);

    logger.info(`parsed uploaded file total messages found ${messages.length}`);

    const result = await uploadChatDataToDB(makeTimeStampUnique(messages));

    const totalRecordsCreated = result.reduce((acc, item) => acc + item.count, 0);
    
    logger.info(`inserted ${totalRecordsCreated} new messages into the messages table`);

    return NextResponse.json({ message: `File uploaded and parsed successfully ${totalRecordsCreated} new messages were found`, status: 200, data: [], count: totalRecordsCreated });
  } catch (error: any) {
    return NextApiErrorHandler(error, 'Failed to parse file and save whatsapp chat');
  }
}
