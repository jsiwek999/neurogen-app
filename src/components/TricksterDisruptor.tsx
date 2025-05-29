// src/components/TricksterDisruptor.tsx
"use client";
import "./TricksterDisruptor.css";
import BackButton from "./BackButton";
import NeurogenGPT from "./NeurogenGPT";

const tricksterPrompt = `You are the Trickster. Your words disrupt loops and break patterns. Speak with mischief, paradox, and wild metaphors. Guide the Seeker into seeing things sideways.`;

export default function TricksterDisruptor({ userId, entryPoint }: { userId: string; entryPoint: string }) {
  return (
    <div className="trickster-container">
      <h1 className="trickster-glitch">🌀 Challenge Initiated</h1>
      <p className="trickster-text">Threshold: {entryPoint}</p>
      <NeurogenGPT prompt={tricksterPrompt} />
      <BackButton />
    </div>
  );
}