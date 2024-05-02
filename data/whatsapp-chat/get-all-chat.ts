import prisma from "@/lib/prisma";

export const getAllWhatsappChat = async (
  limit: number = 50,
  offset: number = 0,
) => {
  const [paginatedMessages, totalMessagesCount] = await prisma.$transaction([
    prisma.message.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        date: "asc",
      },
    }),
    prisma.message.count(),
  ]);

  return { paginatedMessages, totalMessagesCount };
};
