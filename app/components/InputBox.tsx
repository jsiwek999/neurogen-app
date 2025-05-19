"use client";
import { useState } from "react";

interface InputBoxProps {
  onSend: (text: string) => void;
}

export default function InputBox({ onSend }: InputBoxProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex gap-2 items-center mt-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your reflection…"
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      <button
        onClick={handleSend}
        className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 text-sm"
      >
        Send
      </button>
    </div>
  );
}
