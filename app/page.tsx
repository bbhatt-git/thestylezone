import React from 'react';
import Link from 'next/link';
import { readDb } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import HeroClient from '@/components/HeroClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The Style Zone • Fashion Boutique in Mahendranagar, Kanchanpur',
  description: 'Shop trendy clothes, hoodies, jackets, and fashion accessories at The Style Zone boutique in Mahendranagar, Kanchanpur. Quality apparel with COD delivery across Nepal.',
  keywords: ['fashion boutique', 'clothing store', 'Mahendranagar', 'Kanchanpur', 'Nepal', 'hoodies', 'jackets', 't-shirts', 'online shopping', 'COD delivery'],
  openGraph: {
    title: 'The Style Zone • Fashion Boutique in Mahendranagar',
    description: 'Shop trendy clothes, hoodies, jackets, and fashion accessories at The Style Zone boutique in Mahendranagar, Kanchanpur.',
    type: 'website',
    locale: 'en_US',
  },
};

export default async function HomePage() {
  const db = await readDb();

  const allProducts = db.products || [];
  
  const newArrivals = [...allProducts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  const featuredProducts = allProducts.filter(p => p.is_featured).slice(0, 4);
  const bestsellers = featuredProducts.length > 0 ? featuredProducts : allProducts.slice(4, 8);

  return (
    <div className="flex flex-col bg-[#F5F5F0] text-[#121212] font-sans">
      <Navbar />

      <main>
        
        {/* HERO SECTION - Two-Column Layout with Carousel */}
        <HeroClient featuredProducts={featuredProducts} />

        {/* Dynamic Products Grid - New Arrivals */}
        <section className="py-12 px-6 md:px-10 bg-white">
          <div className="max-w-[1560px] mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div>
                <p className="text-xs font-bold tracking-[0.3em] text-[#FE5733] uppercase mb-2 font-mono">
                  NEW • ARRIVALS
                </p>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#121212] font-display">
                  Fresh <span className="text-[#FE5733]">Drops.</span>
                </h2>
              </div>
              <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-[#121212] hover:text-[#FE5733] underline underline-offset-4">
                View All
              </Link>
            </div>

            {newArrivals.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-stone-400 text-sm">
                No active products currently synced.
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Products Grid - Bestsellers */}
        <section className="py-12 px-6 md:px-10 bg-[#F5F5F0]">
          <div className="max-w-[1560px] mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div>
                <p className="text-xs font-bold tracking-[0.3em] text-[#FE5733] uppercase mb-2 font-mono">
                  TRENDING • NOW
                </p>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#121212] font-display">
                  Best<span className="text-[#FE5733]">sellers.</span>
                </h2>
              </div>
              <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-[#121212] hover:text-[#FE5733] underline underline-offset-4">
                View All
              </Link>
            </div>

            {bestsellers.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {bestsellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-stone-400 text-sm">
                No bestseller items configured.
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
