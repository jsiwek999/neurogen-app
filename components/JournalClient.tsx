"use client";
import { useEffect, useMemo, useState } from "react";

type Entry = {
  id: string;
  created_at: string;
  ritual_title: string;
  cue: string | null;
  step_tag: string | null;
  note: string;
  user_id: string | null;
};

type Props = {
  initial: { entries: Entry[]; count: number; limit: number; page: number };
};

export default function JournalClient({ initial }: Props) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(initial.page || 1);
  const [limit, setLimit] = useState(initial.limit || 20);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>(initial.entries || []);
  const [count, setCount] = useState(initial.count || 0);

  async function load(p = page, l = limit, query = q) {
    setLoading(true);
    setErr(null);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(l) });
      if (query.trim()) params.set("q", query.trim());
      const res = await fetch(`/api/journal?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || `Fetch failed (${res.status})`);
      setEntries(data.entries || []);
      setCount(data.count || 0);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load(1, limit, q);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  // Load when page/limit changes
  useEffect(() => {
    load(page, limit, q);
  }, [page, limit]);

  const totalPages = Math.max(1, Math.ceil(count / limit));

  const onCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="flex-1 min-w-[220px] rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-white/20"
          placeholder="Search notes, cues, or titles…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="rounded-lg bg-white/5 border border-white/10 px-3 py-2"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value, 10))}
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n}/page</option>
          ))}
        </select>
      </div>

      {err && <div className="text-red-300 text-sm">{err}</div>}
      {loading && <div className="opacity-70 text-sm">Loading…</div>}

      <ul className="divide-y divide-white/10 rounded-xl border border-white/10 overflow-hidden">
        {(entries || []).map((e) => (
          <li key={e.id} className="p-4 bg-white/5 hover:bg-white/10 transition">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm opacity-70">
                {new Date(e.created_at).toLocaleString()}
              </div>
              <div className="text-xs rounded-full px-2 py-0.5 bg-white/10">
                {e.step_tag || "journal"}
              </div>
            </div>
            <div className="mt-1 text-base font-medium">{e.ritual_title}</div>
            {e.cue && <div className="mt-1 text-sm opacity-80 italic">Cue: {e.cue}</div>}
            <p className="mt-2">{e.note}</p>
            <div className="mt-3 flex gap-2">
              <button
                className="text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
                onClick={() => onCopy(e.note)}
                title="Copy note"
              >
                Copy Note
              </button>
              {e.cue && (
                <button
                  className="text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
                  onClick={() => onCopy(e.cue!)}
                  title="Copy cue"
                >
                  Copy Cue
                </button>
              )}
            </div>
          </li>
        ))}
        {(!entries || entries.length === 0) && !loading && (
          <li className="p-6 text-center opacity-70">No entries yet.</li>
        )}
      </ul>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm opacity-70">
          {count} {count === 1 ? "entry" : "entries"} • page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
