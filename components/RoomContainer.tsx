// components/RoomContainer.tsx
'use client';
import React, { ReactNode } from 'react';
import Link from 'next/link';
import MirrorPanel from './MirrorPanel';

type RoomData = {
  title: string;
  prompt: string;
  background: string;
  glyph?: string;
};

type ArchetypeData = {
  name: string;
  description: string;
  emxTags: string[];
  symbol: string;
};

type RoomContainerProps = {
  room?: RoomData;
  archetype?: ArchetypeData;
  children?: ReactNode;
};

export default function RoomContainer({ room, archetype, children }: RoomContainerProps) {
  const isArchetype = !!archetype;
  const title = isArchetype ? archetype!.name : room!.title;
  const prompt = isArchetype ? archetype!.description : room!.prompt;
  const background = isArchetype ? '/default-bg.jpg' : room!.background; // Fallback for archetype pages
  const glyph = isArchetype ? archetype!.symbol : room?.glyph;

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '2rem',
        color: 'white',
        position: 'relative',
      }}
    >
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

      {glyph && (
        <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>
          {glyph}
        </div>
      )}

      <h1 style={{ fontSize: '2rem', textAlign: 'center' }}>{title}</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>{prompt}</p>

      {children ? children : <MirrorPanel prompt={prompt} />}
    </div>
  );
}
