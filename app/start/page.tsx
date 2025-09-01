// app/start/page.tsx
export default function StartPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-semibold text-white">Start Here</h1>
      <p className="text-white/80">
        EMX Protocol helps you shift state fast with 2-minute, AI-guided micro-rituals.
      </p>

      <ol className="list-decimal space-y-3 pl-6 text-white/80">
        <li>Sign in to save your progress (Journal & Installs).</li>
        <li>Try a quick ritual: <code className="text-white/90">The 2-Minute Reset</code>.</li>
        <li>Open <code className="text-white/90">Journal</code> and record one insight.</li>
      </ol>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-white font-medium">Next up</h2>
        <ul className="mt-2 list-disc pl-6 text-white/70">
          <li>Mirror Invocation — anchor sovereignty and presence</li>
          <li>Submodal Switch — break a looping thought</li>
        </ul>
      </div>
    </main>
  );
}
