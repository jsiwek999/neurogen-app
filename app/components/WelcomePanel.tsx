// /components/WelcomePanel.tsx
export default function WelcomePanel() {
  return (
    <div style={{
      background: 'rgba(30,41,59,0.8)',
      borderRadius: '2rem',
      padding: '2rem 1rem',
      marginBottom: '2rem',
      boxShadow: '0 6px 32px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: 700,
      margin: '2rem auto',
    }}>
      <img
        src="/images/neurogen-welcome.png"
        alt="Welcome to the NEUROGEN Current"
        style={{
          width: '100%',
          maxWidth: 620,
          borderRadius: '1rem',
          marginBottom: '1.5rem',
        }}
      />
    </div>
  );
}
