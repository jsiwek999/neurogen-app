'use client';

import React from 'react';
import './RoomLayout.css';

interface RoomLayoutProps {
  title: string;
  backgroundImage: string;
  children: React.ReactNode;
}

export default function RoomLayout({ title, backgroundImage, children }: RoomLayoutProps) {
  return (
    <div className="room-layout" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="room-overlay">
        <h1 className="room-title">{title}</h1>
        <div className="room-content">{children}</div>
      </div>
    </div>
  );
}
