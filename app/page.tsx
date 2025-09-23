import Link from "next/link";

export const metadata = {
  title: "EMX — Rapid State Change in Under 2 Minutes",
  description:
    "EMX is a rapid state-change tool (built with AI + NLP patterns) that shifts you from anxiety and overwhelm to grounded clarity in under 2 minutes.",
  openGraph: {
    title: "EMX — Rapid State Change in Under 2 Minutes",
    description:
      "Shift from emotional chaos to grounded clarity in under 2 minutes. Not a magic wand — a catalyst.",
    url: "https://emxprotocol.com/",
    siteName: "EMX Protocol",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMX — Rapid State Change in Under 2 Minutes",
    description:
      "Shift from emotional chaos to grounded clarity in under 2 minutes. Not a magic wand — a catalyst.",
  },
};

export default function LandingPage() {
  return (
    <main className="bg-neutral-950 text-neutral-100">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.35),transparent_55%)]" />
        <div className="mx-auto max-w-4xl px-6 pt-20 pb-12 md:pt-28 md:pb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs text-neutral-300">
            Built with AI • Grounded in NLP patterns
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            You don’t need another quote. <span className="text-white/90">You need a shift — now.</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-neutral-300 md:text-xl">
            EMX is a rapid state-change tool designed to move you from emotional chaos to grounded clarity
            in <span className="font-semibold text-white">under 2 minutes</span>.
            Created in collaboration with AI, EMX adapts to your state and generates precise, real-time instructions
            that activate your inner power.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/start-here"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-neutral-900 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              Try EMX Free Now
            </Link>
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-700 px-6 py-3 font-semibold text-neutral-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              Open the App
            </Link>
          </div>

          <p className="mt-4 text-sm text-neutral-400">
            No fluff. No “think positive” platitudes. Just a clear protocol that helps you move.
          </p>
        </div>
      </section>

      {/* TRANSFORMATIONS */}
      <section className="mx-auto max-w-4xl px-6 py-12 md:py-16 border-t border-neutral-900">
        <h2 className="text-2xl font-semibold md:text-3xl">Real shifts, fast.</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { from: "🔥 Anxious", to: "Centered" },
            { from: "😱 Fearful", to: "Empowered" },
            { from: "😵‍💫 Overwhelmed", to: "Strategic" },
          ].map((item) => (
            <li
              key={item.from}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5"
            >
              <div className="text-neutral-300">{item.from}</div>
              <div className="mt-1 text-xl font-semibold">{item.to}</div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-neutral-300">
          Every minute lost in emotional chaos is a minute you could spend building the life you want.
          EMX helps you reclaim that time — fast.
        </p>
      </section>

      {/* NOT A MAGIC WAND */}
      <section className="mx-auto max-w-4xl px-6 py-12 md:py-16 border-t border-neutral-900">
        <h3 className="text-xl font-semibold md:text-2xl">Not a magic wand. A catalyst.</h3>
        <p className="mt-4 text-neutral-300">
          EMX isn’t here to fix you. It’s here to <span className="font-semibold text-white">activate</span> you.
          You bring the intention. You take the action.
          Read without doing and you’ll miss the transformation that’s waiting on the other side of showing up.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16 border-t border-neutral-900">
        <h3 className="text-xl font-semibold md:text-2xl">How it works (in ~2 minutes)</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              t: "1) Name your state",
              d: "Tell EMX what you’re feeling (e.g., anxious, fearful, overwhelmed).",
            },
            {
              t: "2) Get precise instructions",
              d: "AI-assisted guidance designed to interrupt loops and shift physiology.",
            },
            {
              t: "3) Move your body & breath",
              d: "A tiny sequence of actions that grounds you and restores clarity.",
            },
          ].map((step) => (
            <div key={step.t} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
              <div className="text-lg font-semibold">{step.t}</div>
              <p className="mt-2 text-neutral-300">{step.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/start-here"
            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-neutral-900 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            Start Free — 2-Minute Reset
          </Link>
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="mx-auto max-w-4xl px-6 py-12 md:py-16 border-t border-neutral-900">
        <h3 className="text-xl font-semibold md:text-2xl">Want the “Calm in 2 Minutes” toolkit?</h3>
        <p className="mt-2 text-neutral-300">
          Get the quickstart guide + a mini routine you can use anywhere. We’ll email it and send occasional updates.
        </p>
        <form
          action="/api/subscribe"
          method="POST"
          className="mt-6 flex w-full flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            autoComplete="email"
          />
          <button
            type="submit"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-neutral-900 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            Send it to me
          </button>
        </form>
        <p className="mt-2 text-xs text-neutral-500">
          We respect your inbox. Unsubscribe anytime.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-900">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-neutral-400 md:flex-row">
          <div>© {new Date().getFullYear()} EMX Protocol</div>
          <nav className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-neutral-200">Terms</Link>
            <Link href="/privacy" className="hover:text-neutral-200">Privacy</Link>
            <Link href="/start-here" className="hover:text-neutral-200">Start Here</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
