"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

export type RitualStep = { tag: string; text: string; timerSec?: number };
export type Ritual = {
  id: string;
  name: string;
  trigger: string;
  result: string;
  steps: RitualStep[];
};

function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type Props = {
  ritual: Ritual;
  onExit?: () => void;
};

export default function RitualRunner({ ritual, onExit }: Props) {
  const total = ritual.steps.length;
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<"idle"|"ok"|"err">("idle");

  const step = useMemo(() => ritual.steps[idx], [ritual, idx]);
  const pct = useMemo(() => Math.round((idx / Math.max(total - 1, 1)) * 100), [idx, total]);

  useEffect(() => {
    if (!started) return;
    if (!step?.timerSec) { setCountdown(null); return; }
    setCountdown(step.timerSec);
  }, [started, step?.timerSec]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((s) => (s ?? 0) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const onKey = useCallback((e: KeyboardEvent) => {
    if (!started) return;
    if (e.code === "Space" || e.key === " ") {
      e.preventDefault();
      if (idx < total - 1) setIdx((i) => i + 1);
    } else if (e.key === "ArrowRight") {
      if (idx < total - 1) setIdx((i) => i + 1);
    } else if (e.key === "ArrowLeft") {
      if (idx > 0) setIdx((i) => i - 1);
    }
  }, [started, idx, total]);

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  function reset() {
    setStarted(false);
    setIdx(0);
    setCountdown(null);
    setRating(null);
    setSaved("idle");
    setSaving(false);
  }

  async function commitCompletion() {
    try {
      setSaving(true);
      const r = await fetch("/api/rituals/log", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ritual_id: ritual.id, rating }),
      });
      setSaved(r.ok ? "ok" : "err");
    } catch {
      setSaved("err");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border p-5 bg-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{ritual.name}</h3>
          <p className="text-sm opacity-70">Trigger: {ritual.trigger}</p>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/journal?ritual=${ritual.id}`} className="text-xs rounded-lg border px-2 py-1 hover:bg-white/5 transition" title="Permalink">Link</a>
          <button className="text-xs rounded-lg border px-2 py-1 hover:bg-white/5 transition" onClick={onExit ?? reset} title="Close">Close</button>
        </div>
      </div>

      {started && (
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-white/40" style={{ width: `${pct}%`, transition: "width 200ms ease" }} />
          </div>
          <p className="text-xs opacity-70 mt-1">Step {idx + 1} of {total}</p>
        </div>
      )}

      {!started ? (
        <div className="mt-4 space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            {ritual.steps.map((s, i) => (
              <li key={i} className="leading-relaxed">
                <span className="mr-2 inline-block rounded-md bg-white/10 px-2 py-0.5 text-xs">{s.tag}</span>
                {s.text}
                {typeof s.timerSec === "number" && (<span className="ml-2 text-xs opacity-60">({s.timerSec}s)</span>)}
              </li>
            ))}
          </ol>
          <button onClick={() => setStarted(true)} className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20 transition">Start Practice</button>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border p-4 bg-black/10">
            <div className="mb-2">
              <span className="mr-2 inline-block rounded-md bg-white/10 px-2 py-0.5 text-xs">{step.tag}</span>
              <span className="text-sm">{step.text}</span>
              {typeof step.timerSec === "number" && (<span className="ml-2 text-xs opacity-70">{countdown !== null && countdown > 0 ? `${countdown}s` : "(timed)"}</span>)}
            </div>
            <p className="text-xs opacity-70">Tip: Press <kbd>Space</kbd> / <kbd>→</kbd> for Next, <kbd>←</kbd> for Back.</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} className={clsx("rounded-xl border px-3 py-1.5 text-sm transition", idx === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-white/5")}>Back</button>
            {idx < total - 1 ? (
              <button onClick={() => setIdx((i) => Math.min(total - 1, i + 1))} className="rounded-xl bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20 transition">Next</button>
            ) : (
              <button onClick={async () => { await commitCompletion(); reset(); }} className="rounded-xl bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20 transition" title="Done">Done</button>
            )}
            <button onClick={reset} className="ml-auto rounded-xl border px-3 py-1.5 text-sm hover:bg-white/5 transition" title="Reset">Reset</button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="opacity-70">How effective was this?</span>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setRating(n)} className={clsx("rounded-md px-2 py-0.5 border text-xs", rating===n ? "bg-white/20" : "hover:bg-white/10")}>{n}</button>
            ))}
            {saved==="ok" && <span className="text-xs opacity-70">Saved ✓</span>}
            {saved==="err" && <span className="text-xs opacity-70">Save failed</span>}
            {saving && <span className="text-xs opacity-70">Saving…</span>}
          </div>

          <div className="text-sm opacity-80"><span className="opacity-60">Result:</span> {ritual.result}</div>
        </div>
      )}
    </div>
  );
}
