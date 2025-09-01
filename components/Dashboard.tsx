// components/Dashboard.tsx
import Link from "next/link";

const RITUALS = [
  { slug: "reset",      title: "The 2-Minute Reset",  subtitle: "Overwhelm or scattered thoughts", desc: "Downshift nervous system; return to presence." },
  { slug: "mirror",     title: "Mirror Invocation",   subtitle: "Self-doubt or invisibility",      desc: "Anchor sovereignty and presence." },
  { slug: "submodal",   title: "Submodal Switch",     subtitle: "Looping thought",                  desc: "Loosen old coding; install new state." },
  { slug: "orient",     title: "Ground & Orient",     subtitle: "Anxious / ungrounded",             desc: "Re-enter the room; feel safe & here." },
  { slug: "boundary",   title: "Boundary Anchor",     subtitle: "People-pleasing impulse",          desc: "Embodied ‘No’ / ‘Not now’ anchor." },
  { slug: "vagus",      title: "Vagus Hum",           subtitle: "Tight chest / shallow breath",     desc: "Coherence + vagal tone via humming." },
  { slug: "identity",   title: "Identity Activation", subtitle: "Voice blocked",                    desc: "Invoke ‘She Who Breathes’ and speak." },
  { slug: "gratitude",  title: "Gratitude Pivot",     subtitle: "Negative spiral",                  desc: "Broaden attention; shift affect." },
  { slug: "view",       title: "View from Above",     subtitle: "Stuck perspective",                desc: "Zoom out; choose response." },
];

export default function Dashboard() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Journal</h2>
        <Link href="/rituals" className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10">
          Ritual FAQ
        </Link>
      </div>

      <div>
        <h3 className="mb-4 text-white/80 font-medium">Try a Ritual</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {RITUALS.map(r => (
            <div key={r.slug} className="rounded-2xl border border-white/10 p-5">
              <h4 className="text-white font-semibold">{r.title}</h4>
              <p className="mt-1 text-white/70 text-sm">{r.subtitle}</p>
              <p className="mt-1 text-white/60 text-sm">{r.desc}</p>
              <div className="mt-4">
                <Link href={`/ritual/${r.slug}`} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/90 hover:bg-white/10">
                  Try this ritual
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-white/80 font-medium">Live Ritual</h3>
        <div className="rounded-2xl border border-white/10 p-5">
          <p className="text-white/70 text-sm">Pick a ritual to load a step-by-step guide here.</p>
        </div>
      </div>
    </section>
  );
}
