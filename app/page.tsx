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
  title: "The Style Zone | Women's Boutique, Mahendranagar",
  description:
    "The Style Zone is Mahendranagar's leading women's clothing boutique, founded by Sanbi Bist. Discover the latest kurtis, kurti sets, cargo jeans, and combo sets. Shop in-store at or get doorstep delivery across Nepal.",
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
    "Kanchanpur women's clothing delivery",
  ],
  openGraph: {
    title: "The Style Zone | Women's Boutique, Mahendranagar",
    description:
      "A youth-led women's boutique in Mahendranagar founded by Sanbi Bist. Trendy kurti sets, combos, and western pieces — from NPR 899. In-store or delivered across Nepal.",
    type: 'website',
  },
};

export default async function HomePage() {
  const db = await readDb();

  const allProducts = db.products || [];
  
  const newArrivals = [...allProducts]
    .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
    .slice(0, 4);

  const featuredProducts = allProducts.filter(p => p.featured).slice(0, 4);
  const bestsellers = featuredProducts.length > 0 ? featuredProducts : allProducts.slice(4, 8);

  return (
    <div className="flex flex-col bg-[#F9F9F9] text-[#000000] font-sans">
      {/* Dark Navbar over Hero */}
      <Navbar />

      <main>
        
        {/* HERO SECTION - Stark Cinematic Layout */}
        <HeroClient />

        {/* Curated Aesthetics - Modern Grid with Wave Divider */}
        <section className="relative py-16 sm:py-24 lg:py-0 lg:pt-30 px-4 sm:px-6 lg:px-10 bg-black text-white overflow-hidden">
          <div className="max-w-[1560px] mx-auto relative z-10">
            
            {/* Header */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter font-display leading-none mb-3 sm:mb-4">
                Curated<br/>
                <span className="text-[#FE5733]">Aesthetics</span>
              </h2>
              <p className="text-white/50 max-w-xl mx-auto text-xs sm:text-sm uppercase tracking-widest font-semibold px-4">
                Discover collections crafted for the modern individual
              </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Large Featured Card */}
              <Link href="/shop?category=clothing" className="group relative aspect-[3/4] sm:aspect-[4/3] lg:aspect-[3/4] lg:row-span-2 lg:col-span-2 overflow-hidden rounded-2xl bg-stone-900 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg" 
                  alt="Denim Collection" 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-115 transition-all duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-10 left-0 p-6 sm:p-8 lg:p-10 w-full">
                  <span className="inline-block px-2 sm:px-3 py-1 bg-[#FE5733] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2 sm:mb-3 rounded-full">Featured</span>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tighter mb-1 sm:mb-2 text-white">Denim Edit</h3>
                  <p className="text-xs sm:text-sm font-medium tracking-wide text-white/70 mb-3 sm:mb-4">Timeless pieces for every wardrobe</p>
                  <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#FE5733] group-hover:gap-4 transition-all">
                    Explore Collection
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </div>
              </Link>
              
              {/* Small Card 1 */}
              <Link href="/shop?category=accessories" className="group relative aspect-square overflow-hidden rounded-2xl bg-stone-900 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg" 
                  alt="Beauty" 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-115 transition-all duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full">
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-1 text-white">Beauty</h3>
                  <p className="text-[10px] sm:text-xs font-bold tracking-widest text-[#FE5733] uppercase">Shop Now</p>
                </div>
              </Link>

              {/* Small Card 2 */}
              <Link href="/shop?category=shoes" className="group relative aspect-square overflow-hidden rounded-2xl bg-stone-900 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg" 
                  alt="Footwear" 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-115 transition-all duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full">
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-1 text-white">Footwear</h3>
                  <p className="text-[10px] sm:text-xs font-bold tracking-widest text-[#FE5733] uppercase">Shop Now</p>
                </div>
              </Link>

              {/* Wide Card */}
              <Link href="/shop?category=sale" className="group relative aspect-[2/1] sm:aspect-[3/2] lg:aspect-[2/1] lg:col-span-2 lg:row-span-2 overflow-hidden rounded-2xl bg-stone-900 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.pexels.com/photos/1898552/pexels-photo-1898552.jpeg" 
                  alt="Clearance" 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-115 transition-all duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 lg:p-8 w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 sm:gap-4">
                  <div>
                    <span className="inline-block px-2 sm:px-3 py-1 bg-white text-black text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 sm:mb-2 rounded-full">Limited Time</span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter text-white">Clearance Sale</h3>
                  </div>
                  <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#FE5733] group-hover:gap-4 transition-all">
                    Up to 50% Off
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
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
