import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from 'nextjs-toploader';
import { auth } from "@/auth";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextThemeProviders from "@/providers/theme-provider";
import { ChatInsightStoreProvider } from "@/providers/chatInsightStoreProvider";
import { SITE_BASE_URL, SITE_NAME } from "@/lib/utils/constants";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
 themeColor: '#daf8c4'
}

const siteTitle = `${SITE_NAME} - WhatsApp Analytics and Insights app`;
export const metadata: Metadata = {
  metadataBase: new URL(SITE_BASE_URL),
  title: siteTitle,
  description:
    "A full fledged application to analyze your whatsapp chat, fun facts, and its trends. It is 100% secure",
  verification: {
    google: "Y3dQyATThljiDYYWIrKfK2EOYU-B7rILPW_0arfC9HM",
  },
  openGraph: {
    type: 'website',
    title: siteTitle,
    description: "A full fledged application to analyze your whatsapp chat, fun facts, and its trends. It is 100% secure",
    images: "/wapp-trends-opengraph-1200x630-compressed.jpg",
    url: "https://whatsapp-chat-trends.vercel.app",
  },
  twitter: {
    title: siteTitle,
    description: "A full fledged application to analyze your whatsapp chat, fun facts, and its trends. It is 100% secure",
    card: "summary_large_image",
    site: "https://whatsapp-chat-trends.vercel.app",
    images: "/wapp-trends-opengraph-1200x630-compressed.jpg",
    creator: "Raj_896",
  }

};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <NextThemeProviders>
            <NextTopLoader />
            <ChatInsightStoreProvider>{children}</ChatInsightStoreProvider>
          </NextThemeProviders>
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
