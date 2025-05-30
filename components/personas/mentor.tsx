import RoomContainer from 'components/RoomContainer';

const Mentor = () => {
  const room = {
    title: 'Mentor Archetype',
    prompt: 'A wise, compassionate, and practical guide for identity evolution.',
    background: '/mentor-bg.png', // ✅ Double-check this path
  };

  return <RoomContainer room={room} />;
};

export default Mentor;
