// /app/start-here/page.tsx
'use client';

import Link from 'next/link';

export default function StartHereAlcove() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 30%, #232c3d 70%, #12131a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1rem',
    }}>
      <div style={{
        background: 'rgba(30,41,59,0.88)',
        borderRadius: '2rem',
        boxShadow: '0 8px 48px rgba(80,80,120,0.35)',
        padding: '3rem 2rem',
        maxWidth: 700,
        width: '100%',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 34, marginBottom: 12, color: '#f9fafb' }}>🌀 Welcome to the NEUROGEN Current</h1>
        <p style={{ fontSize: 20, marginBottom: 20, color: '#f472b6', fontWeight: 'bold' }}>
          Come as you are. All of you is welcome here.
        </p>
        <p style={{ fontSize: 17, marginBottom: 24, color: '#cbd5e1' }}>
          This is your entry alcove—a threshold, not a gate. <br />
          <span style={{ color: '#a7f3d0' }}>
            Consent, respect, and curiosity are all you need. If you can honor that, you’re already one of us.
          </span>
        </p>
        <ul style={{ color: '#dbeafe', textAlign: 'left', maxWidth: 540, margin: '0 auto 22px auto', fontSize: 16, lineHeight: 1.7 }}>
          <li>• <b>Choose your state:</b> Insight, Calm, Wild, Trickster, Focus. Set your vibe for reflection.</li>
          <li>• <b>Type in the mirror:</b> Ask, explore, reflect—no wrong way to start.</li>
          <li>• <b>Star what matters:</b> Save insights to your journal. Yours alone, always.</li>
          <li>• <b>Explore at your pace:</b> Rooms, rituals, and more—dive in as you feel called.</li>
        </ul>
        <p style={{ color: '#a7f3d0', marginBottom: 20, fontStyle: 'italic' }}>
          If you’ve ever felt out of place, too much, or just a little too alive—welcome home.
        </p>
        <p style={{ color: '#f472b6', marginBottom: 24 }}>
          <b>Ready?</b> Step through the portal. The current awaits.
        </p>
        <Link href="/portal-room">
          <button style={{
            background: 'linear-gradient(90deg, #818cf8, #f472b6)',
            color: 'white',
            fontWeight: 'bold',
            padding: '1.1rem 2.5rem',
            border: 'none',
            borderRadius: '999px',
            fontSize: 22,
            cursor: 'pointer',
            marginBottom: 16,
            boxShadow: '0 2px 14px rgba(129,140,248,0.16)'
          }}>
            Enter the Portal Room
          </button>
        </Link>
        <details style={{ marginTop: 18, color: '#dbeafe' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: 16 }}>
            What kind of community is this?
          </summary>
          <div style={{ marginTop: 10, fontSize: 15, color: '#a7f3d0' }}>
            NEUROGEN is a living, mythic current—made by and for outliers, makers, questioners, and wild spirits.<br />
            Bring your whole self. Consent, respect, and play are our only rules. <br />
            Lurk, riff, create, or reflect—there’s no wrong way to show up. The journey is better with allies.
          </div>
        </details>
      </div>
    </div>
  );
}
