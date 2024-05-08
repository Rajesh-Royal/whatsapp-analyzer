import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from 'nextjs-toploader';
import { auth } from "@/auth";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextThemeProviders from "@/providers/theme-provider";
import { ChatInsightStoreProvider } from "@/providers/chatInsightStoreProvider";
import { SITE_NAME } from "@/lib/utils/constants";

const inter = Inter({ subsets: ["latin"] });

const siteTitle = `${SITE_NAME} - WhatsApp Analytics and Insights app`;
export const metadata: Metadata = {
  title: siteTitle,
  description:
    "A full fledged application to analyze your whatsapp chat, fun facts, and its trends. It is 100% secure",
  themeColor: "#daf8c4",
  verification: {
    google: "google-site-verification=CRwqvsQjLJimgYeoQ0xs3jl2b18mfRSrFkci_OTSabE"
  },
  openGraph: {
    type: 'website',
    title: siteTitle,
    description: "A full fledged application to analyze your whatsapp chat, fun facts, and its trends. It is 100% secure",
    images: {
      height: "<generated>",
      width: "<generated>",
      url: '"<generated>"'
    },
    url: "https://whatsapp-chat-trends.vercel.app",
  },
  twitter: {
    title: siteTitle,
    description: "A full fledged application to analyze your whatsapp chat, fun facts, and its trends. It is 100% secure",
    card: "summary_large_image",
    site: "https://whatsapp-chat-trends.vercel.app",
    images: {
      height: "<generated>",
      width: "<generated>",
      url: '"<generated>"'
    },
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
