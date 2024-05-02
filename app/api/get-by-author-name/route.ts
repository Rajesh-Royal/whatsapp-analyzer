import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getPaginationParams } from "@/lib/utils/getPaginationParams";
import { createLogger } from "@/lib/logger";
import { NextApiErrorHandler } from "@/lib/apiError";

const logger = createLogger("app/api/get-by-author-name");

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const author = urlParams.get("author");
    const { limit, offset } = getPaginationParams(request);

    logger.info("incoming GET request", { params: { limit, offset, author } });

    const result = await prisma.message.findMany({
      where: {
        author: {
          equals: String(author),
          mode: "insensitive",
        },
      },
      skip: offset,
      take: limit,
      orderBy: {
        date: "asc",
      },
    });

    if (result.length === 0) {
      return NextResponse.json({
        message: "No message found for this author",
        status: 204,
        data: [],
        count: 0,
      });
    }

    return NextResponse.json({
      message: "Fetched message successfully",
      status: 200,
      data: result,
      count: result.length,
    });
  } catch (error: any) {
    return NextApiErrorHandler(error, "Failed to fetch message");
  }
}
