// components/VisionSnapshot.tsx
export default function VisionSnapshot() {
  return (
    <section
      aria-labelledby="vision-title"
      style={{
        border: "1px solid #eee",
        borderRadius: 16,
        padding: 20,
        marginTop: 24,
        background: "#fff",
      }}
    >
      <h2 id="vision-title" style={{ marginTop: 0, marginBottom: 12 }}>
        EMX Protocol — Vision Snapshot (v0.1)
      </h2>

      <div style={{ display: "grid", gap: 16 }}>
        <div>
          <h3 style={{ margin: "0 0 6px" }}>Purpose (why we exist)</h3>
          <p style={{ margin: 0 }}>
            Give overwhelmed humans a fast, reliable way to shift state on demand.
          </p>
        </div>

        <div>
          <h3 style={{ margin: "0 0 6px" }}>Promise (what they get)</h3>
          <p style={{ margin: 0 }}>
            “Shift out of overwhelm in ~2 minutes.” Breath + micro-movement, anywhere.
          </p>
        </div>

        <div>
          <h3 style={{ margin: "0 0 6px" }}>Audience (who we serve first)</h3>
          <p style={{ margin: 0 }}>
            Busy knowledge workers (25–45) who feel wired/tired and want a simple, repeatable reset.
          </p>
        </div>

        <div>
          <h3 style={{ margin: "0 0 6px" }}>Positioning (how we’re different)</h3>
          <p style={{ margin: 0 }}>
            Not another 20-minute meditation; a practical regulation tool you’ll actually use between meetings.
          </p>
        </div>
      </div>
    </section>
  );
}
