import * as React from "react"
import { GoogleAnalytics } from '@next/third-parties/google'
// import { Geist } from "next/font/google";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import Header from "@/components/header";


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Mindmaker. SWOT Analysis, Lean Canvas, PESTEL Analysis and other frameworks online",
  description: "Create and explore SWOT, Lean Canvas, PESTEL, and other business analysis frameworks online with Mindmaker. Simple, fast, and free to use.",
};

// const geistSans = Geist({
//   display: "swap",
//   subsets: ["latin"],
// });

const interFont = Inter({
  display: "swap",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "greek", "greek-ext", "vietnamese"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interFont.className} suppressHydrationWarning>
      <body className="bg-background text-foreground -tracking-[.0075em]">

        <main>

          <Header />

          {children}

        </main>
        
        <Toaster />

        <GoogleAnalytics gaId="G-TZX8HM9QLR" />

      </body>
    </html>
  );
}


