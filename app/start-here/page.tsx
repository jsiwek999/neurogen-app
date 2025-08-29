// app/start-here/page.tsx
import EMXPlayer from "@/components/EMXPlayer";

export default function StartHere() {
  const steps = [
    { tag: "breath",  title: "Breath",  content: "Inhale 4, hold 4, exhale 6.", seconds: 20 },
    { tag: "shift",   title: "Shift",   content: "Feel your feet; soften jaw & shoulders.", seconds: 20 },
    { tag: "journal", title: "Journal", content: "One line: what matters in the next 10 minutes?", seconds: 30 },
  ];
  return (
    <main className="min-h-[70vh] px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Try a 2-Minute Reset</h1>
        <EMXPlayer title="2-Minute Reset" steps={steps} />
      </div>
    </main>
  );
}
