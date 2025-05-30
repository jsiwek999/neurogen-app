// /app/portal-room/mentor/page.tsx
import RoomContainer from 'components/RoomContainer';
import { roomsConfig } from 'utils/roomsConfig';

export default function MentorRoom() {
  const room = roomsConfig['mentor'];

  return <RoomContainer room={room} />;
}
