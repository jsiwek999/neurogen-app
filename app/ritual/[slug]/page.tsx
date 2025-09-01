// app/ritual/[slug]/page.tsx
import { notFound } from "next/navigation";

const META: Record<string, { title: string; emx: string }> = {
  reset: {
    title: "The 2-Minute Reset",
    emx: `[ritual]
[breath:box cycles="3"/]
[shift target="present"] Name 3 things you can see. [/shift]
[journal]One sentence: how does your body feel now?[/journal]
[/ritual]`
  },
  mirror: {
    title: "Mirror Invocation",
    emx: `[ritual]
[mirror]Speak one truth you’ve been avoiding.[/mirror]
[install belief="My presence matters."]
[journal]What changes when you tell the truth plainly?[/journal]
[/ritual]`
  },
  submodal: {
    title: "Submodal Switch",
    emx: `[ritual]
[loop label="sticky thought"]Name the phrase that loops.[/loop]
[submodal modality="visual" size="down" distance="far"/]
[shift target="neutral"]Let it sit across the room.[/shift]
[/ritual]`
  },
  orient: {
    title: "Ground & Orient",
    emx: `[ritual]
[breath:box cycles="2"/]
[shift target="present"]5-4-3-2-1: 5 see, 4 feel, 3 hear, 2 smell, 1 taste.[/shift]
[journal]One line: I am here because…[/journal]
[/ritual]`
  },
  boundary: {
    title: "Boundary Anchor",
    emx: `[ritual]
[install belief="My No protects what I love."]
[anchor gesture="thumb-index press" word="Not now"/]
[mirror]Say it once out loud: “Not now.”[/mirror]
[journal]Where will you use this anchor today?[/journal]
[/ritual]`
  },
  vagus: {
    title: "Vagus Hum",
    emx: `[ritual]
[breath:coh cycles="6"/]
[disrupt]Hum gently on each exhale. Feel the chest & throat vibrate.[/disrupt]
[shift target="calm"]Notice warmth spreading.[/shift]
[/ritual]`
  },
  identity: {
    title: "Identity Activation — She Who Breathes",
    emx: `[ritual]
[identity name="She Who Breathes"]
[shift target="voice"]Speak one sentence slowly, with breath leading.[/shift]
[journal]What tone/tempo felt most true?[/journal]
[/ritual]`
  },
  gratitude: {
    title: "Gratitude Pivot",
    emx: `[ritual]
[mirror]Name three tiny things you appreciate in the last hour.[/mirror]
[install belief="Attention chooses meaning."]
[journal]What changed in your body while listing them?[/journal]
[/ritual]`
  },
  view: {
    title: "View from Above",
    emx: `[ritual]
[submodal modality="visual" distance="far" size="down"/]
[shift target="observer"]See yourself in the scene from 50 feet up.[/shift]
[journal]What new option appears from up here?[/journal]
[/ritual]`
  },
};

export default function RitualPage({ params }: { params: { slug: string } }) {
  const cfg = META[params.slug];
  if (!cfg) return notFound();
  return (
    <main className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-white">{cfg.title}</h1>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80 whitespace-pre-wrap">
        {cfg.emx}
      </div>
      {/* TODO: Pipe EMX to your interpreter and render step-by-step UI */}
    </main>
  );
}
