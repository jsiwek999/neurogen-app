import React from "react";

export default function ChatJournal({ journal }) {
  return (
    <div style={{ marginTop: 32, background: "rgba(0,0,0,0.3)", padding: 16, borderRadius: 12, color: "gold" }}>
      <h3>Your Journal</h3>
      {journal.length === 0 ? <p><i>No saved insights yet.</i></p> :
        <ul>
          {journal.map((entry, idx) => <li key={idx}>{entry.text}</li>)}
        </ul>}
    </div>
  );
}

