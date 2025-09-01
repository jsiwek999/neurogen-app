// components/Navbar.tsx
import Link from "next/link";

export default function Navbar({ user }: { user: any }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-white/90 hover:text-white">
              EMX Protocol
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/start" className="text-sm text-white/70 hover:text-white">Start</Link>
              <Link href="/pricing" className="text-sm text-white/70 hover:text-white">Pricing</Link>
              <Link href="/about" className="text-sm text-white/70 hover:text-white">About</Link>
              <Link href="/journal" className="text-sm text-white/70 hover:text-white">Journal</Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/account" className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/90 hover:bg-white/10">
                Account
              </Link>
            ) : (
              <Link href="/auth/signin" className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/90 hover:bg-white/10">
                Sign in
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
