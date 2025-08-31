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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok:false, error:"unauthorized" }, { status: 401 });

  const { ritual_id, action } = await req.json();
  if (!ritual_id || !["add","remove"].includes(action)) {
    return NextResponse.json({ ok:false, error:"ritual_id and action add|remove required" }, { status: 400 });
  }

  if (action === "add") {
    const { error } = await supabase.from("ritual_favorites").insert({ user_id: user.id, ritual_id }).select().single();
    if (error && !error.message.includes("duplicate key")) {
      return NextResponse.json({ ok:false, error:error.message }, { status: 500 });
    }
  } else {
    const { error } = await supabase.from("ritual_favorites").delete().eq("user_id", user.id).eq("ritual_id", ritual_id);
    if (error) return NextResponse.json({ ok:false, error:error.message }, { status: 500 });
  }

  return NextResponse.json({ ok:true }, { status: 200, headers: res.headers });
}
