// app/page.tsx
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import Hero from "@/components/Hero";

export default async function Home() {
  const user = await getUser();
  if (user) redirect("/journal");
  return <Hero />;
}
