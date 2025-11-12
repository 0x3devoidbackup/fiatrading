import type { Metadata } from "next";
import { DM_Sans } from 'next/font/google';
import "./globals.css";
import { WalletProvider } from '@/context/walletContext'


import Footer from "./footer";
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});



export const metadata: Metadata = {
  title: 'GrantDao',
  description: 'A Community Governed Grants',
  openGraph: {
    images: ['https://www.grantdao.fun/images/logo.png'],
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: '1',
      imageUrl: 'https://www.grantdao.fun/images/logo.png',
      button: {
        title: 'Launch Grant',
        action: {
          type: 'launch_miniapp',
          url: 'https://www.grantdao.fun',
          name: 'GrantDao',
          splashImageUrl: 'https://www.grantdao.fun/images/logo.png',
          splashBackgroundColor: '#000000',
        },
      },
    }),
  },
}


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
          <Footer />

        </body>
      </WalletProvider>
    </html>
  );
}
