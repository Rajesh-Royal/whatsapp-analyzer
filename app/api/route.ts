import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Process a GET request
  return NextResponse.json({ message: 'Hello from Next.js!' })
}