export const metadata = { title: "Subscribe — NEUROGEN" };

const LINK = process.env.NEXT_PUBLIC_SUBSCRIBE_URL; // set this later when Stripe is ready
const isLive = !!LINK && !LINK.includes("REPLACE_ME");

export default function Pricing() {
  return (
    <div className="card space-y-4">
      <h1 className="text-2xl font-semibold">NEUROGEN Pro</h1>
      <p className="text-sm" style={{opacity:.8}}>
        Unlock premium rituals & faster generation for just <b>$4.99/month</b>.
      </p>

      {isLive ? (
        <>
          <a className="btn" href={LINK!}>Subscribe — $4.99 / month</a>
          <div className="text-xs" style={{opacity:.6}}>You’ll be taken to Stripe Checkout. Cancel anytime.</div>
        </>
      ) : (
        <>
          <a className="btn" href="/checkout-demo">Simulate checkout</a>
          <div className="text-xs" style={{opacity:.6}}>Demo mode: no charge will occur.</div>
        </>
      )}
    </div>
  );
}