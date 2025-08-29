export const metadata = {
  title: "Pricing | EMX Protocol",
  description: "Start for less than a cup of coffee.",
};

export default function Pricing() {
  return (
    <section className="mx-auto max-w-screen-xl px-4 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-2 text-white/80">Start for less than a cup of coffee.</p>
      <p className="text-white/70">Every plan gives you a quick way to shift out of overwhelm in ~2 minutes.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
          <h3 className="text-xl font-medium">Basic</h3>
          <p className="mt-1 text-3xl font-semibold">$4.99<span className="text-base font-normal">/month</span></p>
          <ul className="mt-4 list-disc pl-5 text-white/80 space-y-1">
            <li>All 2-minute resets</li>
            <li>Guided breath & micro-movements</li>
            <li>Private, anytime use on your phone</li>
          </ul>
          <a className="mt-5 inline-block rounded-xl bg-white/10 border border-white/15 px-4 py-2 hover:bg-white/15">
            Get EMX for $4.99/mo
          </a>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/5 p-5 opacity-70">
          <h3 className="text-xl font-medium">Plus (Coming Soon)</h3>
          <ul className="mt-4 list-disc pl-5 text-white/80 space-y-1">
            <li>Expanded ritual library</li>
            <li>Reflection prompts & state tracking</li>
            <li>Priority access to new resets</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/5 p-5 opacity-70">
          <h3 className="text-xl font-medium">Premium (Coming Soon)</h3>
          <ul className="mt-4 list-disc pl-5 text-white/80 space-y-1">
            <li>Deep-dive guided sessions</li>
            <li>Community access & support</li>
            <li>Exclusive tools & updates</li>
          </ul>
        </div>
      </div>

      <p className="mt-8 text-white/70">No contracts. Cancel anytime.</p>
      <p className="mt-1 text-white/70">
        Not sure yet? <a href="/start-here" className="underline">Try a free 2-minute reset</a>
      </p>
    </section>
  );
}
