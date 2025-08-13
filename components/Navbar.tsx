'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
export function Navbar() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-black/20">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" className="font-semibold tracking-tight">NEUROGEN</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className={`hover:underline ${path === '/dashboard' ? 'underline' : ''}`} href="/dashboard">Dashboard</Link>
          <Link className={`hover:underline ${path === '/pricing' ? 'underline' : ''}`} href="/pricing">Pricing</Link>
          <SignedOut><SignInButton><button className="btn">Sign in</button></SignInButton></SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </nav>
      </div>
    </header>
  );
}
