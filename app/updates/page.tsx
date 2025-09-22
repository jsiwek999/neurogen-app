import Banner from '@/components/Banner';
import ConfirmEffect from '@/components/ConfirmEffect';

export default function UpdatesPage({
  searchParams,
}: {
  searchParams: { confirmed?: string; email?: string };
}) {
  const isConfirmed = searchParams?.confirmed === '1';
  const email = searchParams?.email;

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Updates</h1>

      {isConfirmed && (
        <Banner kind="success">
          🎉 You’re confirmed! You’ll get updates from EMX Protocol. {email ? `(${email})` : ''}
        </Banner>
      )}

      {isConfirmed && email ? <ConfirmEffect email={email} /> : null}

      <section className="prose">
        <p>Latest news, feature drops, and state-shifting tricks—right here.</p>
      </section>
    </main>
  );
}
