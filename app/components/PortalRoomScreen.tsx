import React from "react";
import { resetOnboarding } from "../../utils/onboarding"; // adjust path if needed

export default function PortalRoomScreen({ onContinue }: { onContinue: () => void }) {
  // Optional: only show in development
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
      <div className="max-w-lg mx-auto p-8 rounded-2xl shadow-xl bg-black/70 text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Portal Room</h1>
        <p className="mb-4 text-lg">
          This is your guild headquarters, your mirror, and your map. New rituals, quests, and portals await. Where will you venture next?
        </p>
        <button
          className="w-full mt-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg transition hover:scale-105"
          onClick={onContinue}
        >
          Continue
        </button>
        {isDev && (
          <button
            className="mt-8 px-4 py-2 bg-red-600 rounded-lg text-white font-semibold"
            onClick={() => {
              resetOnboarding();
              window.location.href = "/onboarding";
            }}
          >
            🔄 Reset Onboarding (Dev Only)
          </button>
        )}
      </div>
    </div>
  );
}
