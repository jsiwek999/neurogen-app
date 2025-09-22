// app/updates/page.tsx
// No PageProps import here.

type SP = { confirmed?: string; email?: string };

export default async function UpdatesPage({
  searchParams,
}: {
  // Next 15: searchParams is a Promise
  searchParams: Promise<SP>;
}) {
  const { confirmed, email } = await searchParams;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Updates</h1>
      {confirmed && <p>Confirmed: {confirmed}</p>}
      {email && <p>Email: {email}</p>}
    </div>
  );
}
