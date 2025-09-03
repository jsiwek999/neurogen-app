import Link from "next/link";

export default function Dashboard() {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Journal</h2>
        <Link
          href="/rituals"
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
        >
          Ritual FAQ
        </Link>
      </div>

      {/* whatever else you want in the dashboard */}
      <div className="rounded-xl border border-white/10 p-4 text-white/80">
        Your recent entries will appear here.
      </div>
    </section>
  );
}
