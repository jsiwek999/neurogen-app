export const dynamic = "force-static";
export const metadata = { title: "Success — EMX Protocol" };

const PRODUCT = process.env.NEXT_PUBLIC_PRODUCT_NAME || "EMX Protocol";

export default function Success() {
  return (
    <div className="card space-y-3">
      <h1 className="text-xl font-semibold">Welcome to {PRODUCT} 🎉</h1>
      <p className="text-sm" style={{opacity:.8}}>
        Your subscription is active. You can close this tab and start generating rituals.
      </p>
      <a className="btn" href="/">Go to generator</a>
    </div>
  );
}