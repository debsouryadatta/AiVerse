import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/common/Providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/common/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AiVerse",
  description: "Unleash the Power of AI in Learning. Join the Community!",
  openGraph: {
    type: "website",
    title: "AiVerse",
    description: "Unleash the Power of AI in Learning. Join the Community!",
    url: "https://aiverse.souryax.tech",
    siteName: "AiVerse",
    images: [{
      url: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1734083939/projects/Screenshot_2024-12-13_at_3.24.58_PM_nsld3o.png",
      width: 1200,
      height: 630,
      alt: "AiVerse Preview Image",
    }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AiVerse",
    description: "Unleash the Power of AI in Learning. Join the Community!",
    site: "https://aiverse.souryax.tech",
    images: [{
      url: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1734083939/projects/Screenshot_2024-12-13_at_3.24.58_PM_nsld3o.png",
      alt: "AiVerse Preview Image",
    }],
  },
  icons: {
    shortcut: "https://res.cloudinary.com/diyxwdtjd/image/upload/v1734098503/projects/aiverse-logo_mbtjg8.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Analytics />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
