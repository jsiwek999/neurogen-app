"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
const JournalLineChart = dynamic(() => import("./JournalLineChart"), {
  ssr: false,
  loading: () => <div className="opacity-70 text-sm">Loading chart…</div>,
});




type Stats = {
  ok: boolean;
  range_days: number;
  total: number;
  avg_note_length: number;
  top_tags: { tag: string; count: number }[];
  by_day: { date: string; count: number }[];
  error?: string;
};

type Props = {
  days?: number;      // 7, 14, 30, 90…
  userId?: string;    // optional: scope to a user later
};

export default function JournalStats({ days: daysProp = 30, userId }: Props) {
  const [days, setDays] = useState(daysProp);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load(d = days) {
    setLoading(true);
    setErr(null);
    try {
      const params = new URLSearchParams({ days: String(d) });
      if (userId) params.set("userId", userId);
      const res = await fetch(`/api/journal/stats?${params.toString()}`, { cache: "no-store" });
      const data = (await res.json()) as Stats;
      if (!res.ok || !data?.ok) throw new Error(data?.error || `Stats failed (${res.status})`);
      setStats(data);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(days); /* eslint-disable-next-line */ }, []);
  useEffect(() => { load(days); /* eslint-disable-next-line */ }, [days, userId]);

  const maxCount = useMemo(() => {
    return stats?.by_day?.reduce((m, d) => Math.max(m, d.count), 0) || 0;
  }, [stats]);

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-xl font-semibold">Stats</h2>
        <select
          className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value, 10))}
          title="Range"
        >
          {[7, 14, 30, 90].map((n) => (
            <option key={n} value={n}>{n} days</option>
          ))}
        </select>
      </div>

      {loading && <div className="opacity-70 text-sm mb-2">Loading stats…</div>}
      {err && <div className="text-red-300 text-sm mb-2">{err}</div>}

      {!loading && !err && stats && (
        <div className="grid gap-4 md:grid-cols-3">
          {/* Totals card */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm opacity-70">Total entries</div>
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="mt-2 text-sm opacity-70">
              Avg note length: <span className="font-medium">{stats.avg_note_length}</span> chars
            </div>
            <div className="mt-1 text-xs opacity-60">Range: {stats.range_days} days</div>
          </div>

          {/* Top tags */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm opacity-70 mb-2">Top tags</div>
            {stats.top_tags.length === 0 ? (
              <div className="text-sm opacity-60">No tags yet.</div>
            ) : (
              <ul className="space-y-1">
                {stats.top_tags.map((t) => (
                  <li key={t.tag} className="flex items-center gap-2">
                    <span className="text-xs rounded-full px-2 py-0.5 bg-white/10">{t.tag}</span>
                    <span className="text-sm opacity-80">× {t.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* By-day mini chart */}
          // …inside the JSX where the “Entries by day” box is:
<div className="rounded-xl border border-white/10 bg-white/5 p-4">
  <div className="text-sm opacity-70 mb-2">Entries by day</div>
  <JournalLineChart data={stats.by_day} />
</div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm opacity-70 mb-2">Entries by day</div>
            {stats.by_day.length === 0 ? (
              <div className="text-sm opacity-60">No activity in range.</div>
            ) : (
              <div
                className="flex items-end gap-1 h-24"
                role="img"
                aria-label="Entries per day bar chart"
                title="Entries per day"
              >
                {stats.by_day.map((d) => {
                  const pct = maxCount ? Math.round((d.count / maxCount) * 100) : 0;
                  return (
                    <div key={d.date} className="flex flex-col items-center gap-1">
                      <div
                        className="w-2 rounded bg-white/60"
                        style={{ height: `${Math.max(6, pct)}%` }}
                        title={`${d.date}: ${d.count}`}
                        aria-label={`${d.date}: ${d.count}`}
                      />
                    </div>
                  );
                })}
              </div>
            )}
            {stats.by_day.length > 0 && (
              <div className="mt-2 text-xs opacity-60">
                Max/day: {maxCount}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
