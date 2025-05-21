'use client';
import React from 'react';

export default function PortalLanding({ onSelectPath }: { onSelectPath: (path: string) => void }) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-700 animate-background">
      <div className="mb-12 text-4xl font-bold tracking-tight text-white drop-shadow-lg">
        You’ve Crossed the Threshold
      </div>
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 max-w-xl text-center space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Soul’Full Moment</h2>
        <p className="text-gray-800 leading-relaxed">
          <b>Pause. Right here.</b><br /><br />
          This isn’t just a thank you. It’s a chance to notice you’re alive.<br /><br />
          You made it through the portal—most never even knock.<br /><br />
          Take a breath. Feel it move through you—chest, belly, fingertips. Notice: Are you holding anything you don’t need?<br /><br />
          Let the breath go. Let your jaw loosen. Let your shoulders drop.<br /><br />
          Now, ask yourself—quietly, honestly:<br />
          <b>What am I really seeking, right now?</b><br /><br />
          There’s no wrong answer, no test. Whatever rises is your clue.<br />
          When you’re ready—step forward. You’ll know what to do next.
        </p>
      </div>
      <div className="mt-12 flex flex-col md:flex-row gap-6">
        <button
          className="bg-purple-700 hover:bg-purple-900 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-lg transition"
          onClick={() => onSelectPath('mirror')}
        >
          🔮 Face the Mirror
          <div className="text-base font-normal mt-2">See yourself anew.</div>
        </button>
        <button
          className="bg-indigo-700 hover:bg-indigo-900 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-lg transition"
          onClick={() => onSelectPath('dungeon')}
        >
          🗝️ Enter the Dungeon
          <div className="text-base font-normal mt-2">Embrace a challenge.</div>
        </button>
        <button
          className="bg-pink-700 hover:bg-pink-900 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-lg transition"
          onClick={() => onSelectPath('mentor')}
        >
          🦉 Speak to the Mentor
          <div className="text-base font-normal mt-2">Receive a nudge.</div>
        </button>
      </div>
    </div>
  );
}
