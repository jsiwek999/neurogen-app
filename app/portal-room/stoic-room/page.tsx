// app/portal-room/stoic-room/page.tsx
'use client';
import { roomsConfig } from 'utils/roomsConfig';
import RoomContainer from 'components/RoomContainer';

export default function StoicMirror() {
  const room = roomsConfig['stoic-room'];
  return <RoomContainer room={room} />;
}
