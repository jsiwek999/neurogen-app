'use client';
import React, { useState } from 'react';

export default function MirrorPath() {
  const [reflection, setReflection] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResponse('');
    const systemPrompt = `You are the NEUROGEN Mirror. Respond with gentle, deep, open-ended reflection prompts. Always encourage curiosity, and never judge.`;

    try {
      const res = await fetch('/api/emx-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          userInput: reflection || 'The seeker gazes into the Mirror.',
        }),
      });
      const data = await res.json();
      setResponse(data.messages?.[0] || 'No response received.');
      console.log("Mirror API result:", data);
    } catch (err) {
      setResponse('Error contacting the Mirror.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => window.location.reload();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-800">
      <div className="bg-white/90 rounded-2xl shadow-xl p-8 max-w-lg w-full text-center space-y-6">
        <h2 className="text-2xl font-bold mb-4">🔮 Face the Mirror</h2>
        <p className="mb-4">For a moment, look inward. What am I really seeking, right now?</p>
        <textarea
          className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400"
          rows={4}
          placeholder="Write your reflection here (optional, this is just for you)..."
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        />
        <button
          className="mt-4 bg-purple-700 hover:bg-purple-900 text-white py-2 px-8 rounded-xl font-semibold transition"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Revealing...' : 'Reveal Insight'}
        </button>
        {response && (
          <div className="mt-4 text-lg font-medium whitespace-pre-line">
            {response}
          </div>
        )}
        <button
          className="mt-8 text-sm text-purple-600 underline"
          onClick={handleBack}
        >
          ← Back to Portal
        </button>
      </div>
    </div>
  );
}
