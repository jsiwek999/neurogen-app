import PDFCallout from "@/components/PDFCallout";

export default function ResetPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">2-Minute Reset</h1>
      <p className="text-gray-300 mb-6">
        Quick sequence to move from autopilot appeasement back to a clear, centered state.
      </p>

      <ol className="text-gray-300 list-decimal list-inside space-y-2 mb-8">
        <li>Name the story: <em>"If I say no, I'll be abandoned."</em></li>
        <li>Locate it in the body (jaw / solar plexus / shoulders).</li>
        <li>4 breaths — in 4, out 6 (longer exhale).</li>
        <li>Ask: "What is this trying to protect?" (belonging, worth, peace)</li>
        <li>Update the contract: <em>"I keep belonging AND tell the truth."</em></li>
        <li>One boundary sentence. Then move on.</li>
      </ol>

      <PDFCallout />
    </div>
  );
}
