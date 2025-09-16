// components/SiteFooter.tsx
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer
      className="border-t border-white/10 bg-transparent"
      data-test-id="site-footer"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm opacity-90 sm:flex-row">
        <div>© {new Date().getFullYear()} EMX</div>
        <nav className="flex items-center gap-4">
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
