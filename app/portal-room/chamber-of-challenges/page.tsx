// /app/portal-room/chamber-of-challenges/page.tsx
import { roomsConfig } from 'utils/roomsConfig';
import RoomContainer from 'components/RoomContainer';

export default function ChamberOfChallengesPage() {
  const room = roomsConfig['chamber-of-challenges'];
  return <RoomContainer room={room} />;
}
