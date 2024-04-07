import { z } from 'zod';
import { NextRequest } from 'next/server';
import { ZOD_VALIDATION_ERROR } from './constants';

interface PaginationParams {
  limit?: number;
  offset?: number;
}

// Define a schema for the query parameters
const schema = z.object({
  limit: z.string().optional().refine(value => !isNaN(Number(value)), {
    message: 'limit must be a number',
  }),
  offset: z.string().optional().refine(value => !isNaN(Number(value)), {
    message: 'offset must be a number',
  }),
});

export function getPaginationParams(request: NextRequest): PaginationParams {
  const urlParams = new URLSearchParams(request.nextUrl.search);
  const params = {
    limit: urlParams.get('limit'),
    offset: urlParams.get('offset'),
  };

  // Validate the query parameters
  const result = schema.safeParse(params);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.errors), {cause: ZOD_VALIDATION_ERROR});
  }

  return {
    limit: result.data.limit ? Number(result.data.limit) : undefined,
    offset: result.data.offset ? Number(result.data.offset) : undefined,
  };
}
