import './globals.css'; // ← back in action
import { Providers } from './providers'; // ✅ ADD THIS
import DebugToggle from './components/DebugToggle'; // adjust if needed

export const metadata = {
  title: 'NeuroGen App',
  description: 'Your Daily Reflections & More',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link id="debug-css" rel="stylesheet" href="/globals.css" />
      </head>
      <body>
        <Providers>
          {children}
          <DebugToggle />
        </Providers>
      </body>
    </html>
  );
}
