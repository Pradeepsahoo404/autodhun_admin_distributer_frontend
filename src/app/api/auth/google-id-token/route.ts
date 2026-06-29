import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

/** Returns the Google id_token from the NextAuth session (server reads the cookie). */
export async function GET() {
  const session = await getServerSession(authOptions);
  const idToken = session?.idToken;

  if (!idToken) {
    return NextResponse.json({ idToken: null }, { status: 401 });
  }

  return NextResponse.json({ idToken });
}
