import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeAccentProvider } from "@/components/ThemeAccentContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Filmzy - Discover & Bookmark Your Favorite Movies",
  description: "Explore top-rated movies, trending series, and personalize your watchlist with Filmzy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0f19] text-gray-100`}>
        <ThemeAccentProvider>
          <Toaster position="top-center" richColors />
          {children}
        </ThemeAccentProvider>
      </body>
    </html>
  );
}
