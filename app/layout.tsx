// /app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://emxprotocol.com"),
  title: "EMX Protocol",
  description: "Rapid state-change tools for emotional sovereignty.",
  openGraph: {
    title: "EMX Protocol",
    description: "Shift your state. Reclaim your power.",
    url: "https://emxprotocol.com",
    siteName: "EMX Protocol",
    images: ["/og/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMX Protocol",
    description: "Rapid state-change tools for emotional sovereignty.",
    images: ["/og/og-image.png"],
  },
};
