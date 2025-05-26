import React, { useState } from "react";
import WelcomeScreen from "./WelcomeScreen";
import DistinctionScreen from "./DistinctionScreen";
import SetIntentionScreen from "./SetIntentionScreen";
import ArchetypeSelectScreen from "./ArchetypeSelectScreen";
import PortalRoomScreen from "./PortalRoomScreen";
import { setOnboardingComplete } from "../../utils/onboarding";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [intention, setIntention] = useState<string>("");
  const [archetype, setArchetype] = useState<string>("");

  // Steps array: Each screen gets the right props for its "continue" action
  const screens = [
    <WelcomeScreen key="welcome" onContinue={() => setStep(1)} />,
    <DistinctionScreen key="distinction" onContinue={() => setStep(2)} />,
    <SetIntentionScreen
      key="intention"
      onContinue={(intent) => {
        setIntention(intent);
        setStep(3);
      }}
    />,
    <ArchetypeSelectScreen
      key="archetype"
      onContinue={(selected) => {
        setArchetype(selected);
        setStep(4);
      }}
    />,
    <PortalRoomScreen
      key="portal"
      onContinue={() => {
        setOnboardingComplete();

        onComplete();
      }}
    />,
  ];

  // Render current step
  return <>{screens[step]}</>;
};

export default OnboardingFlow;
