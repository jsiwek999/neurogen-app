// app/reset/page.tsx
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-static";

export default function ResetPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">2-Minute Reset</h1>
      <p className="mt-3 text-neutral-700">
        Quick sequence to move from autopilot appeasement back to a clear, centered state.
      </p>

      <ol className="mt-6 list-decimal space-y-2 pl-5 text-neutral-800">
        <li>Name the story: <em>“If I say no, I’ll be abandoned.”</em></li>
        <li>Locate it in the body (jaw / solar plexus / shoulders).</li>
        <li>4 breaths — in 4, out 6 (longer exhale).</li>
        <li>Ask: “What is this trying to protect?” (belonging, worth, peace)</li>
        <li>Update the contract: <em>“I keep belonging AND tell the truth.”</em></li>
        <li>One boundary sentence. Then move on.</li>
      </ol>

      <div className="mt-8 rounded-xl border bg-neutral-50 p-5">
        <p className="text-sm text-neutral-700">Prefer the PDF version?</p>
        <p className="mt-2">
          <a
            href="/downloads/2-minute-reset.pdf"
            className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-neutral-100"
          >
            Download 2-Minute Reset (PDF)
          </a>
        </p>
      </div>

      <nav className="mt-10 flex gap-4 text-sm">
        <Link href="/rituals" className="underline underline-offset-4 hover:no-underline">
          ← Back to Rituals
        </Link>
        <Link href="/" className="underline underline-offset-4 hover:no-underline">
          Home
        </Link>
      </nav>
    </main>
  );
}
