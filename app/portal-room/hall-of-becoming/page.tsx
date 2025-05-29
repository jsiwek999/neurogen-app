// /app/portal-room/hall-of-becoming/page.tsx
import { roomsConfig } from 'utils/roomsConfig';
import RoomContainer from 'components/RoomContainer';

export default function HallOfBecomingPage() {
  const room = roomsConfig['hall-of-becoming'];
  return <RoomContainer room={room} />;
}
