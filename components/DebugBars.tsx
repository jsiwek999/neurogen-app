export default function DebugBars() {
  return (
    <>
      {/* Top red stripe */}
      <div className="fixed inset-x-0 top-0 h-[6px] bg-red-500 z-[99999] pointer-events-none select-none" />
      {/* Bottom blue stripe (accounts for iOS safe-area) */}
      <div className="fixed inset-x-0 bottom-[env(safe-area-inset-bottom)] h-[6px] bg-blue-500 z-[99999] pointer-events-none select-none" />
    </>
  );
}
