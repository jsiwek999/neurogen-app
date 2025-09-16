"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV: { name: string; href: string }[] = [
  { name: "Home", href: "/" },
  { name: "Rituals", href: "/rituals" },      // ensure this route exists
  { name: "Start Here", href: "/start-here" },
  { name: "Blog", href: "/blog" },
  { name: "Get Updates", href: "/updates" },  // ← NEW
];

export default function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-semibold tracking-tight">EMX</Link>
        <ul className="flex gap-2">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  isActive(item.href) ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
