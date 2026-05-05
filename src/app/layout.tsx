import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/lib/toast'

export const metadata: Metadata = {
  title: 'Bloom Admin — AI Timeline Engine',
  description: 'Bloom platform administration panel',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream text-ink flex min-h-screen">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
