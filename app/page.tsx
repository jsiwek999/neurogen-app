import ClientRedirectWrapper from "../components/ClientRedirectWrapper";

export default function HomePage() {
  return (
    <ClientRedirectWrapper>
      {/* Home page content goes here */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-3xl font-bold">NEUROGEN Home</h1>
        <p className="mt-4">You are home. Portal Room and other features are now accessible.</p>
      </div>
    </ClientRedirectWrapper>
  );
}
