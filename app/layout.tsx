import "./globals.css";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
