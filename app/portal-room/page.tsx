// app/portal-room/page.tsx  (Server Component)
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";

export default async function PortalRoom() {
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/portal-room")}`);
  return <div>Welcome to the Portal Room, {user.email}</div>;
}
