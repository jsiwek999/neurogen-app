import SubscribeForm from '@/components/SubscribeForm';

export default async function SubscribePage({
  searchParams,
}: {
  // Next 15: searchParams is a Promise
  searchParams: Promise<URLSearchParams>;
}) {
  const params = await searchParams;
  const email = params.get('email') ?? '';

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Subscribe</h1>
      <p className="text-sm opacity-80">Get updates in your inbox.</p>
      <SubscribeForm defaultEmail={email} />
    </div>
  );
}
