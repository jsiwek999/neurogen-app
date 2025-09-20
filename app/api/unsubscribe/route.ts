// app/api/unsubscribe/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { supabaseService } from '@/lib/supabase/service';

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
    const { payload } = await jwtVerify(token, key);
    const email = String(payload.email || '');
    if (!email) throw new Error('no email');

    await supabaseService
      .from('newsletter_subscribers')
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq('email', email);

    return NextResponse.redirect(absolute(req, '/updates?unsubscribed=1'), { status: 303 });
  } catch {
    return NextResponse.redirect(absolute(req, '/updates?error=Invalid%20link'), { status: 303 });
  }
}
