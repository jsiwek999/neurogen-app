"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import AuthMini from "@/components/AuthMini";

const links = [
  { href: "/" as Route, label: "Home" },
  { href: "/start" as Route, label: "Start Here" },
  { href: "/rituals" as Route, label: "Rituals" },
  { href: "/reset" as Route, label: "2-Min Reset" },
  { href: "/faq" as Route, label: "FAQ" },
  { href: "/legal/privacy" as Route, label: "Privacy" },
  { href: "/legal/terms" as Route, label: "Terms" },
] as const;

function NavBar() {
  const pathname = usePathname();

  const isActive = (href: Route) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0b1220]/70 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href={"/" as Route} className="font-semibold text-white">
          EMX
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <ul className="flex items-center gap-2 sm:gap-4">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "rounded-lg px-3 py-1.5 text-sm transition outline-none",
                      "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1220]",
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Single extra action on the right */}
          <Link
            href={"/opt-in" as Route}
            className="rounded-lg px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1220]"
          >
            Get Updates
          </Link>

          {/* Login/Logout button */}
          <AuthMini />
        </div>
      </nav>
    </header>
  );
}

// Export both ways to avoid import mismatches
export { NavBar };
export default NavBar;
