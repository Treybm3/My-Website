import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trey'z Cutz | Barbershop in Holt, Michigan",
  description: "Premium barbershop in Holt, Michigan. Fresh cuts, clean fades, beard trims and more. Walk-ins welcome, appointments preferred. Book your cut today!",
  keywords: "barbershop holt michigan, fade haircut lansing, barber near me, fresh cuts, beard trim",
  openGraph: {
    title: "Trey'z Cutz | Barbershop in Holt, Michigan",
    description: "Premium barbershop in Holt, Michigan. Fresh cuts, clean fades, beard trims and more.",
    type: "website",
  },
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
