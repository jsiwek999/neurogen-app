// /app/portal-room/mentor/page.tsx
import RoomContainer from 'components/RoomContainer';
import { roomsConfig } from 'utils/roomsConfig';

export default function godform() {
  const room = roomsConfig['godform'];

  return <RoomContainer room={room} />;
}
