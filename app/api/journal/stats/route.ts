import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const supabase = await getSupabaseServer(); // <-- await
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = Math.max(1, Math.min(parseInt(searchParams.get("days") || "30", 10), 365));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(10000);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const entries = (data ?? []) as any[];
  const total = entries.length;
  const byDay: Record<string, number> = {};
  const tags: Record<string, number> = {};
  let chars = 0;

  for (const e of entries) {
    const d = e.created_at.slice(0, 10);
    byDay[d] = (byDay[d] || 0) + 1;
    const t = (e.step_tag || "journal").toLowerCase();
    tags[t] = (tags[t] || 0) + 1;
    chars += (e.note || "").length;
  }

  return NextResponse.json({
    ok: true,
    range_days: days,
    total,
    avg_note_length: total ? Math.round(chars / total) : 0,
    top_tags: Object.entries(tags).map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count).slice(0, 10),
    by_day: Object.entries(byDay).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)),
  });
}
