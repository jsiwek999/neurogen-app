// app/auth/signout/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// shared signout
async function doSignOut() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        // Next.js App Router responses manage cookies; no-ops here are fine
        set() {},
        remove() {},
      },
    }
  );
  await supabase.auth.signOut();
}

// support both GET and POST
export async function GET() {
  await doSignOut();
  // relative redirect = same-origin (no localhost footguns)
  return NextResponse.redirect('/', { status: 303 });
}

export async function POST() {
  await doSignOut();
  return NextResponse.redirect('/', { status: 303 });
}
