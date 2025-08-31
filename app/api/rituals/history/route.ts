import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok:false, error:"unauthorized" }, { status: 401 });

  const { data: events, error: e1 } = await supabase
    .from("ritual_events")
    .select("id, ritual_id, rating, completed_at")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(20);

  const { data: favs, error: e2 } = await supabase
    .from("ritual_favorites")
    .select("ritual_id")
    .eq("user_id", user.id);

  if (e1 || e2) return NextResponse.json({ ok:false, error: (e1?.message || e2?.message) }, { status: 500 });

  return NextResponse.json({ ok:true, events, favorites: (favs ?? []).map(f => f.ritual_id) }, { status: 200, headers: res.headers });
}
