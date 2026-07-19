import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

import { APP_TITLE, APP_DESCRIPTION } from '@/lib/constants'

export const metadata: Metadata = {
  title: APP_TITLE,
  description: APP_DESCRIPTION,
}

/**
 * Renders the root layout for the Next.js application.
 * @param {{ children: React.ReactNode }} props - Component props containing the nested children.
 * @returns {import("react").JSX.Element} The rendered component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): import('react').JSX.Element {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
