// components/LoginClient.tsx
'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginClient() {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL as string)

  return (
    <div className="max-w-sm mx-auto p-6">
      <Auth
        supabaseClient={supabase}
        view="magic_link"
        magicLink
        providers={['google']}
        redirectTo={`${origin}/journal`}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#ffffff',
                brandAccent: '#e5e7eb',
                inputText: '#ffffff',
                inputBackground: 'transparent',
                inputBorder: '#ffffff33',
                // base button look (dark)
                defaultButtonBackground: '#0a0a0a',
                defaultButtonBackgroundHover: '#111827',
                defaultButtonBorder: '#ffffff26',
                defaultButtonText: '#ffffff',
                anchorTextColor: '#ffffff',
              },
            },
          },
          className: {
            // Make all nested buttons dark by default
            // On hover, provider buttons keep their own behavior,
            // and the MAGIC LINK (submit) button becomes transparent (navy shows through)
            container:
              'text-white ' +
              '[&_button]:bg-black [&_button]:text-white [&_button]:border-white/20 ' +
              '[&_button:hover]:bg-black/80 ' +
              // 🔽 submit (magic link) special: match Google’s “blend with background” hover
              '[&_button[type=submit]:hover]:bg-transparent [&_button[type=submit]:hover]:border-white/30 [&_button[type=submit]:hover]:text-white',
            label: 'text-white',
            input:
              'bg-transparent text-white placeholder-gray-300 border-white/30 focus:border-white',
            // Base submit button styles (dark), hover handled above
            button:
              'bg-black text-white border-white/20 focus:ring-2 focus:ring-white/30 transition-colors',
            anchor: 'text-white hover:text-gray-200',
            message: 'text-white',
            divider: 'bg-white/20',
          },
        }}
      />
    </div>
  )
}
