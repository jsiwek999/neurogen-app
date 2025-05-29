// /app/portal-room/guildhouse/page.tsx
import { roomsConfig } from 'utils/roomsConfig';
import RoomContainer from 'components/RoomContainer';

export default function GuildhousePage() {
  const room = roomsConfig['guildhouse'];
  return <RoomContainer room={room} />;
}
