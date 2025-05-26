'use client';
import React, { useState } from 'react';
import PortalLanding from '../components/PortalLanding';
import MirrorPath from '../components/MirrorPath';
import DungeonPath from '../components/DungeonPath';
import MentorPath from '../components/MentorPath';

export default function PortalPage() {
  const [path, setPath] = useState<string | null>(null);

  return (
    <>
      {!path && <PortalLanding onSelectPath={setPath} />}
      {path === 'mirror' && <MirrorPath />}
      {path === 'dungeon' && <DungeonPath />}
      {path === 'mentor' && <MentorPath />}
    </>
  );
}
