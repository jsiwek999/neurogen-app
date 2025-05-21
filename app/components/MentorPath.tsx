'use client';

import React, { useState } from 'react';

export default function MentorPath() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const INTERACTION_LIMIT = 6;

  const mentorPrompt =
    "You are the NEUROGEN Mentor: offer guidance, clarity, and actionable wisdom. Respond as a mentor, not a mirror. Be concise but insightful, always supportive.";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (loading || !input.trim()) return;
    if (history.filter((h) => h.role === 'user').length >= INTERACTION_LIMIT) {
      setLimitReached(true);
      return;
    }

    setHistory([...history, { role: 'user', text: input }]);
    setLoading(true);

    try {
      const res = await fetch('/api/emx-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: mentorPrompt,
          userInput: input,
        }),
      });
      const data = await res.json();
      if (data.messages && Array.isArray(data.messages)) {
        setHistory((h) => [...h, { role: 'mentor', text: data.messages[0] }]);
      } else if (data.messages) {
        setHistory((h) => [...h, { role: 'mentor', text: data.messages }]);
      } else {
        setHistory((h) => [...h, { role: 'mentor', text: 'Mentor is silent...' }]);
      }
    } catch (err: any) {
      setError('MentorPath API error.');
      setHistory((h) => [...h, { role: 'mentor', text: 'Mentor is silent... (API error)' }]);
    } finally {
      setInput('');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9fafb] via-[#eef3f9] to-[#e7ffe7] flex flex-col justify-center">
      <div className="max-w-xl mx-auto p-6 mt-10 rounded-2xl shadow-2xl bg-white/80">
        <h1 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2">
          <span role="img" aria-label="mentor">🧙‍♂️</span> Speak with the Mentor
        </h1>
        <div className="space-y-2 h-96 overflow-y-auto border rounded-lg bg-white/80 p-3 mb-4 shadow-inner">
          {history.length === 0 && (
            <div className="text-gray-400 italic">
              The Mentor awaits your first question...
            </div>
          )}
          {history.map((entry, idx) => (
            <div
              key={idx}
              className={
                entry.role === 'user'
                  ? 'self-end text-blue-800 bg-blue-50 rounded-xl px-3 py-2 max-w-[90%]'
                  : 'self-start text-green-800 italic bg-green-50 rounded-xl px-3 py-2 shadow-sm max-w-[90%] flex items-center gap-2'
              }
              style={{ marginBottom: '0.5rem' }}
            >
              {entry.role === 'mentor' && (
                <span role="img" aria-label="mentor" className="text-2xl">🧙‍♂️</span>
              )}
              <span>
                <span className="font-semibold">
                  {entry.role === 'user' ? 'You' : 'Mentor'}:
                </span>{' '}
                {entry.text}
              </span>
            </div>
          ))}
          {loading && <div className="text-gray-400">The Mentor is thinking...</div>}
        </div>
        {limitReached ? (
          <div className="text-red-500 font-bold mb-2">
            Session limit reached. Please return home or start a new session.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="flex-1 p-2 border rounded-lg"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask your question here..."
              maxLength={200}
            />
            <button
              className="px-4 py-2 rounded-xl bg-green-700 text-white disabled:opacity-50"
              disabled={loading}
              type="submit"
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>
        )}
        <button
          className="mt-4 w-full py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400"
          onClick={() => window.location.href = '/'}
        >
          Return Home
        </button>
        {error && <div className="text-red-400 mt-2">{error}</div>}
      </div>
    </div>
  );
}
