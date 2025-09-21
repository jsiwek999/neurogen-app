// app/updates/page.tsx
import UTMFields from "@/components/UTMFields";

export const dynamic = 'force-dynamic'; // or: export const revalidate = 0

import Link from 'next/link';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function UpdatesPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const get = (k: string) => {
    const v = params[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const confirmed  = get('confirmed') === '1';
  const subscribed = get('subscribed') === '1';
  const error      = get('error');

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
{/* Honeypot anti-bot field */}
<input
  type="text"
  name="website"
  tabIndex={-1}
  autoComplete="off"
  className="hidden"
/>

  <UTMFields />

        </label>
        <button
          className="rounded-xl border border-white/15 px-4 py-2 text-white hover:bg-white/10"
          type="submit"
        >
          Subscribe
        </button>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
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
