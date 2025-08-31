export const dynamic = "force-dynamic";

const FAQ = [
  {
    q: "What is an EMX ritual?",
    a: "A short, symbolic sequence to shift your emotional state in under 2 minutes. They combine breath, imagery, and language — like tiny apps for your nervous system."
  },
  {
    q: "How is it different from meditation?",
    a: "Meditation is open-ended. EMX rituals are rapid and targeted — designed for in-the-moment state change, not long practice sessions."
  },
  {
    q: "Do I need special beliefs?",
    a: "No. EMX is symbolic tech. Whether you call it psychology, energy, or metaphor, your nervous system responds the same way."
  },
  {
    q: "How long does it take?",
    a: "Most take 60–120 seconds. Some are just a breath; others can expand into deeper trance if you choose."
  },
  {
    q: "How do I know it worked?",
    a: "Check your body and mind: smoother breath, loosened mental loop, more calm/clarity/energy. Even subtle change means it’s working."
  },
  {
    q: "Can I create my own?",
    a: "Yes — that’s the goal. Use building blocks like [breath], [shift], [mirror], [install], [submodal] to design rituals that fit you."
  }
];

export default function RitualsPage() {
  return (
    <div className="p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">EMX Rituals — FAQ</h1>
        <p className="opacity-70 mt-1">
          Quick answers about how to use EMX rituals for rapid state shifting.
        </p>
      </header>

      <section className="space-y-4">
        {FAQ.map((item, i) => (
          <article key={i} className="rounded-2xl border bg-black/20 p-4">
            <h2 className="font-medium">{item.q}</h2>
            <p className="opacity-80 mt-1">{item.a}</p>
          </article>
        ))}
      </section>

      <footer className="pt-2">
        <a href="/journal" className="rounded-xl border px-4 py-2 text-sm hover:bg-white/5 transition">
          ← Back to Journal
        </a>
      </footer>
    </div>
  );
}
