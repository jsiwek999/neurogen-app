import "./globals.css";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar"; // default import (works with file above)

export const metadata: Metadata = {
  title: "NEUROGEN / EMX",
  description: "EMX: fast state-shifting rituals for presence and sovereignty.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-dvh bg-[#0b1220] text-white antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-white/10 focus:px-3 focus:py-2"
        >
          Skip to content
        </a>

        <NavBar />
        <div className="h-14" aria-hidden="true" />

        <main id="main" className="min-h-[calc(100dvh-3.5rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}
