// app/journal/page.tsx
import { Suspense } from "react";
import JournalClient from "./JournalClient";

export default function JournalPage() {
  return (
    <main className="p-6">
      <Suspense fallback={<div className="p-8 text-sm opacity-70">Loading journal…</div>}>
        <JournalClient />
      </Suspense>
    </main>
  );
}
