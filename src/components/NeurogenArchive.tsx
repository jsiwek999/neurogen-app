// src/components/NeurogenArchive.tsx
"use client";
import "./NeurogenArchive.css";
import BackButton from "./BackButton";
import NeurogenGPT from "./NeurogenGPT";

const archivePrompt = `You are the NEUROGEN Archive. Share tools, quotes, and references without commentary. Let the Seeker explore freely. Offer useful prompts and concepts related to self-evolution.`;

export default function NeurogenArchive({ userId, viewMode }: { userId: string; viewMode: string }) {
  return (
    <div className="archive-container">
      <h1 className="archive-header">📚 The Neurogen Archive</h1>
      <p className="archive-text">Mode: <strong>{viewMode}</strong> | User: <em>{userId}</em></p>
      <NeurogenGPT prompt={archivePrompt} />
      <BackButton />
    </div>
  );
}