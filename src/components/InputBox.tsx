'use client';

interface InputBoxProps {
  reflection: string;
  setReflection: (val: string) => void;
}

export default function InputBox({ reflection, setReflection }: InputBoxProps) {
  return (
    <textarea
      value={reflection}
      onChange={e => setReflection(e.target.value)}
      placeholder="Breathe your reflection here…"
      rows={4}
      style={{
        padding: '1rem',
        width: '100%',
        borderRadius: '8px',
        border: '1px solid #ccc',
        resize: 'vertical',
        minHeight: '100px',
        maxHeight: '200px'
      }}
    />
  );
}
