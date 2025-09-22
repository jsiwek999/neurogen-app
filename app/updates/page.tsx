// app/updates/page.tsx

type SP = { confirmed?: string; email?: string };

export default async function UpdatesPage({ searchParams }: PageProps) {
  const { confirmed, email } = (await searchParams) as SP;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Updates</h1>
      {confirmed && <p>Confirmed: {confirmed}</p>}
      {email && <p>Email: {email}</p>}
    </div>
  );
}

