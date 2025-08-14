"use client";
import { useEffect, useState } from "react";
type HistItem = { id: string; goal: string; ritual: string; ts: number };

export default function RitualForm() {
  const [goal, setGoal] = useState("calm under pressure");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistItem[]>([]);
  const KEY = "ritual-history";

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setHistory(JSON.parse(raw)); } catch {}
  }, []);

  function persist(next: HistItem[]) {
    setHistory(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  }

  function addToHistory(goal: string, ritual: string) {
    const id = (crypto as any).randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    persist([{ id, goal, ritual, ts: Date.now() }, ...history].slice(0,50));
  }

  const offline = (g: string) => `Title: ${g}
Duration: ≤2 minutes

PLAIN (do this):
[breathe] One slow breath.
[mirror] “What matters in the next 5 minutes?”
[shift] From spinning to single-task.
[install] “I move one piece forward.”

MYTHIC (same function, symbolic):
[ritual] Place your palm on your chest — claim the center.
[identity] The Anchor.
[install] “I hold fast; the storm passes.”`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!goal.trim()) return;
    setLoading(true); setError(null); setOutput("");
    try {
      const res = await fetch("/api/ritual",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        cache:"no-store",
        body: JSON.stringify({ goal })
      });
      const raw = await res.text();
      const isJson = (res.headers.get("content-type")||"").includes("application/json");
      const data = isJson && raw ? JSON.parse(raw) : null;

      if (!res.ok) throw new Error((data && data.error) || raw || `HTTP ${res.status}`);

      const ritual = (data?.ritual || "").toString().trim();
      if (!ritual) throw new Error("Empty response from generator.");

      setOutput(ritual);
      addToHistory(goal, ritual);
    } catch(err:any) {
      setError(String(err?.message || err));
      setOutput("Error generating ritual. Showing offline template.\n\n"+offline(goal));
    } finally {
      setLoading(false);
    }
  }

  async function copy(text:string){
    if(!text) return;
    try { await navigator.clipboard.writeText(text); } catch {}
  }

  function download(text:string,name="ritual.txt"){
    if(!text) return;
    const blob=new Blob([text],{type:"text/plain"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=name.replace(/[^\w.-]+/g,"_");
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      {/* Generator */}
      <div className="card p-6 space-y-3">
        <h3 className="text-lg font-semibold">Generate a Ritual</h3>
        <div className="text-sm" style={{opacity:.8}}>
          Type a short goal (e.g., “calm under pressure”), then press <b>Create</b>. Use <b>Copy</b>/<b>Download</b>. Saved to <b>History</b>.
        </div>

        {/* The input + button you’re missing */}
        <form onSubmit={submit} className="flex gap-2" autoComplete="off">
          <input
            className="input flex-1"
            value={goal}
            onChange={e=>setGoal(e.target.value)}
            placeholder="goal (e.g., calm, focus, courage)"
          />
          <button type="submit" className="btn" disabled={loading || !goal.trim()}>
            {loading ? "Creating…" : "Create"}
          </button>
        </form>

        {error && <div className="text-red-500 text-sm">Error: {error}</div>}

        <div className="flex gap-2">
          <button className="btn" type="button" onClick={()=>copy(output)} disabled={!output}>Copy</button>
          <button className="btn" type="button" onClick={()=>download(output,`${goal||"ritual"}.txt`)} disabled={!output}>Download .txt</button>
        </div>

        <pre className="text-sm whitespace-pre-wrap bg-black/10 p-4 rounded-xl border border-white/10 min-h-[160px]">
{output}
        </pre>
      </div>

      {/* History */}
      <div className="card p-6 space-y-4">
        <h3 className="text-lg font-semibold">History</h3>
        {history.length===0 ? (
          <p className="text-sm" style={{opacity:.8}}>No rituals yet. Generate one to see it here.</p>
        ) : (
          <ul className="space-y-3">
            {history.map(h=>(
              <li key={h.id} className="rounded-lg border p-3" style={{borderColor:"var(--border)"}}>
                <div className="font-medium truncate">{h.goal}</div>
                <pre className="mt-1 text-xs whitespace-pre-wrap max-h-32 overflow-auto bg-black/5 p-2 rounded">{h.ritual}</pre>
                <div className="mt-2 text-[11px]" style={{opacity:.6}}>{new Date(h.ts).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}