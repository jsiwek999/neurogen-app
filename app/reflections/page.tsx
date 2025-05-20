"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export default function ReflectionsPage() {
  // ... all your hooks and logic using `supabase`
}
