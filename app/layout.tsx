import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
const Footer = React.lazy(() => import("@/components/General/Footer"));

const Header = React.lazy(() => import('@/components/General/Header'));
import { Roboto, Poppins } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Airplane go',
  description: 'Created with v0',
  generator: 'Airplane go',
};
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700'],
  variable: '--font-roboto',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} ${poppins.variable}`}>
      {/* <Header /> */}
      <body>

        {children}
      </body>
      {/* <Footer /> */}

    </html>
  );
}
