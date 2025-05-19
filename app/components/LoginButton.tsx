'use client';

import { supabase } from '@/lib/supabaseClient';

export default function LoginButton() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Login error:', error.message);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Sign in with Google
    </button>
  );
}
