import prisma from "@/lib/prisma";

export const getMessagesCountPerAuthor = async (fromDate?: string, toDate?: string, author?: string | null, offset?: number, limit?: number) => {
  const result = await prisma.message.groupBy({
    by: ['author'],
    _count: {
      message: true,
    },
    where: {
      ...(fromDate || toDate ? {
        date: {
          ...(fromDate ? { gte: fromDate } : {}),
          ...(toDate ? { lte: toDate } : {}),
        }
      } : {}),
      ...(author ? {author: {
        equals: author,
        mode: 'insensitive'
      }} : {})
    },
    orderBy: {
      _count: {
        message: 'desc',
      },
    },
  skip: offset,
  take: limit
  });

  return result;
}