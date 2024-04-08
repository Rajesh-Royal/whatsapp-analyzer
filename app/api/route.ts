import { NextRequest, NextResponse } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/auth';

const secret = process.env.AUTH_SECRET;

export async function GET(req: NextRequest, res: NextResponse) {
  // Process a GET request
  return NextResponse.json({ message: 'Hello from Next.js!' })
}