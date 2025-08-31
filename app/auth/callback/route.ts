// app/auth/callback/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookies) { cookies.forEach(({ name, value, options }) =>
          cookieStore.set({ name, value, ...options })
        ); },
      },
    }
  );

  // Supabase expects a string (full URL works)
  const { error } = await supabase.auth.exchangeCodeForSession(url.toString());
  if (error) {
    console.error("[auth/callback] exchange error:", error.message);
    return NextResponse.redirect(new URL("/login?error=auth", url.origin));
  }

  // Support ?next=/where/user/was
  const next = url.searchParams.get("next") || "/";
  return NextResponse.redirect(new URL(next, url.origin));
}
