export const runtime = 'nodejs';

import { supabaseService } from '@/lib/supabase/service';

type Props = { searchParams: { token?: string } };

async function count(where?: (q: any)=>any) {
  let q = supabaseService.from('newsletter_subscribers').select('*', { count: 'exact', head: true });
  if (where) q = where(q);
  const { count } = await q;
  return count ?? 0;
}

export default async function Page({ searchParams }: Props) {
  const ok = searchParams.token && searchParams.token === process.env.ADMIN_METRICS_TOKEN;
  if (!ok) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Metrics</h1>
        <p className="text-sm mt-2 text-red-500">Unauthorized. Append <code>?token=…</code>.</p>
      </div>
    );
  }

  const now = Date.now();
  const iso7d = new Date(now - 7*24*3600*1000).toISOString();

  const [total, confirmed, unsubscribed, new7d, confirmed7d] = await Promise.all([
    count(),
    count(q => q.not('confirmed_at', 'is', null)),
    count(q => q.not('unsubscribed_at', 'is', null)),
    count(q => q.gte('created_at', iso7d)),
    count(q => q.gte('confirmed_at', iso7d).not('confirmed_at', 'is', null)),
  ]);

  // naive top sources (last 1000 rows)
  const { data: rows = [] } = await supabaseService
    .from('newsletter_subscribers')
    .select('utm_source')
    .order('created_at', { ascending: false })
    .limit(1000);

  const bySource = new Map<string, number>();
  for (const r of rows) {
    const key = (r.utm_source || 'direct/none').slice(0, 64);
    bySource.set(key, (bySource.get(key) || 0) + 1);
  }
  const topSources = Array.from(bySource.entries()).sort((a,b)=>b[1]-a[1]).slice(0,5);

  const confirmRate = total ? (confirmed / total) : 0;
  const confirmRate7d = new7d ? (confirmed7d / new7d) : 0;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">EMX Metrics</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card label="Total signups" value={total} />
        <Card label="Confirmed" value={confirmed} />
        <Card label="Confirm rate" value={(confirmRate*100).toFixed(1) + '%'} />
        <Card label="New (7d)" value={new7d} />
        <Card label="Confirmed (7d)" value={confirmed7d} />
        <Card label="7d confirm rate" value={(confirmRate7d*100).toFixed(1) + '%'} />
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">Top sources (last 1k)</h2>
        <ul className="list-disc pl-5 text-sm">
          {topSources.map(([k,v]) => (
            <li key={k}><span className="font-mono">{k}</span> — {v}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Card({label, value}:{label:string; value: React.ReactNode}) {
  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-white/[0.02]">
      <div className="text-xs uppercase tracking-wider text-white/60">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
