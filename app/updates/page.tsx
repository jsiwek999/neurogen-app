// app/updates/page.tsx

type SP = URLSearchParams;

export default async function UpdatesPage({
  searchParams,
}: {
  // Next 15 passes a Promise of URLSearchParams-ish
  searchParams: Promise<SP>;
}) {
  const params = await searchParams;

  // Read params via .get(), not object destructuring
  const confirmed = params.get('confirmed'); // "1", "true", "yes", or null
  const email = params.get('email') ?? '';

  // Normalize confirm truthiness
  const isConfirmed =
    confirmed === '1' || confirmed === 'true' || confirmed === 'yes';

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Updates</h1>

      {!isConfirmed && (
        <form
          className="mt-4 flex gap-2"
          action="/api/subscribe"
          method="POST"
        >
          <input
            type="email"
            name="email"
            defaultValue={email}
            required
            placeholder="you@example.com"
            className="border rounded px-3 py-2 w-full max-w-sm"
          />
          <button
            type="submit"
            className="rounded px-4 py-2 border"
          >
            Subscribe
          </button>
        </form>
      )}

      {isConfirmed && (
        <p className="mt-4">Thanks! Check your email to confirm.</p>
      )}
    </div>
  );
}
