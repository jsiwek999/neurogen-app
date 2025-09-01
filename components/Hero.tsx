// components/Hero.tsx
import Link from "next/link";

export default function Hero() {
  return (
    <section className="max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tight text-white">EMX Protocol</h1>
      <p className="mt-3 text-white/80">
        AI-guided somatic micro-rituals designed to shift state fast—reset, ground, or focus in ~2 minutes.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/start" className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">Start Here</Link>
        <Link href="/pricing" className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">Pricing</Link>
        <Link href="/about" className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">About</Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {/* three feature cards as you had them */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white/90 font-semibold">EMX Tags</h3>
          <p className="mt-2 text-white/70 text-sm">[breath] [shift] [journal] [install] [disrupt] [identity] [ritual] [integration] [submodal]</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white/90 font-semibold">Timeboxed</h3>
          <p className="mt-2 text-white/70 text-sm">~2 minutes per ritual.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white/90 font-semibold">Personalized</h3>
          <p className="mt-2 text-white/70 text-sm">Cues adapt to your intent and context.</p>
        </div>
      </div>
    </section>
  );
}
