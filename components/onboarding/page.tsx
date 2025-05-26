// app/onboarding/page.tsx
import React from "react";
import OnboardingFlow from "../../components/onboarding/OnboardingFlow";
import { useRouter } from "next/navigation";
import { isOnboardingComplete } from "../../utils/onboarding";

export default function OnboardingPage() {
  const router = useRouter();

  // If onboarding is already complete, redirect
  React.useEffect(() => {
    if (isOnboardingComplete()) {
      router.replace("/portal-room");
    }
  }, [router]);

  return (
    <OnboardingFlow onComplete={() => router.replace("/portal-room")} />
  );
}
