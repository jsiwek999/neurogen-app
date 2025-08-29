// app/page.tsx
export const metadata = {
  title: "EMX Protocol — 2-Minute State Shifts",
  description:
    "AI-assisted somatic micro-rituals to reset, ground, and refocus in under 2 minutes.",
};

export default function Home() {
  return (
    <section className="mx-auto max-w-screen-xl px-4 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">
        EMX Protocol
      </h1>
      <p className="mt-4 text-white/80 max-w-2xl">
        AI-guided somatic micro-rituals designed to shift state fast—reset,
        ground, or focus in ~2 minutes.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="/start-here"
          className="rounded-xl bg-white/10 border border-white/10 px-5 py-2.5 hover:bg-white/15"
        >
          Start Here
        </a>
        <a
          href="/pricing"
          className="rounded-xl bg-transparent border border-white/20 px-5 py-2.5 hover:bg-white/10"
        >
          Pricing
        </a>
        <a
          href="/about"
          className="rounded-xl bg-transparent border border-white/20 px-5 py-2.5 hover:bg-white/10"
        >
          About
        </a>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-medium">EMX Tags</h3>
          <p className="mt-2 text-white/70 text-sm">
            [breath] [shift] [journal] [install] [disrupt] [identity] [ritual] [integration] [submodal]
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-medium">Timeboxed</h3>
          <p className="mt-2 text-white/70 text-sm">~2 minutes per ritual.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-medium">Personalized</h3>
          <p className="mt-2 text-white/70 text-sm">
            Cues adapt to your intent and context.
          </p>
        </div>
      </div>
    </section>
  );
}
