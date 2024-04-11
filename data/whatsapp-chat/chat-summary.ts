import prisma from '@/lib/prisma'

export const getChatSummary = async (author?: string | null) => {
  // Get the date of the first and last message
  const firstAndLastMessage = prisma.message.aggregate({
    _min: {
      date: true,
    },
    _max: {
      date: true,
    },
    where: {
      ...(author ? {author: {
        equals: author,
        mode: 'insensitive'
      }}: '')
    }
  });
  
  // Get the total number of messages
  const totalMessages = prisma.message.count({
    where: {
      ...(author ? {author: {
        equals: author,
        mode: 'insensitive'
      }}: '')
    }
  });
  
  // Get the list of authors
  const authors = prisma.message.groupBy({
    by: ['author'],
  });

  const [{_max: lastMessageResult, _min: firstMessageResult}, totalMessagesResult, authorsResult] = await prisma.$transaction([firstAndLastMessage, totalMessages, authors]);

  // Calculate the difference in days between the first and last message
  const diffInDays = firstMessageResult.date && lastMessageResult.date && Math.ceil((lastMessageResult.date.getTime() - firstMessageResult.date.getTime()) / (1000 * 60 * 60 * 24));

  const authorNames = authorsResult.map(author => author.author);

  return {
    firstMessage: firstMessageResult?.date,
    lastMessage: lastMessageResult?.date,
    totalDays: diffInDays,
    totalMessages: totalMessagesResult,
    authors: authorNames,
  };
}