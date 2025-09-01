// components/Dashboard.tsx
import Link from "next/link";

export default function Dashboard() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Journal</h2>
        <Link href="/faq/rituals" className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10">
          Ritual FAQ
        </Link>
      </div>

      {/* Try a Ritual */}
      <div>
        <h3 className="mb-4 text-white/80 font-medium">Try a Ritual</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <Card
            title="The 2-Minute Reset"
            subtitle="Trigger: Overwhelm or scattered thoughts"
            desc="Nervous system downshifts, presence returns."
            href="/ritual/reset"
          />
          <Card
            title="Mirror Invocation"
            subtitle="Trigger: Self-doubt or invisibility"
            desc="Anchors sovereignty and presence."
            href="/ritual/mirror"
          />
          <Card
            title="Submodal Switch"
            subtitle="Trigger: Looping thought"
            desc="Old loop loses power; new state installs."
            href="/ritual/submodal"
          />
        </div>
      </div>

      {/* Live Ritual */}
      <div>
        <h3 className="mb-4 text-white/80 font-medium">Live Ritual</h3>
        <div className="rounded-2xl border border-white/10 p-5">
          <p className="text-white/70 text-sm">Pick a ritual to load a step-by-step guide here.</p>
          <div className="mt-4 flex gap-2">
            <Link href="/ritual/clear" className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10">
              Clear
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ title, subtitle, desc, href }: { title:string; subtitle:string; desc:string; href:string }) {
  return (
    <div className="rounded-2xl border border-white/10 p-5">
      <h4 className="text-white font-semibold">{title}</h4>
      <p className="mt-1 text-white/70 text-sm">{subtitle}</p>
      <p className="mt-1 text-white/60 text-sm">{desc}</p>
      <div className="mt-4">
        <Link href={href} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/90 hover:bg-white/10">
          Try this ritual
        </Link>
      </div>
    </div>
  );
}
