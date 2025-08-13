import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Navbar } from '../components/Navbar'
export const metadata = { title: 'NEUROGEN', description: 'Presence with teeth' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar />
          <main className="container py-8 space-y-6">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
