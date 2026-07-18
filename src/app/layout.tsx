import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Google AdSense publisher ID.
const ADSENSE_CLIENT = "ca-pub-1453648623540291";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pickar",
  description: "Get paid anywhere — chat with support and request your payment details.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pickar",
  },
  icons: { apple: "/pickar.png" },
  // Google AdSense site verification (Meta tag method) — rendered into the
  // raw <head>, so the AdSense crawler can always see it.
  other: { "google-adsense-account": ADSENSE_CLIENT },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  // Let content extend into the notch / home-indicator areas; we then pad with
  // env(safe-area-inset-*) where needed.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {/* Google AdSense — injected into the initial HTML <head> for
            site verification and to serve ads across every page. */}
        <Script
          id="google-adsense"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
