import '@/styles/index.css'

import { cn } from '@/lib/utils'
import { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Geist } from 'next/font/google'
import { PropsWithChildren } from 'react'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Models',
  description: 'Browse AI models from providers around the world',
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('font-sans', geist.variable)}
    >
      <body className="antialiased">
        <ThemeProvider attribute="class" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
