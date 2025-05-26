import ClientRedirectWrapper from "../../components/ClientRedirectWrapper";

export default function PortalRoomPage() {
  return (
    <ClientRedirectWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">
        <div className="max-w-lg mx-auto p-8 rounded-2xl shadow-xl bg-black/70 text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to the Portal Room</h1>
          <p className="mb-4 text-lg">
            This is your guild headquarters, your mirror, and your map. New rituals, quests, and portals await. Where will you venture next?
          </p>
        </div>
      </div>
    </ClientRedirectWrapper>
  );
}
