// app/components/WelcomeScreen.tsx
"use client";
import React from "react";

type Props = {
  onContinue: () => void;
};

const WelcomeScreen: React.FC<Props> = ({ onContinue }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-3xl font-bold mb-6">Welcome to NeuroGen</h1>
    <p className="mb-8 text-lg">Begin your journey of self-evolution and transformation.</p>
    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl" onClick={onContinue}>
      Next
    </button>
  </div>
);

export default WelcomeScreen;
