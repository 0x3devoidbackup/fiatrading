import type { Metadata } from "next";
import { DM_Sans } from 'next/font/google';
import "./globals.css";
import { WalletProvider } from '@/context/walletContext'


const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: "GrantDao",
  description: "A Community Governed Grants",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.className}`}>
      <WalletProvider>
        <body
        >
          {children}
        </body>
      </WalletProvider>
    </html>
  );
}
