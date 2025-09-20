// app/auth/signout/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

async function doSignOut() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );
  await supabase.auth.signOut();
}

export async function GET(req: Request) {
  await doSignOut();
  return NextResponse.redirect(new URL('/', req.url), { status: 303 });
}

export async function POST(req: Request) {
  await doSignOut();
  return NextResponse.redirect(new URL('/', req.url), { status: 303 });
}
