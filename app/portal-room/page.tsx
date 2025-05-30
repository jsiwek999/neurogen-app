'use client';

import React from 'react';
import RoomLayout from '../../components/RoomLayout'; // Adjust path if needed
import RoomCard from 'components/RoomCard'; // Confirm this path works for you

export default function PortalRoomPage() {
  return (
    <RoomLayout
      title="🌀 Welcome to the Portal Room"
      backgroundImage="/portal-room-bg.png"
    >
      <p className="text-lg mb-10 max-w-xl text-center mx-auto">
        Choose your path, brave seeker. These rooms hum with mythic potential...
      </p>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 w-full max-w-5xl mx-auto">
        <RoomCard
          href="/portal-room/chamber-of-challenges"
          title="Chamber of Challenges"
          emoji="🔥"
          description="Face trials that awaken your power and sharpen your will."
        />
        <RoomCard
          href="/portal-room/guildhouse"
          title="Guildhouse"
          emoji="🏰"
          description="Join others on the path of transformation and shared wisdom."
        />
        <RoomCard
          href="/portal-room/hall-of-becoming"
          title="Hall of Becoming"
          emoji="🌱"
          description="Enter the space of unfolding — where your next self is born."
        />
        <RoomCard
          href="/portal-room/library"
          title="Library"
          emoji="📚"
          description="Drink deeply of the scrolls. Knowledge lies waiting."
        />
        <RoomCard
          href="/portal-room/mirror-hallway"
          title="Mirror Hallway"
          emoji="🔮"
          description="Gaze into the reflections. What aspect of you awakens?"
        />
        <RoomCard
          href="/portal-room/stoic-room"
          title="Stoic Room"
          emoji="🏛️"
          description="Enter the calm. Reflect with the archetype of clarity and resilience."
        />
      </div>
    </RoomLayout>
  );
}
