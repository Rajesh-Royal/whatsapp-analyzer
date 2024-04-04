import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs';
import prisma from '@/lib/prisma'; 
import { Prisma } from '@prisma/client';
import * as whatsapp from '@/utils/whatsapp-parser';
import { logger } from '@/utils/logger';
import { chunkArray } from '@/utils/chunkArray';

// Define the type for the message model that includes the "attachment" relation.
const messageInclude = Prisma.validator<Prisma.MessageInclude>()({
  attachment: true,
});

// Get the type of User model with its relations.
type MessageWithAttachment = Prisma.MessageGetPayload<{ include: typeof messageInclude; }>;

const text = fs.readFileSync('assets/WhatsApp Chat with common .txt', 'utf8');
const messages = whatsapp.parseString(text);

export async function GET(request: NextRequest) {
  // Process a GET request
  // Process a GET request
  const urlParams = new URLSearchParams(request.nextUrl.search);
  const limit = Number(urlParams.get('limit')) || 50; // Default limit is 50
  const offset = Number(urlParams.get('offset')) || 0; // Default offset is 0

  const paginatedMessages = messages.slice(offset, offset + limit);

  return NextResponse.json({ message: 'Fetched successfully', status: 200, data: paginatedMessages })
}

// TODO: accept whatsapp chat file uploading
// TODO: if a message is already added do not add it again check duplicate via message
// TODO: Index on message to make the fetches/duplicate checker faster
// TODO: Add auth to routes
// TODO: Rate Limit user so a user can't use this feature more than once in a day
export async function POST(request: NextRequest) {
  // Process a POST request
  try {
    const messagesChunks = chunkArray(messages, 500);

    const createManyQueries = messagesChunks.map((messagesChunk) => {
      return prisma.message.createMany({
        data: messagesChunk,
        skipDuplicates: true,
      });
    });

    logger.info("Started creating whatsapp messages");

    const result = await prisma.$transaction(createManyQueries);
    
    logger.info("finished executing prisma transactions for whatsapp messages");
  
    return NextResponse.json({ message: 'Data inserted successfully', status: 200, data: result })
  } catch (error) {
    logger.error(JSON.stringify(error || {}));
    return NextResponse.error();
  }
}
