// app/api/emx/route.ts
import { NextResponse } from "next/server";
import { emxCall } from "../../../lib/emx/client"; // <-- use relative to be safe

export const runtime = "nodejs"; // ok to switch to 'edge' later
export const dynamic = "force-dynamic"; // avoid static optimization quirks

export async function POST(req: Request) {
  try {
    const { authoring } = await req.json();
    if (typeof authoring !== "string" || !authoring.trim()) {
      return NextResponse.json(
        { error: "authoring required" },
        { status: 400 },
      );
    }
    const result = await emxCall(authoring);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Internal error" },
      { status: 500 },
    );
  }
}

// Handy for quick pings / health checks
export async function GET() {
  return NextResponse.json({ ok: true });
}
