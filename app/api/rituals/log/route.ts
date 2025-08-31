import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const res = new NextResponse();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll(cookies) { cookies.forEach(({ name, value, options }) => res.cookies.set({ name, value, ...(options ?? {}) })); },
      },
    }
  );

  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr || !user) return NextResponse.json({ ok:false, error:"unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { ritual_id, rating } = body ?? {};
  if (!ritual_id) return NextResponse.json({ ok:false, error:"ritual_id required" }, { status: 400 });

  const { error } = await supabase.from("ritual_events").insert({
    user_id: user.id,
    ritual_id,
    rating: (typeof rating === "number" ? rating : null),
  });

  if (error) return NextResponse.json({ ok:false, error:error.message }, { status: 500 });
  return NextResponse.json({ ok:true }, { status: 200, headers: res.headers });
}
