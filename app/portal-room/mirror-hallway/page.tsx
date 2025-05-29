// /app/portal-room/mirror-hallway/page.tsx
import { roomsConfig } from 'utils/roomsConfig';
import RoomContainer from 'components/RoomContainer';

export default function MirrorHallwayPage() {
  const room = roomsConfig['mirror-hallway'];
  return <RoomContainer room={room} />;
}
