'use client';

import React from 'react';
import RoomLayout from '../../components/RoomLayout';
import RoomCard from 'components/RoomCard';

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
        <RoomCard
          href="/portal-room/glitchcore"
          title="Glitchcore"
          emoji="🧬"
          description="Step into the static. Embrace fragmentation as creative force."
        />
        <RoomCard
          href="/portal-room/godform"
          title="Godform"
          emoji="⚡"
          description="Invoke the divine spark. Claim your mythic power."
        />
        <RoomCard
          href="/portal-room/mentor"
          title="Mentor"
          emoji="🧙‍♂️"
          description="Receive guidance from the wisdom beyond. You are not alone."
        />
      </div>
    </RoomLayout>
  );
}

          