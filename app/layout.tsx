import type { Metadata } from 'next';
import { Quicksand, Orbitron } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/Providers';
import React from 'react';

const quicksand = Quicksand({ 
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Suni Blog',
  description: 'A glassmorphic personal dashboard featuring a physics-based interactive water drop effect.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${orbitron.variable} font-quicksand antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}