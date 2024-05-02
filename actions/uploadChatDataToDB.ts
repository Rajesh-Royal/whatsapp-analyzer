import { chunkArray } from "@/lib/utils/chunkArray";
import { createLogger } from "@/lib/logger";
import prisma from "@/lib/prisma";

const logger = createLogger("app/api/whatsapp-chat");

export const uploadChatDataToDB = async (messages: any[]) => {
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

  return result;
};
