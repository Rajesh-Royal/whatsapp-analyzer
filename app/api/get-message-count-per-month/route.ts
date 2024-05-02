import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextApiErrorHandler } from "@/lib/apiError";
import { z } from "zod";
import { ZOD_VALIDATION_ERROR } from "@/lib/utils/constants";

// to solve Prisma: TypeError: Do not know how to serialize a BigInt
// @ts-ignore
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

const schema = z
  .object({
    year: z
      .number()
      .optional()
      .nullable()
      .refine(
        (value) =>
          value ? value > 2014 && value <= new Date().getFullYear() : true,
        {
          message: `Year must be a 4 digit number and between 2014 and ${new Date().getFullYear()}`,
        },
      ),
    month: z
      .number()
      .optional()
      .nullable()
      .refine((value) => (value ? value >= 1 && value <= 12 : true), {
        message: "Month must be a number between 1 and 12",
      }),
    author: z
      .string()
      .max(10, {
        message: "Author can have a maximum of 10 characters",
      })
      .optional()
      .nullable(),
  })
  .refine((data) => !(data.month && !data.year), {
    message: "Year is required when month is provided",
  });

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const year = Number(urlParams.get("year"));
    const month = Number(urlParams.get("month"));
    const author = String(urlParams.get("author") || "");

    // Validate the query parameters
    const schemaParseResult = schema.safeParse({ year, month, author });
    if (!schemaParseResult.success) {
      throw new Error(JSON.stringify(schemaParseResult.error.errors), {
        cause: ZOD_VALIDATION_ERROR,
      });
    }

    let result: { author: string; month: number; message_count: number }[] = [];
    if (year && month) {
      // Fetch message count for the specified month and year
      result = await prisma.$queryRawUnsafe(`
      SELECT
        "author",
        EXTRACT(MONTH FROM "date") AS "month",
        COUNT(*) AS "message_count"
      FROM
        "verceldb"."public"."Message"
      WHERE
        EXTRACT(YEAR FROM "date") = ${year} AND
        EXTRACT(MONTH FROM "date") = ${month}
        ${author ? `AND LOWER(author) = '${author.toLowerCase()}'` : ""}
      GROUP BY
        "author", "month"
    `);
    } else if (year) {
      // Fetch message count for each month of the specified year
      result = await prisma.$queryRawUnsafe(`
      SELECT
        "author",
        EXTRACT(MONTH FROM "date") AS "month",
        COUNT(*) AS "message_count"
      FROM
        "verceldb"."public"."Message"
      WHERE
        EXTRACT(YEAR FROM "date") = ${year}
        ${author ? `AND LOWER(author) = '${author.toLowerCase()}'` : ""}
      GROUP BY
        "author", "month"
    `);
    }

    // Format the result
    const formattedResult: {
      [x: string]: {
        [x: string]: number;
      };
    } = {};

    result.forEach((row) => {
      const { author, month, message_count } = row;
      if (!formattedResult[author]) {
        formattedResult[author] = {};
      }
      formattedResult[author][month] = message_count;
    });

    return NextResponse.json({
      message: "Fetched message count per month successfully",
      status: 200,
      data: [formattedResult],
    });
  } catch (error: any) {
    return NextApiErrorHandler(
      error,
      "Failed to fetch message count per month",
    );
  }
}
