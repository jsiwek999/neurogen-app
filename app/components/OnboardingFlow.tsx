import React, { useState } from "react";
import WelcomeScreen from "./WelcomeScreen";
import DistinctionScreen from "./DistinctionScreen";
import SetIntentionScreen from "./SetIntentionScreen";
import ArchetypeSelectScreen from "./ArchetypeSelectScreen";
import PortalRoomScreen from "./PortalRoomScreen";

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [intention, setIntention] = useState<string>("");
  const [archetype, setArchetype] = useState<string>("");

  function nextStep(data?: string) {
    if (step === 2 && data) setIntention(data);
    if (step === 3 && data) setArchetype(data);
    setStep((s) => s + 1);
  }

  // Persist intention/archetype to global state/store as needed

  switch (step) {
    case 0:
      return <WelcomeScreen onContinue={nextStep} />;
    case 1:
      return <DistinctionScreen onContinue={nextStep} />;
    case 2:
      return <SetIntentionScreen onContinue={nextStep} />;
    case 3:
      return <ArchetypeSelectScreen onContinue={nextStep} />;
    case 4:
      return <PortalRoomScreen onContinue={onComplete} />;
    default:
      return null;
  }
};

export default OnboardingFlow;
