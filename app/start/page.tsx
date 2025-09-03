// app/start/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";

export const metadata: Metadata = {
  title: "Start Here • EMX",
  description: "A 2-minute orientation for your first state shift.",
};

export default function StartPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-semibold">Start Here</h1>
      <p className="mb-6 text-white/70">
        Two minutes to learn the rhythm: breathe, label, anchor, re-enter.
      </p>

      <ol className="list-decimal space-y-3 pl-5 text-sm">
        <li><b>Breath:</b> Inhale 4, exhale 6 → 10 cycles.</li>
        <li><b>Label:</b> Name the current state → name the desired state.</li>
        <li><b>Anchor:</b> Touch thumb/index; recall a time you felt it.</li>
        <li><b>Phrase:</b> Whisper your cue on the exhale.</li>
        <li><b>Check:</b> 0–10 — what changed? Repeat if needed.</li>
      </ol>

      <div className="mt-6 flex gap-3">
        <Link href={"/reset" as Route} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10">
          Try the 2-Min Reset
        </Link>
        <Link href={"/rituals" as Route} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10">
          Explore Rituals
        </Link>
      </div>
    </section>
  );
}
