// app/updates/page.tsx
export const dynamic = 'force-dynamic'; // or: export const revalidate = 0

import Link from 'next/link';

type Props = {
  searchParams?: {
    confirmed?: string;
    subscribed?: string;
    error?: string;
  };
};

export default function UpdatesPage({ searchParams }: Props) {
  const confirmed  = searchParams?.confirmed === '1';
  const subscribed = searchParams?.subscribed === '1';
  const error      = searchParams?.error;

  return (
    <main className="mx-auto max-w-xl px-4 py-10 text-white">
      <h1 className="mb-6 text-3xl font-semibold">Get Updates</h1>

      {confirmed && (
        <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
          <p className="font-medium">You're confirmed ✅</p>
          <p className="text-sm text-white/80">
            You’ll get releases, tools, and rapid state-change tips. Welcome aboard.
          </p>
        </div>
      )}

      {subscribed && !confirmed && (
        <div className="mb-6 rounded-xl border border-blue-500/40 bg-blue-500/10 p-4">
          <p className="font-medium">Check your email 📬</p>
          <p className="text-sm text-white/80">
            We sent a confirmation link. Click it to finish subscribing.
          </p>
        </div>
      )}

      {!!error && (
        <div className="mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4">
          <p className="font-medium">Something went wrong</p>
          <p className="text-sm text-white/80">{error}</p>
        </div>
      )}

      <form className="space-y-4" action="/api/subscribe" method="post">
        <label className="block text-sm text-white/80">
          Email address
          <input
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            type="email"
            name="email"
            placeholder="you@example.com"
            required
          />
        </label>
        <button
          className="rounded-xl border border-white/15 px-4 py-2 text-white hover:bg-white/10"
          type="submit"
        >
          Subscribe
        </button>
      </form>

      <p className="mt-4 text-sm text-white/60">
        We’ll never share your email. Unsubscribe anytime.{' '}
        <Link href="/privacy" className="underline underline-offset-2">Privacy</Link>
        {' · '}
        <Link href="/terms" className="underline underline-offset-2">Terms</Link>
      </p>
    </main>
  );
}
