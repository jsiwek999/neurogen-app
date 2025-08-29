// app/success/page.tsx
import ManageBillingButton from "@/components/ManageBillingButton";

export default async function SuccessPage({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const sp = (typeof searchParams?.then === "function" ? await searchParams : (searchParams ?? {})) as Record<string, string>;
  const sid = sp.session_id;

  return (
    <main style={{ padding: 24 }}>
      <h1>Success 🎉</h1>
      <p>Your subscription is active.</p>
      {sid ? <ManageBillingButton sessionId={sid} /> : <p>Return to <a href="/pricing">Pricing</a></p>}
    </main>
  );
}
