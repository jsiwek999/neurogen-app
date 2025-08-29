// app/api/logout/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  // Nuke a few common session cookie names; harmless if they don't exist.
  const names = [
    "session",
    "auth-token",
    "token",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
  ];

  names.forEach((name) => {
    res.cookies.set(name, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
  });

  return res;
}

export function GET() {
  return new Response("Use POST", { status: 405, headers: { Allow: "POST" } });
}
