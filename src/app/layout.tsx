import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "kinyanjui.pi — Pi Network Domain Portfolio & Ecosystem",
  description:
    "The flagship Pi Network domain portfolio of Kinyanjui. Explore premium .pi domains including kinyanjui.pi, soko.pi, pioneerhub.pi, piart.pi and more — the gateway to the Pi ecosystem.",
  keywords: [
    "Pi Network",
    "kinyanjui.pi",
    "Pi domains",
    ".pi",
    "Pi ecosystem",
    "Pi blockchain",
    "Web3 domains",
    "pioneer",
    "crypto domains",
  ],
  authors: [{ name: "Kinyanjui" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "kinyanjui.pi — Pi Network Domain Portfolio",
    description:
      "A curated portfolio of .pi domains and a launchpad for the Pi Network ecosystem.",
    url: "https://kinyanjui.pi",
    siteName: "kinyanjui.pi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "kinyanjui.pi — Pi Network Domain Portfolio",
    description:
      "A curated portfolio of .pi domains and a launchpad for the Pi Network ecosystem.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
