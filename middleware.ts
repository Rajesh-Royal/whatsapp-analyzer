import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
  
    if(request.method === "GET"){
      const urlParams = new URLSearchParams(request.nextUrl.search);
    const params: {[x: string]: string} = {};

    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }

    console.info('incoming GET request', { params });
    }
  }

  return NextResponse.next();
}

// to solve Prisma: TypeError: Do not know how to serialize a BigInt
// @ts-ignore
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};
