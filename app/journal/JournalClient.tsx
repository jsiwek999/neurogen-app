"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import RitualRunner, { Ritual } from "../components/RitualRunner";

const RITUALS: Ritual[] = [
  {
    id: "two-minute-reset",
    name: "The 2-Minute Reset",
    trigger: "Overwhelm or scattered thoughts",
    result: "Nervous system downshifts, presence returns.",
    steps: [
      { tag: "[breath]", text: "Inhale for 4", timerSec: 4 },
      { tag: "[breath]", text: "Hold for 2", timerSec: 2 },
      { tag: "[breath]", text: "Exhale for 6", timerSec: 6 },
      { tag: "[shift]", text: "Drag your stress into a small glowing sphere in front of you.", timerSec: 8 },
      { tag: "[release]", text: "Blow gently and watch it dissolve into the air.", timerSec: 6 },
    ],
  },
  {
    id: "mirror-invocation",
    name: "Mirror Invocation",
    trigger: "Self-doubt or invisibility",
    result: "Anchors sovereignty and presence.",
    steps: [
      { tag: "[identity]", text: "Speak aloud: “I am responsible. I am the one who creates… As I am.”" },
      { tag: "[install]", text: "Feel the words sink into your spine as truth.", timerSec: 8 },
      { tag: "[breath]", text: "Breathe normally and hold eye contact with yourself for a few breaths.", timerSec: 15 },
    ],
  },
  {
    id: "submodal-switch",
    name: "Submodal Switch",
    trigger: "Looping thought",
    result: "Old loop loses power; new state installs.",
    steps: [
      { tag: "[submodal]", text: "See the loop as a tiny gray movie; shrink it and push it far away.", timerSec: 8 },
      { tag: "[install]", text: "Replace it with a big, bright image of your desired state.", timerSec: 8 },
      { tag: "[breath]", text: "Inhale and step into the image; exhale to lock it in.", timerSec: 6 },
    ],
  },
];

type EventRow = { slug: string; ritual_id: string; rating: number | null; completed_at: string };

export default function JournalClient() {
  const params = useSearchParams();
  const router = useRouter();
  const defaultView = params.get("view") ?? "default";
  const pick = params.get("ritual");
  const [activeId, setActiveId] = useState<string | null>(pick);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<EventRow[]>([]);
  const [loadingHist, setLoadingHist] = useState(false);

  const active = useMemo(() => RITUALS.find(r => r.id === activeId) ?? null, [activeId]);

  async function refresh() {
    setLoadingHist(true);
    try {
      const r = await fetch("/api/rituals/history", { cache: "no-store" });
      if (r.ok) {
        const j = await r.json();
        setFavorites(j.favorites ?? []);
        setHistory(j.events ?? []);
      }
    } finally {
      setLoadingHist(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function toggleFav(id: string) {
    const action = favorites.includes(id) ? "remove" : "add";
    const r = await fetch("/api/rituals/favorite", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ritual_id: id, action }),
    });
    if (r.ok) refresh();
  }

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Journal</h1>
          <p className="text-sm opacity-70">View: {defaultView}</p>
        </div>
        <nav className="flex gap-2">
          <a href="/rituals" className="rounded-xl border px-4 py-2 text-sm hover:bg-white/5 transition">Ritual FAQ</a>
        </nav>
      </header>

      {/* Ritual Cards */}
      <section>
        <h2 className="text-lg font-medium mb-3">Try a Ritual</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {RITUALS.map((r) => {
            const fav = favorites.includes(r.id);
            return (
              <article key={r.id} className="rounded-2xl border bg-black/20 p-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{r.name}</h3>
                    <p className="text-sm mt-1"><span className="opacity-60">Trigger:</span> {r.trigger}</p>
                    <p className="text-sm opacity-80 mt-1">{r.result}</p>
                  </div>
                  <button onClick={() => toggleFav(r.id)} className="text-xl leading-none px-2 py-1 rounded-md hover:bg-white/10" title={fav ? "Unfavorite" : "Favorite"}>
                    {fav ? "⭐" : "☆"}
                  </button>
                </div>

                <div className="flex gap-2 mt-3">
                  <button onClick={() => setActiveId(r.id)} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20 transition" aria-label={`Try ${r.name}`}>
                    Try this ritual
                  </button>
                  <a href={`/journal?ritual=${r.id}`} className="rounded-xl border px-3 py-2 text-sm hover:bg-white/5 transition" title="Permalink">Link</a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Live Ritual Panel */}
      <section>
        {!active ? (
          <div className="rounded-2xl border p-5 bg-black/20">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Live Ritual</h2>
              <button onClick={() => setActiveId(null)} className="rounded-xl border px-3 py-1.5 text-sm hover:bg-white/5 transition">Clear</button>
            </div>
            <p className="opacity-70 mt-2">Pick a ritual to load a step-by-step guide here.</p>
          </div>
        ) : (
          <RitualRunner ritual={active} onExit={() => { setActiveId(null); router.push("/journal"); refresh(); }} />
        )}
      </section>

      {/* History */}
      <section className="rounded-2xl border p-5 bg-black/20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Completions</h2>
          <button onClick={refresh} className="rounded-xl border px-3 py-1.5 text-sm hover:bg-white/5 transition" disabled={loadingHist}>
            {loadingHist ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        {history.length === 0 ? (
          <p className="opacity-70 mt-2">No completions yet — run a ritual and hit “Done.”</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {history.map((e) => {
              const r = RITUALS.find(x => x.id === e.ritual_id);
              return (
                <li key={e.id} className="text-sm flex items-center justify-between">
                  <span>
                    <span className="font-medium">{r?.name ?? e.ritual_id}</span>
                    <span className="opacity-60"> — {new Date(e.completed_at).toLocaleString()}</span>
                  </span>
                  <span className="opacity-80">{e.rating ? `⭐ ${e.rating}` : ""}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
