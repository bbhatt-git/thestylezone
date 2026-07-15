import React from 'react';
import { readDb } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShopClient from './ShopClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shop All Collections | The Style Zone',
  description: 'Explore our complete collection of trendy clothes, and fashion accessories. 100% authentic products with COD delivery across Kanchanpur.',
  keywords: [
    "women's clothing Mahendranagar",
    "ladies boutique Kanchanpur Nepal",
    "kurti set Mahendranagar",
    "women's fashion boutique Nepal",
    "kurta shop Kanchanpur",
    "combo sets Nepal boutique",
    "cargo jeans women Nepal",
    "women's clothing store Bhimdattanagar",
    "online women's boutique Nepal delivery",
    "The Style Zone Mahendranagar",
    "Saraswati Bist boutique Nepal",
    `Sanbi Bist boutique Nepal`,
    "Fashion Hub Mahendranagar",
    "ladies wear Far-Western Nepal",
    "Pan-Nepal women's clothing delivery",
    'shop',
    'clothing collection',
    'fashion',
    'jackets',
    't-shirts',
    'accessories',
    'online shopping',
  ],
  openGraph: {
    title: 'Shop All Collections | The Style Zone',
    description: 'Explore our complete collection of trendy clothes, and fashion accessories. 100% authentic products with COD delivery across Kanchanpur.',
    type: 'website',
  },
};

export default async function ShopPage() {
  const db = await readDb();

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9] text-black">
      <Navbar />

      <main className="flex-grow px-6 md:px-10 pt-8 md:pt-24 pb-12 md:pb-24">
        <div className="max-w-[1560px] mx-auto pb-10 mb-10">

          {/* Page Title */}
          <div className="mb-8 md:mb-10">
            <p className="text-sm font-semibold tracking-wide text-black/50 uppercase mb-3">
              Shop the latest drops
            </p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-black font-display leading-tight">
              Discover fresh styles and everyday essentials.
            </h1>
            <p className="text-sm text-stone-600 mt-3 max-w-2xl leading-relaxed">
              Browse the full range of products, filter by category, size, color, or price, and shop with confidence.
            </p>
          </div>

          <ShopClient initialProducts={db.products} />

        </div>
      </main>

      <Footer />
    </div>
  );
}
