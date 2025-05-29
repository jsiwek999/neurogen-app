// src/components/RitualMirror.tsx
"use client";
import "./RitualMirror.css";
import { useEffect } from "react";
import NeurogenGPT from "./NeurogenGPT";
import BackButton from "./BackButton";

const ritualPrompt = `You are a Ritual Mirror. Use breath, rhythm, and gentle repetition. Guide the Seeker into stillness and depth. Begin with a breath pattern and a simple phrase.`;

export default function RitualMirror({ userId, sequence }: { userId: string; sequence: string }) {
  useEffect(() => {
    console.log("[ritual] Entered Ritual Mirror:", sequence, userId);
  }, [sequence, userId]);

  return (
    <div className="ritual-container">
      <h1 className="ritual-glow">🌬️ The Breath Between Worlds</h1>
      <p className="ritual-text">Sequence: <strong>{sequence}</strong></p>
      <NeurogenGPT prompt={ritualPrompt} />
      <BackButton />
    </div>
  );
}