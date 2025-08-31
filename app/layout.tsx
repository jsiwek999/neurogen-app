// app/layout.tsx (Server Component)
import { getUser } from "@/lib/supabase/server";
import NavBar from "@/components/NavBar";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <html lang="en">
      <body>
        <NavBar user={user} />
        {children}
      </body>
    </html>
  );
}
