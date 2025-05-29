// /app/portal-room/library/page.tsx
import { roomsConfig } from 'utils/roomsConfig';
import RoomContainer from 'components/RoomContainer';

export default function LibraryPage() {
  const room = roomsConfig['library'];
  return <RoomContainer room={room} />;
}
