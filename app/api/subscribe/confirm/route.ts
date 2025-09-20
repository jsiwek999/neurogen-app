// app/api/subscribe/confirm/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

function absolute(req: Request, pathAndQuery: string) {
  return new URL(pathAndQuery, req.url);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') || '';
  try {
    const secret = process.env.SUBSCRIBE_TOKEN_SECRET;
    if (!secret) throw new Error('missing secret');
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key); // throws if invalid/expired
    const email = String(payload.email || '');
    if (!email) throw new Error('no email');
    // (Optional) mark confirmed in DB here
    return NextResponse.redirect(absolute(req, '/updates?confirmed=1'), { status: 303 });
  } catch {
    return NextResponse.redirect(absolute(req, '/updates?error=Invalid%20or%20expired%20link'), { status: 303 });
  }
}
