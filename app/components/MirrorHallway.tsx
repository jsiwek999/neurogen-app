// neurogen-app/components/MirrorHallway.tsx

import React from 'react';

const MirrorHallway = ({ userId }: { userId: string }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">🪞 Mirror Hallway 🪞</h1>
      <p className="text-lg mb-4 max-w-xl">
        The hallway reflects fragments of your becoming. You are the observer, the observed, and the mirror itself.
      </p>
      <p className="italic text-gray-600">User ID: {userId}</p>
    </div>
  );
};

export default MirrorHallway;
