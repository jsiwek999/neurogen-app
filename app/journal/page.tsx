import { Suspense } from "react";
import JournalClient from "./JournalClient";

export const dynamic = "force-dynamic";

export default function JournalPage() {
  return (
    <Suspense fallback={<div>Loading journal…</div>}>
      <JournalClient />
    </Suspense>
  );
}
