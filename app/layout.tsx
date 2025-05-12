import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Subscribely",
    template: "%s | Subscribely",
  },
  description: "Subscription Manager",
  metadataBase: new URL("https://subscribely-subscription-manager.vercel.app/"),
  openGraph: {
    title: "Subscribely",
    description: "Subscription Manager",
    url: "https://subscribely-subscription-manager.vercel.app/",
    siteName: "Subscribely",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Subscribely",
    description: "Subscription Manager",
    site: "@subscribely",
    creator: "@subscribely",
    images: ["/twitter-image.png"],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "Subscribely",
    "Subscription Manager",
    "subscriptions",
    "management",
    "finance",
    "budgeting",
    "personal finance",
    "money management",
    "expense tracking",
    "financial planning",
    "subscription tracking",
    "subscription management app",
    "subscription organizer",
    "subscription reminder",
    "subscription cancellation",
    "subscription overview",
    "subscription insights",
  ],
  robots: "index, follow",
  authors: [{ name: "Subscribely Team" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.variable} antialiased pattern`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
