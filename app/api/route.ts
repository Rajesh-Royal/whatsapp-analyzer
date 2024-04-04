import { NextResponse } from 'next/server'
import { NextApiRequest, NextApiResponse } from 'next';
import { decode } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]/route';

const secret = process.env.AUTH_SECRET;

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({ message: 'You are unauthorized' }, {status: 401})
  // Process a GET request
  return NextResponse.json({ message: 'Hello from Next.js!' })
}