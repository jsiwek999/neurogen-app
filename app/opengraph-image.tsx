// /app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          background: "linear-gradient(135deg, #0b0f1a 0%, #121a2b 100%)",
          color: "white"
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>
          EMX Protocol
        </div>
        <div style={{ marginTop: 12, fontSize: 30, opacity: 0.9 }}>
          Rapid state-change in under 2 minutes
        </div>
        <div style={{ marginTop: 24, fontSize: 22, opacity: 0.7 }}>
          emxprotocol.com
        </div>
      </div>
    ),
    { ...size }
  );
}
