import "./globals.css";
import type { ReactNode } from "react";
import { NavBar } from "@/components/NavBar";


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-dvh">
        <header className="sticky top-0 z-50 bg-[#0B1220]/70 backdrop-blur border-b border-white/10">
          <nav className="mx-auto max-w-screen-xl h-14 px-4 flex items-center justify-between">
            <a href="/" className="font-bold text-white">EMX Protocol</a>
            <div className="flex items-center gap-6">
              <a href="/start-here" className="text-white/90 hover:text-white">Start</a>
              <a href="/pricing" className="text-white/90 hover:text-white">Pricing</a>
              <a href="/about" className="text-white/90 hover:text-white">About</a>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
