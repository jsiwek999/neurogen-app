"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function NuclearBars() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <>
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          top: 0,
          height: "10px",
          background: "#ff0040",
          zIndex: 2147483647,
          pointerEvents: "none",
          boxShadow: "0 0 0 2px #fff inset",
        }}
      />
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: "14px",
          background: "#0066ff",
          zIndex: 2147483647,
          pointerEvents: "none",
          boxShadow: "0 0 0 2px #fff inset",
          transform: "translateZ(0)",
        }}
      />
    </>,
    document.body
  );
}
