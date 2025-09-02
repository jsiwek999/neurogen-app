"use client";
export default function Lead() {
  const printIt = () => window.print();
  return (
    <main className="max-w-2xl mx-auto px-6 py-10 print:px-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">EMX Reset — One-Pager</h1>
        <button onClick={printIt} className="border rounded-xl px-3 py-1">Print</button>
      </div>
      <ol className="mt-6 space-y-3 list-decimal pl-6">
        <li><strong>Interrupt:</strong> Say “Stop.” Drop shoulders. Unclench jaw.</li>
        <li><strong>Breath:</strong> In 4 — hold 2 — out 6 ×3.</li>
        <li><strong>Name it:</strong> State your current feeling in 3 words.</li>
        <li><strong>Submodal shift:</strong> Dim inner image to 30%. Move the sound left.</li>
        <li><strong>Install:</strong> “I choose presence now.” Align posture. Micro-smile.</li>
      </ol>
      <p className="mt-6 text-sm opacity-70">© EMX. For educational use.</p>
      <style>{`@media print { button{ display:none } body{ color:#000 } }`}</style>
    </main>
  );
}
