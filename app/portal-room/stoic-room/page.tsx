// app/portal-room/stoic-room/page.tsx
import RoomContainer from 'components/RoomContainer';
import StoicMirror from 'src/components/StoicMirror';
import { archetypesConfig } from 'utils/archetypesConfig';

export default function StoicRoomPage() {
  const archetype = archetypesConfig['stoic'];

  return (
    <RoomContainer archetype={archetype}>
      <StoicMirror />
    </RoomContainer>
  );
}
