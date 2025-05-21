'use client';
import React, { useState } from 'react';

export default function DungeonPath() {
  const [accepted, setAccepted] = useState(false);
  const [challenge, setChallenge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    setAccepted(true);

    const systemPrompt = `You are the NEUROGEN Dungeon Master. Offer a playful, embodied, physical or somatic challenge that is safe, surprising, and growth-oriented. Make it unique each time.`;

    try {
      const res = await fetch('/api/emx-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userInput: "The seeker has entered the Dungeon.",
        }),
      });
      const data = await res.json();
      setChallenge(data.messages?.[0] || 'No challenge received.');
    } catch (err) {
      setChallenge('Error contacting the Dungeon.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => window.location.reload();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-800">
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 max-w-lg w-full text-center space-y-6">
        <h2 className="text-2xl font-bold mb-4">🗝️ Enter the Dungeon</h2>
        <p className="mb-4">
          Ready for a challenge? For one minute, move, breathe, or make a sound you’ve never tried before.<br />
          Let your body guide you—big or small, silly or serious.
        </p>
        {!accepted ? (
          <button
            className="bg-indigo-700 hover:bg-indigo-900 text-white py-2 px-8 rounded-xl font-semibold transition"
            onClick={handleAccept}
            disabled={loading}
          >
            {loading ? (
  <>
    <span className="animate-pulse">Summoning your unique challenge...</span>
    <div className="mt-2 flex justify-center">
      <svg className="animate-spin h-5 w-5 text-indigo-600" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  </>
) : 'I Accept the Quest'}

          </button>
        ) : (
          <div className="mt-4 text-lg font-medium whitespace-pre-line">
            {challenge}
          </div>
        )}
        <button
          className="mt-8 text-sm text-indigo-700 underline"
          onClick={handleBack}
        >
          ← Back to Portal
        </button>
      </div>
    </div>
  );
}
