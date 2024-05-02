import prisma from "@/lib/prisma";

export const getChatFunFacts = async (authorParam?: string | null) => {
  // Get all authors
  const authors = authorParam
    ? [{ author: authorParam }]
    : await prisma.message.groupBy({
        by: ["author"],
      });

  const funFacts: { [x: string]: {} } = {};

  for (const author of authors) {
    if (!author.author) continue;

    // Get all messages for this author
    const messages = await prisma.message.findMany({
      where: {
        author: {
          equals: author.author,
          mode: "insensitive",
        },
      },
      select: {
        message: true,
      },
    });

    // Calculate fun facts
    const words = messages.flatMap((message) => message.message.split(" "));
    const uniqueWords = new Set(words);
    const longestMessage = messages.reduce((a, b) =>
      a.message.length > b.message.length ? a : b,
    );

    funFacts[author.author] = {
      numberOfWords: words.length,
      averageMessageLength: Math.floor(words.length / messages.length),
      uniqueWords: uniqueWords.size,
      charactersInLongestMessage: longestMessage.message.length,
    };
  }

  return funFacts;
};
