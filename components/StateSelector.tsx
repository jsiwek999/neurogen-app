// /components/StateSelector.tsx
import React from "react";
import { STATES, StateConfig } from "utils/stateConfig";

type StateSelectorProps = {
  selectedState: StateConfig;
  onSelect: (state: StateConfig) => void;
};

export default function StateSelector({
  selectedState,
  onSelect,
}: StateSelectorProps) {
  return (
    <div
      style={{
        marginBottom: 16,
        display: "flex",
        gap: 8,
        justifyContent: "center",
      }}
    >
      {STATES.map((s) => (
        <button
          key={s.label}
          onClick={() => onSelect(s)}
          style={{
            background:
              selectedState.label === s.label ? s.color : "#444",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "999px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          title={s.instruction}
        >
          <span style={{ marginRight: 4 }}>{s.icon}</span>
          {s.label}
        </button>
      ))}
    </div>
  );
}
