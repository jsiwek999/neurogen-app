// app/api/emx/save/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Accept the payload and noop-save (for now)
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ ok: true, received: body });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
