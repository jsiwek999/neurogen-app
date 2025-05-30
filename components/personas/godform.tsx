import RoomContainer from '@/components/RoomContainer';

const GodformPersona = () => {
  const room = {
    title: 'Godform Archetype',
    prompt: 'This room is the embodiment of divinity, sovereignty, and mythic command.',
    background: '/godform-bg.jpg',
  };

  return <RoomContainer room={room} />;
};

export default GodformPersona;
