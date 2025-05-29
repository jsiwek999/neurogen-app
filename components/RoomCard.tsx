// neurogen-app/components/RoomCard.tsx

import React from 'react';
import Link from 'next/link';

interface RoomCardProps {
  href: string;
  title: string;
  emoji: string;
  description: string;
}

const RoomCard: React.FC<RoomCardProps> = ({ href, title, emoji, description }) => {
  return (
    <Link href={href}>
      <div className="bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
        <h2 className="text-xl font-semibold mb-2">{emoji} {title}</h2>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
    </Link>
  );
};

export default RoomCard;
