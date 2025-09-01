// app/layout.tsx
import "./globals.css";
import { getUser } from "@/lib/supabase/server";
import Navbar from "../components/Navbar";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <html lang="en">
      <body>
        {/* Sticky top navigation */}
        <Navbar user={user} />
        {/* Page content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
