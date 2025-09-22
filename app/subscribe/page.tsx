// app/subscribe/page.tsx
import SubscribeForm from '@/components/SubscribeForm';

type SP = Record<string, string | string[] | undefined>;

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const pick = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v ?? '';
  };
  const email = pick('email');

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Subscribe</h1>
      <p className="text-sm opacity-80">Get updates in your inbox.</p>
      <SubscribeForm defaultEmail={email} />
    </div>
  );
}
