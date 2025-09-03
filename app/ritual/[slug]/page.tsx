// app/ritual/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllRitualSlugs, getRitualBySlug } from "@/lib/rituals";

// Helper to support both shapes: params or Promise<params>
async function resolveParams(input: any): Promise<{ slug?: string }> {
  if (input && typeof input.then === "function") {
    // It's a thenable/promise
    return await input;
  }
  return input ?? {};
}

export async function generateStaticParams() {
  const slugs = await getAllRitualSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: any): Promise<Metadata> {
  const { slug } = await resolveParams(props?.params);
  if (!slug) return { title: "Ritual Not Found • EMX" };

  const ritual = await getRitualBySlug(slug);
  if (!ritual) return { title: "Ritual Not Found • EMX" };

  return {
    title: `${ritual.title} • EMX`,
    description: ritual.summary,
  };
}

export default async function RitualDetail(props: any) {
  const { slug } = await resolveParams(props?.params);
  if (!slug) notFound();

  const ritual = await getRitualBySlug(slug);
  if (!ritual) notFound();

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-4 text-sm text-white/60">
        <Link
          href="/rituals"
          className="hover:text-white/90 underline-offset-4 hover:underline"
        >
          ← Back to Rituals
        </Link>
      </nav>

      <h1 className="text-2xl font-semibold">{ritual.title}</h1>
      <p className="mt-2 text-white/70">{ritual.summary}</p>

  <div className="mt-4 flex gap-3">
  <Link
    href="/reset"
    className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
  >
    Start 2-Min Reset
  </Link>
  <Link
    href="/rituals"
    className="rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10"
  >
    Browse Rituals
  </Link>
</div>


      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-white/70">
          <span className="font-medium text-white">Estimated time:</span> ~{ritual.durationMin} min
        </p>

        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
          <li>[breath] Slow inhale x4, slow exhale x6 — repeat for 5 cycles.</li>
          <li>[shift] Name the state. Name the desired state.</li>
          <li>[anchor] Touch thumb/index; recall a time you felt it.</li>
          <li>[install] Whisper the cue phrase on the exhale.</li>
          <li>[integration] Open eyes; check: 0–10 — what changed?</li>
        </ol>
      </div>
    </section>
  );
}
