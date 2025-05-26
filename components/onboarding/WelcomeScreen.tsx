import React from "react";

interface WelcomeScreenProps {
  onContinue: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
    <div className="max-w-lg mx-auto p-8 rounded-2xl shadow-xl bg-black/70">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome, Seeker. The Portal Awaits.</h1>
      <p className="mb-8 text-lg text-center">
        You stand at the threshold of something new. NEUROGEN isn’t just another app—it’s a living mirror, a mythic quest, and a toolbox for your next evolution. Here, you are both the hero and the author.
      </p>
      <button
        onClick={onContinue}
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg transition hover:scale-105"
      >
        Enter Portal
      </button>
    </div>
  </div>
);

export default WelcomeScreen;
