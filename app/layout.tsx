import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import './globals.css'
import { Toaster } from "@/components/ui/sonner";
import NextThemeProviders from '@/providers/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WhatsApp Chat Analyzer',
  description: 'A full fledged application to analyze your whatsapp chat, fun facts, and its trends',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <NextThemeProviders>
            {children}
            </NextThemeProviders>
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  )
}
