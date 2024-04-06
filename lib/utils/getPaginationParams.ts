import { NextRequest } from "next/server";

// Define a type for the pagination parameters
type PaginationParams = {
  limit: number;
  offset: number;
};

// Create a function to get the pagination parameters from the request
export function getPaginationParams(request: NextRequest): PaginationParams {
  const urlParams = new URLSearchParams(request.nextUrl.search);
  const limit = Number(urlParams.get('limit')) || 50; // Default limit is 50
  const offset = Number(urlParams.get('offset')) || 0; // Default offset is 0

  return { limit, offset };
}
