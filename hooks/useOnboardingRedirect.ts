"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isOnboardingComplete } from "../utils/onboarding";

// Only call this in client components
export function useOnboardingRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !isOnboardingComplete() &&
      pathname !== "/onboarding"
    ) {
      router.replace("/onboarding");
    }
  }, [pathname, router]);
}
