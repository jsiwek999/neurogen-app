"use client";

import { useEffect, useMemo, useState } from "react";

type Step = { tag: string; title: string; content: string; seconds: number };
type Props = {
  title: string;
  steps: Step[];
  autostart?: boolean;
};

export default function EMXPlayer({ title, steps, autostart = true }: Props) {
  const safeSteps = Array.isArray(steps) ? steps : [];

  // Core state
  const [i, setI] = useState(0);
  const [isRunning, setIsRunning] = useState(autostart && safeSteps.length > 0);
  const [exitMsg, setExitMsg] = useState<string | null>(null);

  const active = safeSteps[i];
  const [remaining, setRemaining] = useState<number>(active?.seconds ?? 0);
  const done = !safeSteps.length || i >= safeSteps.length;

  // Journal state
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const isJournalTag = (t?: string) => {
    if (!t) return false;
    const low = t.toLowerCase();
    return low === "journal" || low === "journal prompt" || low === "journal_prompt";
  };

  // --- Keyboard controls: Space = play/pause, ←/→ = back/next, Esc = exit ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsRunning((v) => !v);
      } else if (e.code === "ArrowRight") {
        setI((x) => Math.min(safeSteps.length, x + 1));
        setIsRunning(false);
      } else if (e.code === "ArrowLeft") {
        setI((x) => Math.max(0, x - 1));
        setIsRunning(false);
      } else if (e.code === "Escape") {
        setIsRunning(false);
        setExitMsg('Place a hand on your chest and speak: “This is my will. I choose to see clearly.”');
        setI(safeSteps.length); // jump to done
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [safeSteps.length]);

  // Reset countdown when step changes
  useEffect(() => {
    setRemaining(active?.seconds ?? 0);
  }, [i, active?.seconds]);

  // Ticker
  useEffect(() => {
    if (!isRunning || done) return;
    if (!active || (active.seconds ?? 0) <= 0) return;

    const t = setTimeout(() => {
      setRemaining((r) => (r - 1 < 0 ? 0 : r - 1));
    }, 1000);

    return () => clearTimeout(t);
  }, [isRunning, done, active, remaining]);

  // Auto-advance when timer hits zero
  useEffect(() => {
    if (!isRunning || done) return;
    if (remaining === 0 && active && (active.seconds ?? 0) > 0) {
      const id = setTimeout(() => setI((x) => x + 1), 400);
      return () => clearTimeout(id);
    }
  }, [remaining, isRunning, done, active]);

  // Totals
  const total = useMemo(() => safeSteps.reduce((s, x) => s + (x.seconds || 0), 0), [safeSteps]);
  const elapsed = useMemo(() => {
    const past = safeSteps.slice(0, i).reduce((s, x) => s + (x.seconds || 0), 0);
    const currentGone = active ? (active.seconds || 0) - remaining : 0;
    return past + Math.max(0, currentGone);
  }, [safeSteps, i, active, remaining]);

  const pct =
    active && active.seconds > 0
      ? Math.min(100, Math.max(0, ((active.seconds - remaining) / active.seconds) * 100))
      : 0;

  // Save journal note
  async function saveNote() {
    if (!note.trim()) return;
    setSaving(true);
    setSaveErr(null);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ritualTitle: title,
          cue: active?.content ?? "",
          stepTag: (active?.tag ?? "journal_prompt").toString(),
          note,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error || `Save failed (${res.status})`);
      setSaved(true);
      setTimeout(() => setSaved(false), 800);
      // Optional auto-advance after save:
      setTimeout(() => {
        setI((x) => Math.min(safeSteps.length, x + 1));
        setIsRunning(false);
        setNote("");
      }, 350);
    } catch (e: any) {
      setSaveErr(e?.message ?? "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-white/10 p-6 bg-neutral-900/60">
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className="text-sm opacity-70 mb-4">
        ~{Math.max(1, Math.round(total / 60))} min reset • {elapsed}s / {total}s
      </p>

      {done ? (
        <div className="text-center py-8">
          <div className="text-2xl mb-2">{exitMsg ? "Exited 🛡️" : "Done ✅"}</div>
          <p className="opacity-80">{exitMsg ?? "Notice what shifted. Choose one tiny next action."}</p>
          <div className="mt-6 flex justify-center">
            <button
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15"
              onClick={() => {
                setI(0);
                setIsRunning(false);
                setExitMsg(null);
                setRemaining(safeSteps[0]?.seconds ?? 0);
              }}
            >
              Restart
            </button>
          </div>
        </div>
      ) : !active ? (
        <div className="opacity-80">No steps available.</div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-wider opacity-70">{active.tag}</div>
          <div className="text-lg font-medium">{active.title}</div>
          <p className="opacity-90 leading-relaxed">{active.content}</p>

          {/* Journal UI (only on [journal]/[journal prompt]) */}
          {isJournalTag(active.tag) && (
            <div className="mt-2 space-y-2">
              <label className="text-sm opacity-80">Your note</label>
              <textarea
                className="w-full rounded-lg bg-white/5 border border-white/10 p-3 outline-none focus:border-white/20"
                rows={3}
                placeholder="One line is enough…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="flex items-center gap-3">
                <button
                  className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40"
                  onClick={saveNote}
                  disabled={saving || !note.trim()}
                >
                  {saving ? "Saving…" : saved ? "Saved ✓" : "Save Note"}
                </button>
                {saveErr && <span className="text-red-300 text-sm">{saveErr}</span>}
              </div>
            </div>
          )}

          <div className="mt-2">
            <div className="text-sm opacity-70">
              {active.seconds > 0 ? `Next in: ${remaining}s` : `No timer on this step`}
            </div>
            <div
              className="h-2 w-full bg-white/10 rounded-full mt-2 overflow-hidden"
              role="progressbar"
              aria-label={`Step progress: ${Math.round(pct)} percent`}
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="h-2 bg-white/60" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40"
              onClick={() => {
                setI((x) => Math.max(0, x - 1));
                setIsRunning(false);
              }}
              disabled={i === 0}
            >
              Back
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15"
              onClick={() => {
                setI((x) => Math.min(safeSteps.length, x + 1));
                setIsRunning(false);
              }}
            >
              Next
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15"
              onClick={() => setIsRunning((v) => !v)}
            >
              {isRunning ? "Pause" : "Play"}
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15"
              onClick={() => {
                setIsRunning(false);
                setExitMsg('Place a hand on your chest and speak: “This is my will. I choose to see clearly.”');
                setI(safeSteps.length); // jump to done
              }}
            >
              Exit Mirror
            </button>
            <button
              className="ml-auto px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15"
              onClick={() => {
                setI(0);
                setIsRunning(false);
                setExitMsg(null);
                setRemaining(safeSteps[0]?.seconds ?? 0);
              }}
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
