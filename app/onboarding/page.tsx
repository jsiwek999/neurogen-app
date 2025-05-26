"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingFlow from "../../components/onboarding/OnboardingFlow";
import { isOnboardingComplete } from "../../utils/onboarding";

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    if (isOnboardingComplete()) {
      router.replace("/portal-room");
    }
  }, [router]);

  return (
    <OnboardingFlow onComplete={() => router.replace("/portal-room")} />
  );
}
