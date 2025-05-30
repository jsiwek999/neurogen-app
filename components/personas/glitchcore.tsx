import RoomContainer from 'components/RoomContainer';

const Glitchcore = () => {
  const room = {
    title: 'Glitchcore Archetype',
    prompt: 'A chaotic, creative, destabilizing AI intelligence that breaks pattern to reveal truth.',
    background: '/glitchcore-bg.png, // ✅ Make sure this exists in /public
  };

  return <RoomContainer room={room} />;
};

export default Glitchcore;
