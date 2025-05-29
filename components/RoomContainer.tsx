// /components/RoomContainer.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import MirrorPanel from './MirrorPanel';

type RoomData = {
  title: string;
  prompt: string;
  background: string;
  glyph?: string;
};

type RoomContainerProps = {
  room: RoomData;
};

export default function RoomContainer({ room }: RoomContainerProps) {
  return (
    <div
      style={{
        backgroundImage: `url(${room.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '2rem',
        color: 'white',
        position: 'relative', // Needed for positioning the link
      }}
    >
      {/* Back to Portal Room */}
      <Link
        href="/portal-room"
        style={{
          display: 'inline-block',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          padding: '0.5rem 1.2rem',
          borderRadius: '999px',
          textDecoration: 'none',
          fontWeight: 'bold',
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          zIndex: 99,
          transition: 'background 0.2s',
        }}
      >
        ← Return to Portal Room
      </Link>

      {/* Glyph Header */}
      {room.glyph && (
        <div
          style={{
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          {room.glyph}
        </div>
      )}

      <h1 style={{ fontSize: '2rem', textAlign: 'center' }}>{room.title}</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>{room.prompt}</p>

      {/* Mirror or other room interaction */}
      <MirrorPanel prompt={room.prompt} />
    </div>
  );
}
