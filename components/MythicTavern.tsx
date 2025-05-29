// neurogen-app/components/MythicTavern.tsx
"use client";
import React from "react";
import "./MythicTavern.css"; // You can also use Tailwind for quicker magic

export default function MythicTavern() {
  return (
    <div className="tavern-container">
      <div className="tavern-overlay">
        <h1 className="tavern-title">Welcome to the Guildhouse</h1>
        <p className="tavern-subtitle">The fire is alive. The mirror waits.</p>
      </div>
    </div>
  );
}
