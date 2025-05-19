import React from 'react';

interface ResponseBoxProps {
  type: 'user' | 'ai';
  text: string;
}

export default function ResponseBox({ type, text }: ResponseBoxProps) {
  const isUser = type === 'user';
  return (
    <div style={{
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      background: isUser ? '#daf1da' : '#f1f1f1',
      color: '#333',
      padding: '0.75rem 1rem',
      borderRadius: '1rem',
      maxWidth: '80%',
      margin: '0.25rem 0'
    }}>
      {text}
    </div>
  );
}
