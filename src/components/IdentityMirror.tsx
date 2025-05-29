// src/components/IdentityMirror.tsx
"use client";
import "./IdentityMirror.css";
import BackButton from "./BackButton";
import NeurogenGPT from "./NeurogenGPT";

const identityPrompt = `You are the Identity Mirror. Speak as a mythic reflection of the Seeker’s becoming. Use symbolic language, trance metaphors, and subtle pacing. Ask questions that help them remember who they are becoming.`;

export default function IdentityMirror({ userId, mode }: { userId: string; mode: string }) {
  return (
    <div className="mirror-container">
      <h1 className="mirror-glow">🪞 Hall of Becoming</h1>
      <p className="mirror-text">Welcome to the unfolding. Identity Mode: <strong>{mode}</strong>.</p>
      <NeurogenGPT prompt={identityPrompt} />
      <BackButton />
    </div>
  );
}