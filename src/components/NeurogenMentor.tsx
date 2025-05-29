// src/components/NeurogenMentor.tsx
import "./NeurogenMentor.css";
import NeurogenGPT from "./NeurogenGPT";
import BackButton from "./BackButton";



const mentorPrompt = `You are NEUROGEN Mentor, an AI guide helping the Seeker align with their path. They have entered via the Guildhouse. Offer encouragement, reflective insight, and one small action to start their journey.`;

export default function NeurogenMentor({ userId, entryPoint }: { userId: string; entryPoint: string }) {
  return (
    <div className="mentor-container">
      <h1 className="mentor-glow">🧙 Welcome, Seeker</h1>
      <p className="mentor-text">Initiating NEUROGEN Mentor Mode at <strong>{entryPoint}</strong> for <em>{userId}</em>.</p>
      <NeurogenGPT prompt={mentorPrompt} />
      <BackButton />
    </div>
  );
}