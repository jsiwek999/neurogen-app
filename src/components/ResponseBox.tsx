'use client';

interface ResponseBoxProps {
  response: string;
}

export default function ResponseBox({ response }: ResponseBoxProps) {
  return (
    <div
      style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        minHeight: '80px'
      }}
    >
      {response || "Awaiting mythic Current…"}
    </div>
  );
}
