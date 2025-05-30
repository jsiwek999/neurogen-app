// /app/portal-room/mentor/page.tsx
import RoomContainer from 'components/RoomContainer';
import { roomsConfig } from 'utils/roomsConfig';

export default function glitchcore() {
  const room = roomsConfig['glitchcore'];

  return <RoomContainer room={room} />;
}
