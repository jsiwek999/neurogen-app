'use client';
export function ShimmerCard() {
  const run = async () => {
    try {
      const r = await fetch('/api/shimmer', { method: 'POST' });
      const data = await r.json();
      alert(data.message);
    } catch (e) {
      alert('Shimmer run recorded.');
    }
  };
  return (
    <div className="card p-6 space-y-3">
      <h3 className="text-lg font-semibold">One-Minute Shimmer</h3>
      <ol className="list-decimal ml-5 text-sm text-white/80 space-y-1">
        <li>[mirror] Scan for the shimmer (odd timing, charged sensation, déjà vu).</li>
        <li>[breathe] Focus a single sensory detail; let the rest blur.</li>
        <li>[shift] Take one non-autopilot action.</li>
        <li>[install] “I can choose differently.”</li>
      </ol>
      <button onClick={run} className="btn">Mark Complete</button>
    </div>
  );
}
