import React from "react";

interface PortalRoomScreenProps {
  onContinue: () => void;
}

const PortalRoomScreen: React.FC<PortalRoomScreenProps> = ({ onContinue }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
    <div className="max-w-lg mx-auto p-8 rounded-2xl shadow-xl bg-black/70">
      <h2 className="text-2xl font-bold mb-3 text-center">The Threshold Opens</h2>
      <p className="mb-6 text-center">
        Your adventure starts now. Each time you return, new portals and rituals will open. This is your guild headquarters, your mirror, and your map.
        <br />
        Step in, and let the quest begin.
      </p>
      <button
        className="w-full mt-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg transition hover:scale-105"
        onClick={onContinue}
      >
        Enter the Portal Room
      </button>
    </div>
  </div>
);

export default PortalRoomScreen;
