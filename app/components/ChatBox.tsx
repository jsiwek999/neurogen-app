'use client';

import React, { useState, useRef, useEffect } from 'react';
import ArchetypeSelector from './ArchetypeSelector';

export default function ChatBox() {
  // Component mount check
  console.log('🔍 ChatBox mounted');

  // State
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<{ content: string; response: string }[]>([]);
  const [selectedArchetype, setSelectedArchetype] = useState('mirror');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('▶️ handleSubmit fired', { content: userInput, archetype: selectedArchetype });

    const payload = { content: userInput, archetype: selectedArchetype };
    try {
      console.time('🕑 fetch /api/memory');
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.timeEnd('🕑 fetch /api/memory');

      console.time('🕑 parse JSON');
      const data = await res.json();
      console.timeEnd('🕑 parse JSON');
      console.log('[RESPONSE FROM API]', JSON.stringify(data, null, 2));

      const message = {
        content: data.content || '[missing content]',
        response: data.response?.trim() || '[missing response]',
      };
      console.log('[ADDING TO MESSAGES]', message);
      setMessages((prev) => [...prev, message]);
      setUserInput('');
    } catch (err: any) {
      console.error('[ERROR IN SUBMIT]', err);
      setMessages((prev) => [
        ...prev,
        { content: userInput, response: `⚠️ Error: ${err.message}` },
      ]);
    }
  };

  // Auto-scroll into view on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-6">
      <ArchetypeSelector
        selectedArchetype={selectedArchetype}
        setSelectedArchetype={setSelectedArchetype}
      />

      <div className="flex-grow overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, index) => {
          console.log(`[RENDERING MESSAGE ${index}]`, JSON.stringify(msg, null, 2));
          return (
            <div
              key={index}
              className="bg-gray-900 rounded-xl p-4 border border-gray-700 shadow-md transition-all"
            >
              <p className="text-sm text-gray-400">You reflected:</p>
              <p className="text-white whitespace-pre-line">{msg.content}</p>

              <p className="text-sm text-gray-400 mt-2">Mirror responded:</p>
              <p className="text-purple-200 whitespace-pre-line">
                {msg.response}
              </p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="sticky bottom-0 bg-gray-900 p-4 rounded-t-lg border-t border-gray-700">
        <textarea
          name="reflection"
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your reflection here..."
          rows={2}
        />
        <button
          type="submit"
          className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
        >
          Reflect
        </button>
      </form>
    </div>
  );
}
