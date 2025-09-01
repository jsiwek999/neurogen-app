// app/ritual/[slug]/page.tsx
import { notFound } from "next/navigation";

// ✅ Force the correct prop shape for typed routes in this segment
export type PageProps = {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

const META: Record<string, { title: string; emx: string }> = {
  reset: {
    title: "The 2-Minute Reset",
    emx: `[ritual]
[breath:box cycles="3"/]
[shift target="present"] Name 3 things you can see. [/shift]
[journal]One sentence: how does your body feel now?[/journal]
[/ritual]`,
  },
  mirror: {
    title: "Mirror Invocation",
    emx: `[ritual]
[mirror]Speak one truth you’ve been avoiding.[/mirror]
[install belief="My presence matters."]
[/ritual]`,
  },
  submodal: {
    title: "Submodal Switch",
    emx: `[ritual]
[loop label="sticky thought"]Name the phrase that loops.[/loop]
[submodal modality="visual" size="down" distance="far"/]
[shift target="neutral"]Let it sit across the room.[/shift]
[/ritual]`,
  },
  // add the rest of your rituals here...
};

export async function generateStaticParams() {
  // MUST return objects with { slug }, not { id } and not { params: { slug } }
  return Object.keys(META).map((slug) => ({ slug }));
}

// ✅ Use the explicit PageProps type here
export default function RitualPage({ params }: PageProps) {
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
