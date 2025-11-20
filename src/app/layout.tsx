import type { Metadata } from "next";
import { DM_Sans } from 'next/font/google';
import "./globals.css";
import ClientLayout from "./client-layout"; // new wrapper

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: '',
  description: '',
  openGraph: {
    images: [''],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.className}>
      <body className="min-h-screen bg-gray-50 antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
