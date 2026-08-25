import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PollSync — real-time polls",
    template: "%s · PollSync",
  },
  description:
    "Create a poll in seconds, share the link or QR code, and watch votes come in live.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="border-b">
          <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
            <Link
              href="/"
              className="font-heading text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            >
              Poll<span className="text-primary">Sync</span>
            </Link>
            <nav aria-label="Main" className="flex items-center gap-1 text-sm">
              <Link
                href="/"
                className="rounded-md px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Create
              </Link>
              <Link
                href="/polls"
                className="rounded-md px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                My polls
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
        </main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
