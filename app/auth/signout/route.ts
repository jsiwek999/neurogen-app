// app/auth/signout/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

async function doSignOut() {
  // Next 15: cookies() can be Promise-like — await it
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // In route handlers, Next manages response cookies;
        // no-ops keep the adapter happy.
        set() {},
        remove() {},
      },
    }
  );

  await supabase.auth.signOut();
}

// Support both GET and POST
export async function GET() {
  await doSignOut();
  // Relative redirect = always same-origin (no localhost footguns)
  return NextResponse.redirect('/', { status: 303 });
}

export async function POST() {
  await doSignOut();
  return NextResponse.redirect('/', { status: 303 });
}
