// app/about/page.tsx
import Link from "next/link";

export const metadata = {
  title: "About | EMX Protocol",
  description: "What EMX Protocol is and why it exists.",
};

export default function About() {
  return (
    <section className="mx-auto max-w-screen-md px-4 py-12">
      <h1 className="text-3xl font-semibold">About</h1>
      <p className="mt-3 text-white/80">
        EMX Protocol helps caregiving spouses shift state fast using AI-guided,
        somatic micro-rituals. Built on our EMX protocol, designed for calm in under 2 minutes.
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-medium">In a nutshell</h2>
        <ul className="mt-3 list-disc pl-5 text-white/75">
          <li>AI-assisted somatic state shifting</li>
          <li>EMX tagging & mirror prompts</li>
          <li>Always-with-you “2-minute resets”</li>
        </ul>
      </div>

      <div className="mt-8">
        <Link href="/start-here" className="underline hover:no-underline">
          Start Here →
        </Link>
      </div>
    </section>
  );
}
