import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

const PostBody = z.object({
  ritualTitle: z.string().min(1),
  cue: z.string().optional(),
  stepTag: z.string().optional(),
  note: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServer(); // <-- await
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = PostBody.parse(await req.json());
    const { data: inserted, error } = await supabase
      .from("journal_entries")
      .insert({
        ritual_title: body.ritualTitle,
        cue: body.cue ?? null,
        step_tag: body.stepTag ?? null,
        note: body.note,
        user_id: user.id,
        tags: body.tags ?? null,
      })
      .select("id")
      .single();

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id: inserted?.id ?? null }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Invalid body" }, { status: 400 });
  }
}

const GetQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  q: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const supabase = await getSupabaseServer(); // <-- await
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const parsed = GetQuery.parse({
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });

  const offset = (parsed.page - 1) * parsed.limit;
  let query = supabase
    .from("journal_entries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + parsed.limit - 1);

  if (parsed.q?.trim()) {
    const q = parsed.q.trim();
    query = query.or(`note.ilike.%${q}%,cue.ilike.%${q}%,ritual_title.ilike.%${q}%`);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, entries: data ?? [], count: count ?? 0, page: parsed.page, limit: parsed.limit });
}
