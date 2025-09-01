// app/ritual/[slug]/page.tsx
import { notFound } from "next/navigation";

const META: Record<string, { title: string; emx: string }> = {
  reset: { title: "The 2-Minute Reset", emx: `[ritual]\n[breath:box cycles="3"/]\n[/ritual]` },
  mirror: { title: "Mirror Invocation", emx: `[ritual]\n[mirror]Speak once.[/mirror]\n[/ritual]` },
  submodal: { title: "Submodal Switch", emx: `[ritual]\n[submodal/]\n[/ritual]` },
};

export async function generateStaticParams() {
  // Must be { slug }, not { id } and not { params: { slug } }
  return Object.keys(META).map((slug) => ({ slug }));
}

// Keep the prop inline-typed; no exported PageProps anywhere
export default function RitualPage({ params }: { params: { slug: string } }) {
  const cfg = META[params.slug];
  if (!cfg) return notFound();
  return (
    <main className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-white">{cfg.title}</h1>
      <pre className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80 whitespace-pre-wrap">
        {cfg.emx}
      </pre>
    </main>
  );
}
