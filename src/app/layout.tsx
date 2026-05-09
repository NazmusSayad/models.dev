import '@/styles/index.css'
import '@/styles/theme.css'

import { cn } from '@/lib/utils'
import { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Rubik } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { PropsWithChildren } from 'react'

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'OpenSource AI Models DB UI | Source: models.dev',
  description:
    'Browse AI models from providers around the world from models.dev in a beautiful, fast UI',
  icons: {
    icon: '/logo/logo-64.png',
  },
  openGraph: {
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('font-sans', rubik.variable)}
    >
      <body className="antialiased">
        <ThemeProvider attribute="class" enableSystem>
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  )
}
