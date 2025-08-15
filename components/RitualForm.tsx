"use client";
import { useEffect, useRef, useState } from "react";

type HistItem = {
  id: string;
  goal: string;
  ritual: string;
  ts: number;
  energy?: number;
  form?: number;
  charged?: boolean;
};

const PRESETS = ["calm under pressure","focus now","resolve","presence","courage","grounded"];

function energyDesc(v:number){
  if(v<=20) return "whisper / ultra-gentle";
  if(v<=40) return "gentle";
  if(v<=60) return "balanced";
  if(v<=80) return "charged";
  return "intense";
}
function formDesc(v:number){
  if(v<=20) return "loose / free";
  if(v<=40) return "soft structure";
  if(v<=60) return "balanced";
  if(v<=80) return "structured";
  return "strict / ritualistic";
}

export default function RitualForm() {
  const [goal, setGoal] = useState("calm under pressure");
  const [energy, setEnergy] = useState<number>(() => { try { const v=localStorage.getItem("emx-energy"); return v? Number(v):50; } catch { return 50; }});
  const [form, setForm] = useState<number>(() => { try { const v=localStorage.getItem("emx-form"); return v? Number(v):50; } catch { return 50; }});
  const [charged, setCharged] = useState<boolean>(() => { try { return localStorage.getItem("emx-charged")==="1"; } catch { return false; }});

  const [output, setOutput] = useState("");
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistItem[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const KEY = "ritual-history";

  // 10s micro-timer state
  const MICRO_SECONDS = 10;
  const [tActive, setTActive] = useState(false);
  const [tRemaining, setTRemaining] = useState(MICRO_SECONDS);

  useEffect(() => { try { const raw=localStorage.getItem(KEY); if(raw) setHistory(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem("emx-energy", String(energy)); } catch {} }, [energy]);
  useEffect(() => { try { localStorage.setItem("emx-form", String(form)); } catch {} }, [form]);
  useEffect(() => { try { localStorage.setItem("emx-charged", charged? "1":"0"); } catch {} }, [charged]);

  // timer tick
  useEffect(() => {
    let id:any = null;
    if (tActive && tRemaining > 0) {
      id = setInterval(() => { setTRemaining(s => s>0 ? s-1 : 0); }, 1000);
    }
    if (tRemaining === 0 && tActive) {
      setTActive(false);
    }
    return () => { if(id) clearInterval(id); };
  }, [tActive, tRemaining]);

  function startTimer(){ setTActive(true); }
  function pauseTimer(){ setTActive(false); }
  function resetTimer(){ setTActive(false); setTRemaining(MICRO_SECONDS); }

  function persist(next: HistItem[]) {
    setHistory(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  }
  function addToHistory(g: string, r: string, e:number, f:number, c:boolean) {
    const id = (crypto as any).randomUUID?.() ?? String(Date.now()) + "-" + Math.random();
    persist([{ id, goal: g, ritual: r, ts: Date.now(), energy: e, form: f, charged: c }, ...history].slice(0,50));
  }

  const offline = (g: string) =>
    "Title: " + g + "\n" +
    "Duration: ≤2 minutes\n\n" +
    "PLAIN (do this):\n" +
    "[breathe] One slow breath.\n" +
    "[mirror] “What matters in the next 5 minutes?”\n" +
    "[shift] From spinning to single-task.\n" +
    "[install] “I move one piece forward.”\n\n" +
    "MYTHIC (same function, symbolic):\n" +
    "[ritual] Place your palm on your chest — claim the center.\n" +
    "[identity] The Anchor.\n" +
    "[install] “I hold fast; the storm passes.”";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!goal.trim()) return;
    setLoading(true); setError(null); setOutput("");

    // Fold sliders + charge into the goal guidance (keeps server unchanged)
    let styledGoal =
      goal.trim() + "\n" +
      "(Energy: " + energyDesc(energy) + " — target " + energy + "/100; " +
      "Form: " + formDesc(form) + " — target " + form + "/100. ";
    if (charged) {
      styledGoal += "Charge: ON — include breath counts and cadence; add a 10-second settle cue and a clear closing gesture.)";
    } else {
      styledGoal += "Charge: OFF — keep concise without explicit timers.)";
    }

    try {
      const res = await fetch("/api/ritual",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        cache:"no-store",
        body: JSON.stringify({ goal: styledGoal })
      });
      const raw = await res.text();
      const isJson = (res.headers.get("content-type")||"").includes("application/json");
      const data = isJson && raw ? JSON.parse(raw) : null;

      if (!res.ok) throw new Error((data && data.error) || raw || "Request failed");

      const ritual = (data?.ritual || "").toString().trim();
      if (!ritual) throw new Error("Empty response from generator.");

      setOutput(ritual);
      addToHistory(goal, ritual, energy, form, charged);

      // If charged, auto-start the 10s micro-timer
      if (charged) { resetTimer(); setTimeout(() => { startTimer(); }, 0); }
    } catch(err:any) {
      setError(String(err?.message || err));
      setOutput("Error generating ritual. Showing offline template.\n\n" + offline(goal));
    } finally {
      setLoading(false);
    }
  }

  function applyPreset(text: string, autoGenerate?: boolean) {
    setGoal(text);
    if (autoGenerate) setTimeout(() => { formRef.current?.requestSubmit(); }, 0);
  }

  async function copy(text:string){ if(!text) return; try { await navigator.clipboard.writeText(text); } catch {} }
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
  function removeFromHistory(id:string){ persist(history.filter(h=>h.id!==id)); }
  function clearHistory(){ persist([]); }

  const progressPct = Math.max(0, (MICRO_SECONDS - tRemaining) / MICRO_SECONDS * 100);

  return (
    <div className="space-y-8">
      {/* Generator */}
      <div className="card p-6 space-y-3">
        <h3 className="text-lg font-semibold">Generate a Ritual</h3>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button
              key={p}
              type="button"
              className="btn btn-ghost text-sm"
              onClick={() => applyPreset(p, false)}
              onDoubleClick={() => applyPreset(p, true)}
              title="Click to fill • Double-click to generate"
            >
              {p}
            </button>
          ))}
        </div>
        <div className="text-xs" style={{opacity:.7}}>Tip: double-click a preset to generate instantly.</div>

        {/* Energy / Form / Charge */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium">Energy</div>
            <input type="range" min={0} max={100} value={energy} onChange={e=>setEnergy(Number(e.target.value))} className="w-full" />
            <div className="text-xs" style={{opacity:.7}}>{energy}/100 • {energyDesc(energy)}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium">Form</div>
            <input type="range" min={0} max={100} value={form} onChange={e=>setForm(Number(e.target.value))} className="w-full" />
            <div className="text-xs" style={{opacity:.7}}>{form}/100 • {formDesc(form)}</div>
          </div>
          <div className="rounded-lg border p-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">Charge</div>
              <div className="text-xs" style={{opacity:.7}}>
                When ON: add breath counts/cadence and a 10s settle cue.
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={charged} onChange={e=>setCharged(e.target.checked)} />
              <span className="text-sm">ON</span>
            </label>
          </div>
        </div>

        <form ref={formRef} onSubmit={submit} className="flex gap-2" autoComplete="off">
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
          <button className="btn" type="button" onClick={()=>download(output,(goal||"ritual")+".txt")} disabled={!output}>Download .txt</button>
        </div>

        <pre className="text-sm whitespace-pre-wrap bg-black/10 p-4 rounded-xl border border-white/10 min-h-[160px]">
{output}
        </pre>

        {/* Micro-timer appears only when charged + we have output */}
        {charged && !!output && (
          <div className="rounded-lg border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">10-second micro-timer</div>
              <div className="text-sm" style={{opacity:.7}}>{tRemaining}s</div>
            </div>
            <div className="h-2 rounded bg-black/10">
              <div className="h-2 rounded" style={{ width: (progressPct + "%"), background:"rgba(0,0,0,0.4)" }} />
            </div>
            <div className="flex gap-2">
              {!tActive ? (
                <button type="button" className="btn" onClick={startTimer}>Start</button>
              ) : (
                <button type="button" className="btn" onClick={pauseTimer}>Pause</button>
              )}
              <button type="button" className="btn btn-ghost" onClick={resetTimer}>Reset</button>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">History</h3>
          {history.length > 0 && (
            <button className="btn btn-ghost text-sm" onClick={clearHistory}>Clear all</button>
          )}
        </div>

        {history.length===0 ? (
          <p className="text-sm" style={{opacity:.8}}>No rituals yet. Generate one to see it here.</p>
        ) : (
          <ul className="space-y-3">
            {history.map(h=>(
              <li key={h.id} className="rounded-lg border p-3" style={{borderColor:"var(--border)"}}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{h.goal}</div>
                    <div className="text-[11px]" style={{opacity:.6}}>
                      {(typeof h.energy==="number" ? ("Energy "+h.energy+"/100") : "")}
                      {(typeof h.energy==="number" && typeof h.form==="number" ? " • " : "")}
                      {(typeof h.form==="number" ? ("Form "+h.form+"/100") : "")}
                      {(typeof h.charged==="boolean" ? ( (h.energy||h.form)? " • ":"") + (h.charged? "Charged":"Uncharged") : "")}
                    </div>
                    <pre className="mt-1 text-xs whitespace-pre-wrap max-h-32 overflow-auto bg-black/5 p-2 rounded">
{h.ritual}
                    </pre>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button className="btn btn-ghost text-sm" onClick={() => navigator.clipboard.writeText(h.ritual)}>Copy</button>
                    <button className="btn btn-ghost text-sm" onClick={() => download(h.ritual, (h.goal||"ritual")+".txt")}>Download</button>
                    <button className="btn btn-ghost text-sm" onClick={() => { setGoal(h.goal); setOutput(h.ritual); setError(null); }}>
                      Load
                    </button>
                    <button className="btn btn-ghost text-sm" onClick={() => removeFromHistory(h.id)} style={{color:"#ef4444"}}>Delete</button>
                  </div>
                </div>
                <div className="mt-2 text-[11px]" style={{opacity:.6}}>{new Date(h.ts).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}