'use client';
import { useState } from 'react';

export default function TricksterChat() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setOutput('');

  try {
    const res = await fetch('/api/gpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input }),
    });

    const text = await res.text(); // First, grab raw text
    console.log("🔍 Raw API response:", text);

    if (!res.ok) {
      throw new Error(`❌ Server responded with status ${res.status}: ${text}`);
    }

    const data = JSON.parse(text); // Now parse it
    setOutput(data.reply || '[No reply returned]');
  } catch (err: any) {
    console.error("🔥 Error in client fetch:", err);
    setOutput(err.message || 'Something went sideways.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-4 bg-black text-green-300 rounded shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the Trickster..."
          className="w-full p-2 rounded border border-purple-600 bg-gray-800 text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Summoning...' : 'Speak'}
        </button>
      </form>
      <pre className="whitespace-pre-wrap text-sm">{output}</pre>
    </div>
  );
}
