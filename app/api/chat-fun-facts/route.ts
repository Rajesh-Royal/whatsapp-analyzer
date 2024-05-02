import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createLogger } from "@/lib/logger";
import { NextApiErrorHandler } from "@/lib/apiError";
import { getChatFunFacts } from "@/data/whatsapp-chat/chat-fun-facts";

const logger = createLogger("app/api/chat-fun-facts");

export async function GET(request: NextRequest) {
  try {
    const urlParams = new URLSearchParams(request.nextUrl.search);
    const author = urlParams.get("author");

    logger.info("incoming GET request", { params: { author } });

    const result = await getChatFunFacts(author);

    return NextResponse.json({
      message: "Fetched messages fun facts successfully",
      status: 200,
      data: [result],
      count: Object.keys(result).length || 0,
    });
  } catch (error: any) {
    return NextApiErrorHandler(
      error,
      "Failed to fetch messages fun facts data",
    );
  }
}
