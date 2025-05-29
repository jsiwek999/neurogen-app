'use client';
import React, { useState, useRef, useEffect } from 'react';
import { STATES } from "utils/stateConfig";
import StateSelector from "./StateSelector";
import ChatJournal from "./ChatJournal";

export default function MirrorPanel({ prompt }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [journal, setJournal] = useState([]);
  const [selectedState, setSelectedState] = useState(STATES[0]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();

    setMessages((prev) => [...prev, { role: "user", text: `> ${userMessage}` }]);
    setInput('');

    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `${selectedState.instruction}\nUser: ${userMessage}`
        }),
      });

      const data = await res.json();
      const reply = data.reply || '...silence echoes in the mirror.';

      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "error", text: '[error] The mirror refuses to speak.' }]);
    }
  };

  const addToJournal = (msg) => {
    setJournal((prev) => [...prev, msg]);
  };

  return (
    <div style={{ width: '100%', maxWidth: 700, margin: '0 auto' }}>
      {/* Modular State Selector */}
      <StateSelector selectedState={selectedState} onSelect={setSelectedState} />

      {/* Output Section */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 16, borderRadius: 16, marginBottom: 32, color: 'white',
        minHeight: 240, maxHeight: 400, overflowY: 'auto'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            {msg.text}
            <button
              onClick={() => addToJournal(msg)}
              style={{ marginLeft: 12, fontSize: 12, background: 'gold', borderRadius: 8, border: 'none', cursor: 'pointer' }}
              title="Save to Journal"
            >★</button>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Speak into the mirror..."
          style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: 8, border: 'none', fontSize: 16, color: '#222' }}
        />
        <button type="submit" style={{ padding: '0.75rem 1.2rem', borderRadius: 8, background: '#a855f7', color: 'white', border: 'none', fontWeight: 'bold' }}>
          Send
        </button>
      </form>

      {/* Modular Journal */}
      <ChatJournal journal={journal} />
    </div>
  );
}
