import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://emxprotocol.com"),
  title: { default: "EMX Protocol", template: "%s | EMX Protocol" },
  description: "Rapid state-change tools for emotional sovereignty.",
  openGraph: {
    title: "EMX Protocol",
    description: "Shift your state. Reclaim your power.",
    url: "https://emxprotocol.com",
    siteName: "EMX Protocol",
    images: [{ url: "/og/og-image.png" }], // array of objects is the safest
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMX Protocol",
    description: "Rapid state-change tools for emotional sovereignty.",
    images: ["/og/og-image.png"],
  },
};

export default function RootLayout(
  { children }: { children: React.ReactNode }
) {
  return (
    <html lang="en">
      <body className="bg-background text-white">
        <SiteHeader />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
