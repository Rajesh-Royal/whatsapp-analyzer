import { NextRequest } from "next/server";

// Define a type for the pagination parameters
type PaginationParams = {
  limit: number | undefined;
  offset: number | undefined;
};

// Create a function to get the pagination parameters from the request
export function getPaginationParams(request: NextRequest): PaginationParams {
  const urlParams = new URLSearchParams(request.nextUrl.search);
  const limit = Number(urlParams.get('limit')) || undefined
  const offset = Number(urlParams.get('offset')) || undefined

  return { limit, offset };
}
