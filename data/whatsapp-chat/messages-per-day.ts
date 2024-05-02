import prisma from "@/lib/prisma";

export interface MessagesPerDayResultType {
  count: number;
  data: string | Date;
}

// to solve Prisma: TypeError: Do not know how to serialize a BigInt
// @ts-ignore
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export const getMessagesPerDay = async (
  fromDate?: string,
  toDate?: string,
  author?: string | null,
  offset?: number,
  limit?: number,
) => {
  console.log(fromDate);
  const result = await prisma.$queryRawUnsafe(
    `SELECT DATE(date) as date, ${author ? "author," : ""} COUNT(*) as count
    FROM verceldb.public."Message"
    WHERE date >= '${fromDate}' ${toDate ? `AND date <= '${toDate}'` : ""} ${author ? `AND LOWER(author) = '${author.toLowerCase()}'` : ""}
    GROUP BY DATE(date) ${author ? `, author` : ""}
    ORDER BY count DESC
    ${limit ? `LIMIT ${limit} OFFSET ${offset || 0}` : ""}`,
  );

  return result as MessagesPerDayResultType[];
};
