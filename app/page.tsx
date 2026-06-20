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
  title: 'The Style Zone • Fashion Boutique',
  description: 'Shop trendy clothes, hoodies, jackets, and fashion accessories at The Style Zone boutique.',
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
    <div className="flex flex-col bg-[#F9F9F9] text-[#000000] font-sans">
      {/* Dark Navbar over Hero */}
      <Navbar />

      <main>
        
        {/* HERO SECTION - Stark Cinematic Layout */}
        <HeroClient featuredProducts={featuredProducts} allProducts={allProducts} />

        {/* Categories - Edgy Grid */}
        <section className="py-24 px-6 md:px-10 bg-black text-white">
          <div className="max-w-[1560px] mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display leading-none">
                Curated<br/>
                <span className="text-[#FE5733]">Aesthetics</span>
              </h2>
              <p className="text-white/60 max-w-sm text-sm uppercase tracking-widest font-bold">
                Explore distinct collections built for the modern individual. Quality over quantity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <Link href="/shop?category=clothing" className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-900 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg" alt="Denim" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-2xl font-black uppercase tracking-widest mb-1 text-white">Denim</h3>
                  <p className="text-xs font-bold tracking-widest text-[#FE5733] uppercase">Shop Collection</p>
                </div>
              </Link>
              
              {/* Card 2 */}
              <Link href="/shop?category=accessories" className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-900 block lg:-translate-y-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg" alt="Accessories" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-2xl font-black uppercase tracking-widest mb-1 text-white">Beauty</h3>
                  <p className="text-xs font-bold tracking-widest text-[#FE5733] uppercase">Shop Collection</p>
                </div>
              </Link>

              {/* Card 3 */}
              <Link href="/shop?category=shoes" className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-900 block lg:translate-y-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg" alt="Shoes" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-2xl font-black uppercase tracking-widest mb-1 text-white">Footwear</h3>
                  <p className="text-xs font-bold tracking-widest text-[#FE5733] uppercase">Shop Collection</p>
                </div>
              </Link>

              {/* Card 4 */}
              <Link href="/shop?category=sale" className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-900 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.pexels.com/photos/1898552/pexels-photo-1898552.jpeg" alt="Sale" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-2xl font-black uppercase tracking-widest mb-1 text-white">Clearance</h3>
                  <p className="text-xs font-bold tracking-widest text-[#FE5733] uppercase">Shop Collection</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Bestsellers Section - Clean Minimalist */}
        <section className="py-24 px-6 md:px-10 bg-[#F9F9F9]">
          <div className="max-w-[1560px] mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b-2 border-black pb-2">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter font-display text-black">
                Featured Pieces
              </h2>
              <Link 
                href="/shop"
                className="mt-6 md:mt-0 text-sm font-bold uppercase tracking-widest text-black hover:text-[#FE5733] transition-colors inline-flex items-center gap-2"
              >
                View all items
              </Link>
            </div>

            {bestsellers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
                {bestsellers.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-xl border border-black/5 shadow-sm">
                <p className="text-black/50 font-bold uppercase tracking-widest text-sm">No products found</p>
              </div>
            )}
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-24 px-6 md:px-10 bg-white border-t border-black/5">
          <div className="max-w-[1560px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b-2 border-black pb-2">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter font-display text-black">
                New Arrivals
              </h2>
              <Link 
                href="/shop?sort=newest"
                className="mt-6 md:mt-0 text-sm font-bold uppercase tracking-widest text-black hover:text-[#FE5733] transition-colors inline-flex items-center gap-2"
              >
                Shop latest
              </Link>
            </div>

            {newArrivals.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-gray-50 rounded-xl border border-black/5 shadow-sm">
                <p className="text-black/50 font-bold uppercase tracking-widest text-sm">No new arrivals</p>
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
