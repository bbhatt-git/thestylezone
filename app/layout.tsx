import React from 'react';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ClientAnimationProvider from '@/components/ClientAnimationProvider';
import MobileDock from '@/components/MobileDock';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'The Style Zone • Fashion Boutique in Mahendranagar, Kanchanpur',
  description: 'Shop trendy clothes, hoodies, jackets, and fashion accessories at The Style Zone boutique in Mahendranagar, Kanchanpur. Quality apparel with COD delivery across Nepal.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen bg-[#F5F5F0] text-[#121212]">
        <ClientAnimationProvider>
          {children}
          <MobileDock />
        </ClientAnimationProvider>
      </body>
    </html>
  );
}
