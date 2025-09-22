// app/subscribe/page.tsx
import SubscribeForm from '@/components/SubscribeForm';

type SP = URLSearchParams | ReadonlyURLSearchParams;

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
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
