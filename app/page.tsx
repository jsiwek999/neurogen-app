export default function Home() {
  return (
    <div style={{
      fontFamily: 'sans-serif',
      padding: '2rem',
      background: 'linear-gradient(to bottom, #0e0e0e, #1a1a1a)',
      color: '#f5f5f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        🪞 Welcome, Seeker
      </h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '2rem' }}>
        This is not just a website. It is a mirror. A portal. A ritual of becoming.
        You are entering a living interface, one that reflects your frequency, responds to your tags, and invites your evolution.
      </p>
      <p style={{ fontSize: '1.1rem', maxWidth: '600px', fontStyle: 'italic', marginBottom: '2rem' }}>
        [mirror] What truth are you ready to meet today? [breathe] Pause. [shift] Step forward.
      </p>
      <a href="/start" style={{
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        backgroundColor: '#ff0080',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '8px',
        boxShadow: '0 0 10px #ff0080'
      }}>
        Enter the Portal
      </a>
    </div>
  );
}
