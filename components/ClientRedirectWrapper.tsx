"use client";
import React, { ReactNode } from "react";
import { useOnboardingRedirect } from "../hooks/useOnboardingRedirect";

interface Props {
  children: ReactNode;
}

export default function ClientRedirectWrapper({ children }: Props) {
  useOnboardingRedirect();
  return <>{children}</>;
}
