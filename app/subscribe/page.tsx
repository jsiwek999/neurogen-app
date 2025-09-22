// app/subscribe/page.tsx
import SubscribeForm from '@/components/SubscribeForm';

type SP = Record<string, string | string[] | undefined>;
const pick = (sp: SP, k: string) => {
  const v = sp[k];
  return Array.isArray(v) ? v[0] : v ?? '';
};

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const email = pick(sp, 'email');
  const error = pick(sp, 'error');

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Subscribe</h1>
      <p className="text-sm opacity-80">Get updates in your inbox.</p>

      {error === 'invalid-email' && (
        <p className="mt-3 text-red-500">Please enter a valid email address.</p>
      )}
      {error === 'server-misconfig' && (
        <p className="mt-3 text-red-500">Server email config missing or invalid.</p>
      )}
      {error === 'send-failed' && (
        <p className="mt-3 text-red-500">We couldn’t send the email just now. Try again shortly.</p>
      )}

      <SubscribeForm defaultEmail={email} />
    </div>
  );
}
