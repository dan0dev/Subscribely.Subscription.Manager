import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Subscribely",
  description: "Subscription Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ide tedd a console.log-ot, hogy lefusson rendereléskor
  console.log("CI test successful");

  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.variable} antialiased pattern`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
