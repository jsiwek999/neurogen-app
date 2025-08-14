export const dynamic = "force-static";
export const metadata = { title: "Success — NEUROGEN" };

export default function Success() {
  return (
    <div className="card space-y-3">
      <h1 className="text-xl font-semibold">Welcome to NEUROGEN Pro 🎉</h1>
      <p className="text-sm" style={{opacity:.8}}>
        Your subscription is active. You can close this tab and start generating rituals.
      </p>
      <a className="btn" href="/">Go to generator</a>
    </div>
  );
}