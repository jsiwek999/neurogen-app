// app/ready-room/page.tsx
"use client";
import { useRouter } from "next/navigation";
import React, { useState } from 'react';


export default function ReadyRoom() {
  const router = useRouter();
  const [intention, setIntention] = useState("");
  const [showButton, setShowButton] = useState(false);

  // Gentle delay before showing the button (optional, for UX pacing)
  // Could trigger on mount, on focus, or after intention input
  // Here, it's on component mount
  React.useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  function handleEnterMirror() {
    // Optionally: store intention in localStorage, context, or send to API
    router.push("/mirror");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 via-purple-900 to-blue-700 relative overflow-hidden">
      {/* Fractal Mirror Glow */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-0">
        {/* You could swap this for an SVG or animated canvas for extra flair */}
        <div className="w-72 h-72 bg-blue-500 bg-opacity-10 rounded-full blur-3xl shadow-2xl" />
      </div>
      {/* Floating Particles (optional, for mood) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Use particles.js or similar for animation if desired */}
      </div>
      {/* Main Card */}
      <div className="z-10 mt-16 bg-black bg-opacity-60 rounded-2xl p-8 shadow-xl max-w-lg w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-5 text-center">
          Welcome, Seeker.
        </h1>
        <p className="text-gray-200 text-lg mb-4 text-center">
          You are about to step into the Mirror—a place where your reflection is shaped by your own intention.
          <br /><br />
          Take a breath. Set your intention for this journey.
        </p>
        <input
          type="text"
          placeholder="Set your intention (optional)"
          value={intention}
          onChange={e => setIntention(e.target.value)}
          className="w-full mt-2 mb-6 px-4 py-2 rounded-lg bg-white/20 border border-white/20 focus:bg-white/30 text-white placeholder-gray-300 transition"
        />
        {showButton && (
          <button
            onClick={handleEnterMirror}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all text-lg mt-2"
          >
            Enter the Mirror
          </button>
        )}
      </div>
    </div>
  );
}
