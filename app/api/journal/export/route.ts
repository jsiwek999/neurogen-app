import { NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
export const runtime = "nodejs";

function csvEscape(s: unknown): string {
  if (s == null) return "";
  const str = String(s);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export async function GET(req: NextRequest) {
  const supabase = await getSupabaseServer(); // <-- await
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const since = searchParams.get("since");
  const until = searchParams.get("until");

  let query = supabase.from("journal_entries").select("*").order("created_at", { ascending: true });
  if (q) query = query.or(`note.ilike.%${q}%,cue.ilike.%${q}%,ritual_title.ilike.%${q}%`);
  if (since) query = query.gte("created_at", since);
  if (until) query = query.lte("created_at", until);

  const { data, error } = await query.limit(50000);
  if (error) return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });

  const header = ["id","created_at","user_id","ritual_title","step_tag","cue","note","tags"].join(",");
  const lines = (data ?? []).map((r: any) =>
    [r.id, r.created_at, r.user_id, r.ritual_title, r.step_tag, r.cue, r.note, Array.isArray(r.tags) ? r.tags.join("|") : ""]
      .map(csvEscape).join(",")
  );
  const csv = [header, ...lines].join("\n");
  const fname = `journal_export_${new Date().toISOString().slice(0,10)}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fname}"`,
      "Cache-Control": "no-store",
    },
  });
}
