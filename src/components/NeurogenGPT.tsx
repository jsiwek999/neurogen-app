// src/components/NeurogenGPT.tsx
"use client";
import { useState } from "react";

export default function NeurogenGPT({ prompt }: { prompt: string }) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, input }),
      });

      const data = await res.json();
      setResponse(data.result || "[No response]");
    } catch (err) {
      setResponse("[Error reaching the AI]");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gpt-wrapper">
      <p><strong>System Prompt:</strong> <em>{prompt}</em></p>
      <textarea
        placeholder="Speak to the mirror..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        className="gpt-input"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Reflecting..." : "Speak"}
      </button>
      <div className="gpt-response">
        <strong>Response:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
}
