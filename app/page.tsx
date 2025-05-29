// /app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #232c3d 0%, #6366f1 100%)',
    }}>
      <h1 style={{ color: '#fff', fontSize: 32, marginBottom: 24 }}>Welcome to NEUROGEN</h1>
      <p style={{ color: '#dbeafe', fontSize: 20, marginBottom: 32 }}>
        Your portal to mythic transformation, insight, and community.
      </p>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Link href="/start-here">
          <button style={{
            background: '#a855f7',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '999px',
            fontWeight: 'bold',
            fontSize: 20,
            border: 'none',
            cursor: 'pointer',
          }}>
            Start Here
          </button>
        </Link>
        <Link href="/portal-room">
          <button style={{
            background: '#818cf8',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '999px',
            fontWeight: 'bold',
            fontSize: 20,
            border: 'none',
            cursor: 'pointer',
          }}>
            Enter Portal Room
          </button>
        </Link>
      </div>
    </div>
  );
}
