// app/page.tsx
import type { Metadata, Route } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EMX • Micro-rituals for rapid state shift",
  description:
    "Breathe. Label. Anchor. Re-enter. 1–3 minute rituals to get back to center.",
};

const cards = [
  {
    title: "2-Min Reset",
    desc: "Default bailout when you’re overloaded.",
    href: "/reset" as Route,
  },
  {
    title: "Calm in 10",
    desc: "10 breaths. Release, re-center, re-enter.",
    href: "/ritual/calm-in-10" as Route,
  },
  {
    title: "Focus Primer",
    desc: "Set the frame and direct attention.",
    href: "/ritual/focus-primer" as Route,
  },
] as const;

export default function HomePage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold leading-tight">
          Micro-rituals for rapid state shift
        </h1>
        <p className="mt-3 max-w-2xl text-white/70">
          EMX gives you fast somatic patterns—on demand. Downshift in minutes,
          regain presence, and get back to what matters.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={"/start" as Route}
          className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
        >
          Start here
        </Link>
        <Link
          href={"/rituals" as Route}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
        >
          Explore rituals
        </Link>
        <Link
          href={"/opt-in" as Route}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/10"
        >
          Get updates
        </Link>
      </div>

      <div className="mt-12 grid gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10"
          >
            <h3 className="text-lg font-medium">{c.title}</h3>
            <p className="mt-1 text-sm text-white/70">{c.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
