import React, { useState, FC } from "react";

type Mode = "mythic" | "practical" | "ai";

interface PromptContent {
  title: string;
  prompt: string;
  placeholder: string;
}

interface MirrorHallwayProps {
  userId?: string;
}

const MODES: { key: Mode; label: string }[] = [
  { key: "mythic", label: "Mythic Portal" },
  { key: "practical", label: "Practical Guide" },
  { key: "ai", label: "AI Mirror" },
];

const PROMPT_CONTENT: Record<Mode, PromptContent> = {
  mythic: {
    title: "Mirror Hallway",
    prompt: "Step into the Mirror Hallway and let the Seeker within reveal what is true, hidden, or waiting to be born.",
    placeholder: "Write your reflection below…",
  },
  practical: {
    title: "Mirror Hallway (Practical)",
    prompt: "Take a few minutes to honestly reflect on where you are in your life. What brought you here today? Write one thought or feeling below.",
    placeholder: "Jot down a thought, feeling, or recent experience…",
  },
  ai: {
    title: "Mirror Hallway (AI Mirror)",
    prompt: "Initiate Self-Scan Protocol. Identify your current state, log one dominant thought or pattern in the field below.",
    placeholder: "Enter a personal scan log here…",
  },
};

// Dummy function for prompt tracking (replace with your actual API or DB call)
const trackPromptUsage = ({
  userId,
  promptId,
  mode,
}: {
  userId: string;
  promptId: string;
  mode: Mode;
}) => {
  // This can be replaced with a real API call or analytics integration
  console.log("Tracked usage:", {
    userId,
    promptId,
    mode,
    timestamp: new Date().toISOString(),
  });
};

const MirrorHallway: FC<MirrorHallwayProps> = ({ userId = "anonymous" }) => {
  const [mode, setMode] = useState<Mode>("mythic");
  const [input, setInput] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    trackPromptUsage({
      userId,
      promptId: "mirror-hallway-001",
      mode: newMode,
    });
    setSaved(false); // Reset save when mode changes
    setInput("");    // Optional: Clear input for each mode, or keep previous
  };

  const handleSave = () => {
    setSaved(true);
    trackPromptUsage({
      userId,
      promptId: "mirror-hallway-001",
      mode,
    });
    // TODO: Save input to database if desired
  };

  const { title, prompt, placeholder } = PROMPT_CONTENT[mode];

  return (
    <div className="room-container" style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h2>{title}</h2>

      {/* Mode Selector */}
      <div style={{ margin: "1em 0" }}>
        <span>Mode: </span>
        {MODES.map((m) => (
          <button
            key={m.key}
            style={{
              fontWeight: m.key === mode ? "bold" : "normal",
              marginRight: 10,
              background: m.key === mode ? "#eee" : "#fff",
              borderRadius: 8,
              padding: "0.25em 0.75em",
              border: "1px solid #bbb",
              cursor: "pointer",
            }}
            onClick={() => handleModeChange(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Prompt Display */}
      <div style={{ fontSize: "1.15em", margin: "1em 0", minHeight: 60 }}>
        <em>{prompt}</em>
      </div>

      {/* Input Box */}
      <textarea
        rows={5}
        style={{
          width: "100%",
          fontSize: "1.1em",
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
        placeholder={placeholder}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setSaved(false);
        }}
      />

      {/* Save Button and Feedback */}
      <div>
        <button
          onClick={handleSave}
          style={{
            background: "#66e",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: 8,
            padding: "0.5em 1.5em",
            border: "none",
            marginRight: 12,
            cursor: "pointer",
          }}
        >
          Save Reflection
        </button>
        {saved && <span style={{ color: "#090", fontWeight: "bold" }}>Reflection saved!</span>}
      </div>
    </div>
  );
};

export default MirrorHallway;
