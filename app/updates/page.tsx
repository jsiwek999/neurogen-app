// app/updates/page.tsx
type SearchParams = Record<string, string | string[] | undefined>;

function pick(sp: SearchParams, k: string): string {
  const v = sp[k];
  return Array.isArray(v) ? (v[0] ?? '') : (v ?? '');
}

export default async function UpdatesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const confirmed = pick(sp, 'confirmed');
  const email = pick(sp, 'email');
  const isConfirmed = ['1', 'true', 'yes'].includes((confirmed || '').toLowerCase());

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Updates</h1>

      {!isConfirmed && (
        <form className="mt-4 flex gap-2" action="/api/subscribe" method="POST">
          <input
            type="email"
            name="email"
            defaultValue={email}
            required
            placeholder="you@example.com"
            className="border rounded px-3 py-2 w-full max-w-sm"
          />
          <button type="submit" className="rounded px-4 py-2 border">
            Subscribe
          </button>
        </form>
      )}

      {isConfirmed && (
        <p className="mt-4">
          Thanks! Check your inbox at <strong>{email}</strong>.
        </p>
      )}
    </div>
  );
}
