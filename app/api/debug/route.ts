// app/api/debug/route.ts
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const env = process.env.VERCEL_ENV || 'production';
  if (env === 'production') {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  const { origin } = new URL(req.url);
  return NextResponse.json({
    ok: true, origin, vercel_env: env,
    env_present: {
      NEXT_PUBLIC_SITE_URL: !!process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: !!process.env.RESEND_FROM_EMAIL,
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_DEFAULT_PRICE_ID: !!process.env.STRIPE_DEFAULT_PRICE_ID,
      SUBSCRIBE_TOKEN_SECRET: !!process.env.SUBSCRIBE_TOKEN_SECRET,
    },
  });
}
