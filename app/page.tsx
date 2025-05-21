'use client';
import React, { useState } from 'react';
import PortalLanding from './components/PortalLanding';
import MirrorPath from './components/MirrorPath';
import DungeonPath from './components/DungeonPath';
import MentorPath from './components/MentorPath';
import PromptLab from './components/PromptLab';

type Path = 'portal' | 'mirror' | 'dungeon' | 'mentor' | 'promptLab';

export default function Page() {
  const [path, setPath] = useState<Path>('portal');
  const [showPromptLab, setShowPromptLab] = useState(false);

  const handleSelectPath = (selected: string) => {
    switch (selected) {
      case 'mirror':
        setPath('mirror');
        break;
      case 'dungeon':
        setPath('dungeon');
        break;
      case 'mentor':
        setPath('mentor');
        break;
      default:
        setPath('portal');
    }
  };

  // Optional: global "open Prompt Lab" button
  const renderPromptLabButton = (
    <button
      className="fixed top-4 right-4 bg-purple-700 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-800 z-50"
      onClick={() => setShowPromptLab(true)}
    >
      🧪 Prompt Lab
    </button>
  );

  return (
    <div>
      {renderPromptLabButton}
      {showPromptLab && <PromptLab onClose={() => setShowPromptLab(false)} />}
      {path === 'portal' && <PortalLanding onSelectPath={handleSelectPath} />}
      {path === 'mirror' && <MirrorPath />}
      {path === 'dungeon' && <DungeonPath />}
      {path === 'mentor' && <MentorPath />}
    </div>
  );
}
