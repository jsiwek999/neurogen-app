"use client";
import { useState } from "react";

export default function NeurogenGPT({ prompt }: { prompt: string }) {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]); // simple history
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, `🧍 You: ${userInput}`]);
    setLoading(true);

    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: `${prompt}\nUser: ${userInput}` }),
    });

    const data = await res.json();
    const reply = data.result || "[No response]";

    setMessages((prev) => [...prev, `🤖 NEUROGEN: ${reply}`]);
    setUserInput("");
    setLoading(false);
  };

  return (
    <div className="gpt-chat-container text-center max-w-2xl mx-auto mt-6">
      <div className="chat-log text-left bg-black/30 p-4 rounded-lg max-h-64 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <p key={i} className="mb-2">{msg}</p>
        ))}
      </div>

      <input
        className="w-full p-2 rounded-md bg-gray-800 text-white"
        placeholder="Speak your truth..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        onClick={sendMessage}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-600"
      >
        {loading ? "Listening..." : "Send"}
      </button>
    </div>
  );
}
