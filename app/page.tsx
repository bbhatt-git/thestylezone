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
        <section className="relative py-32 px-6 md:px-10 bg-black text-white overflow-hidden">
          <div className="max-w-[1560px] mx-auto relative z-10">
            
            {/* Header */}
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-display leading-none mb-4">
                Curated<br/>
                <span className="text-[#FE5733]">Aesthetics</span>
              </h2>
              <p className="text-white/50 max-w-2xl mx-auto text-sm uppercase tracking-widest font-bold">
                Discover collections crafted for the modern individual
              </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Large Featured Card */}
              <Link href="/shop?category=clothing" className="group relative aspect-[3/4] lg:row-span-2 lg:col-span-2 overflow-hidden rounded-2xl bg-stone-900 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg" 
                  alt="Denim Collection" 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-10 w-full">
                  <span className="inline-block px-3 py-1 bg-[#FE5733] text-white text-xs font-bold uppercase tracking-widest mb-3 rounded-full">Featured</span>
                  <h3 className="text-4xl font-black uppercase tracking-tighter mb-2 text-white">Denim Edit</h3>
                  <p className="text-sm font-medium tracking-wide text-white/70 mb-4">Timeless pieces for every wardrobe</p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FE5733] group-hover:gap-4 transition-all">
                    Explore Collection
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </div>
              </Link>
              
              {/* Small Card 1 */}
              <Link href="/shop?category=accessories" className="group relative aspect-square overflow-hidden rounded-2xl bg-stone-900 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg" 
                  alt="Beauty" 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-1 text-white">Beauty</h3>
                  <p className="text-xs font-bold tracking-widest text-[#FE5733] uppercase">Shop Now</p>
                </div>
              </Link>

              {/* Small Card 2 */}
              <Link href="/shop?category=shoes" className="group relative aspect-square overflow-hidden rounded-2xl bg-stone-900 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg" 
                  alt="Footwear" 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-1 text-white">Footwear</h3>
                  <p className="text-xs font-bold tracking-widest text-[#FE5733] uppercase">Shop Now</p>
                </div>
              </Link>

              {/* Wide Card */}
              <Link href="/shop?category=sale" className="group relative aspect-[2/1] lg:col-span-2 overflow-hidden rounded-2xl bg-stone-900 block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.pexels.com/photos/1898552/pexels-photo-1898552.jpeg" 
                  alt="Clearance" 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full flex items-end justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-widest mb-2 rounded-full">Limited Time</span>
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Clearance Sale</h3>
                  </div>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FE5733] group-hover:gap-4 transition-all">
                    Up to 50% Off
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="custom-shape-divider-bottom-1782285797">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
            </svg>
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
