'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginClient() {
  return (
    <div className="max-w-sm mx-auto p-6">
      <Auth
        supabaseClient={supabase}
        view="magic_link"
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#111827',
                brandAccent: '#1f2937',
                inputText: '#111827',
                defaultButtonBackground: '#ffffff',
                defaultButtonBackgroundHover: '#f3f4f6',
                defaultButtonText: '#000000',
              },
            },
          },
          className: {
            button: 'text-black',
          },
        }}
        magicLink
        redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/journal`}
        providers={['google']}
      />
    </div>
  )
}