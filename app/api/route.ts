import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, res: NextResponse) {
  // Process a GET request
  return NextResponse.json({ message: 'Hello from Next.js!' })
}