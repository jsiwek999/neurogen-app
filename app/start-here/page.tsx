export const metadata = {
  title: "Start Here — EMX 2-Minute Reset",
  description: "A quick guided reset to move from chaos to clarity in under 2 minutes.",
};

export default function StartHere() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-neutral-100">
      <h1 className="text-3xl font-semibold">Start Here</h1>
      <p className="mt-4 text-neutral-300">
        In the next two minutes, you’ll run a simple EMX reset. Pick your current state, then follow the prompts.
      </p>

      <ol className="mt-8 space-y-4">
        <li className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
          <div className="font-semibold">1) Name your state</div>
          <p className="text-neutral-300">Anxious, fearful, overwhelmed — or type your own.</p>
        </li>
        <li className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
          <div className="font-semibold">2) Follow the instructions</div>
          <p className="text-neutral-300">We’ll give you 3–5 steps. Read them, then do them.</p>
        </li>
        <li className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
          <div className="font-semibold">3) Breathe it in</div>
          <p className="text-neutral-300">One slow inhale… one longer exhale… notice the shift.</p>
        </li>
      </ol>

      <a
        href="/app"
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-neutral-900 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/60"
      >
        Go to the App
      </a>
    </main>
  );
}
