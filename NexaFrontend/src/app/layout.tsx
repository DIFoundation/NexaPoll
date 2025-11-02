import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from 'next/font/google'
import "./globals.css";
import { headers } from 'next/headers'
import ContextProvider from '@/context'
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "NexaPoll - Build and Govern DAOs with Confidence",
  description: "Create decentralized autonomous organizations, manage treasuries, propose governance changes, and vote on the future of your community. All powered by smart contracts and blockchain technology.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const headersObj = await headers();
  const cookies = headersObj.get('cookie')
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
      >
        <ContextProvider cookies={cookies}>
          {children}
          <Toaster />
        </ContextProvider>
      </body>
    </html>
  );
}
