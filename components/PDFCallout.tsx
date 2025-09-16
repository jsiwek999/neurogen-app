export default function PDFCallout() {
  return (
    <div className="bg-background border border-white/10 rounded-lg p-4">
      <p className="text-white">Prefer the PDF version?</p>

      <a
        href="/pdfs/2-minute-reset.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20 transition"
        aria-label="Download the 2-Minute Reset PDF"
      >
        Download 2-Minute Reset (PDF)
      </a>
    </div>
  );
}
