/* eslint-disable @next/next/no-img-element */
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

        {/* Bento Grid Categories */}
        <section className="py-8 md:py-12 px-6 md:px-10 bg-[#F5F5F0]">
          <div className="max-w-[1560px] mx-auto">
            <div className="mb-8 md:mb-10">
              <p className="text-xs font-bold tracking-[0.3em] text-[#FE5733] uppercase mb-2 font-mono">
                EXPLORE • COLLECTIONS
              </p>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-[#121212] font-display">
                Shop by <span className="text-[#FE5733]">Category.</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Large Card - Hoodies - Liquid Morph Effect */}
              <Link href="/shop?category=hoodies" className="group relative col-span-2 row-span-2 bg-[#121212] rounded-[4px] overflow-hidden aspect-square md:aspect-auto min-h-[300px]">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg" 
                    alt="Hoodies" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#121212]/50 transition-all duration-700 group-hover:bg-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0 h-full bg-gradient-to-r from-[#FE5733] via-[#ff6b4a] to-[#FE5733] transition-all duration-700 group-hover:w-full opacity-80" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }} />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 relative z-10">
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white font-display mb-2 group-hover:text-[#121212] group-hover:scale-110 transition-all duration-700 origin-left">
                    Hoodies
                  </h3>
                  <p className="text-xs text-white/70 group-hover:text-[#121212]/80 transition-colors duration-700">
                    Premium comfort & style
                  </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FE5733] to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FE5733] to-transparent transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
              </Link>

              {/* Small Card - Jackets - Shatter Glass Effect */}
              <Link href="/shop?category=jackets" className="group relative bg-white border border-[#121212]/5 rounded-[4px] overflow-hidden aspect-square">
                <div className="absolute inset-0">
                  <img 
                    src="https://wrogn.com/cdn/shop/files/WVJK9901S.webp" 
                    alt="Jackets" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute inset-0 bg-[#121212]/0 group-hover:bg-[#121212]/70 transition-all duration-700" />
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center relative z-10">
                  <div className="absolute inset-0 bg-[#FE5733] transition-all duration-700" style={{
                    clipPath: 'polygon(0 100%, 25% 100%, 50% 100%, 75% 100%, 100% 100%, 100% 100%, 75% 100%, 50% 100%, 25% 100%, 0 100%)'
                  }} />
                  <div className="absolute inset-0 bg-[#FE5733] transition-all duration-700 opacity-0 group-hover:opacity-90 delay-100" style={{
                    clipPath: 'polygon(0 0, 25% 0, 50% 0, 75% 0, 100% 0, 100% 25%, 100% 50%, 100% 75%, 100% 100%, 0 100%)'
                  }} />
                  <h3 className="text-lg font-black uppercase tracking-tighter text-white font-display mb-1 group-hover:tracking-widest transition-all duration-700">
                    Jackets
                  </h3>
                  <p className="text-[10px] text-white/80 uppercase tracking-wider group-hover:opacity-0 transition-opacity duration-300">
                    Outerwear
                  </p>
                  <p className="text-[10px] text-white/80 uppercase tracking-wider absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                    Explore Now
                  </p>
                </div>
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FE5733] transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700 delay-150" />
                <div className="absolute top-0 right-0 w-1 h-full bg-[#FE5733] transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 delay-200" />
              </Link>

              {/* Small Card - T-Shirts - Neon Pulse Effect */}
              <Link href="/shop?category=tshirts" className="group relative bg-white border border-[#121212]/5 rounded-[4px] overflow-hidden aspect-square">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg" 
                    alt="T-Shirts" 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:grayscale group-hover:brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute inset-0 bg-[#FE5733]/0 group-hover:bg-[#FE5733]/20 transition-all duration-700" />
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center relative z-10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-[#FE5733] opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 group-hover:animate-ping" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tighter text-white font-display mb-1 group-hover:text-[#FE5733] group-hover:scale-125 transition-all duration-700 drop-shadow-lg">
                    T-Shirts
                  </h3>
                  <p className="text-[10px] text-white/80 uppercase tracking-wider group-hover:text-white transition-colors duration-700">
                    Essentials
                  </p>
                </div>
                <div className="absolute inset-0 border-4 border-[#FE5733] rounded-[4px] opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
              </Link>

              {/* Wide Card - Accessories - Holographic Shimmer */}
              <Link href="/shop?category=accessories" className="group relative col-span-2 bg-[#FE5733] rounded-[4px] overflow-hidden aspect-[2/1]">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg" 
                    alt="Accessories" 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/0 via-[#121212]/60 to-[#121212]/0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-cyan-500/0 group-hover:from-purple-500/30 group-hover:via-pink-500/30 group-hover:to-cyan-500/30 transition-all duration-700" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                <div className="absolute inset-0 bg-[#121212]/0 group-hover:bg-[#121212]/70 transition-all duration-700" />
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center relative z-10">
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white font-display mb-2 group-hover:tracking-[0.3em] transition-all duration-700 drop-shadow-2xl">
                    Accessories
                  </h3>
                  <p className="text-xs text-white/90 group-hover:scale-110 transition-transform duration-700">
                    Complete your look
                  </p>
                </div>
                <div className="absolute inset-0 border-2 border-white/30 rounded-[4px] opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-1000" />
              </Link>

              {/* Small Card - Pants - Morphing Shape */}
              <Link href="/shop?category=pants" className="group relative bg-white border border-[#121212]/5 rounded-[4px] overflow-hidden aspect-square">
                <div className="absolute inset-0">
                  <img 
                    src="https://img.drz.lazcdn.com/g/kf/S09531645be88472e9f073d701f31f29dx.jpg_720x720q80.jpg" 
                    alt="Pants" 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute inset-0 bg-[#121212]/0 group-hover:bg-[#121212]/60 transition-all duration-700" style={{
                  clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                }} />
                <div className="absolute inset-0 bg-[#FE5733]/0 group-hover:bg-[#FE5733]/80 transition-all duration-700 delay-100" style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                }} />
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center relative z-10">
                  <h3 className="text-lg font-black uppercase tracking-tighter text-white font-display mb-1 group-hover:rotate-12 transition-transform duration-700 group-hover:scale-110">
                    Pants
                  </h3>
                  <p className="text-[10px] text-white/80 uppercase tracking-wider group-hover:tracking-widest transition-all duration-700">
                    Bottoms
                  </p>
                </div>
                <div className="absolute inset-0 border-4 border-dashed border-[#FE5733] rounded-[4px] opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-700 scale-75" />
              </Link>

              {/* Small Card - Sale - Cyberpunk RGB Split */}
              <Link href="/shop?category=sale" className="group relative bg-[#121212] border border-[#121212]/5 rounded-[4px] overflow-hidden aspect-square">
                <div className="absolute inset-0">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTubPL2SRhpTr4mwoMwxRIyeZQnj3Gn-bZWyQ&s" 
                    alt="Sale" 
                    className="w-full h-full object-cover transition-all duration-100 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#FE5733]/90 to-[#ff6b4a]/90 transition-all duration-100 group-hover:from-[#FE5733]/70 group-hover:to-[#ff6b4a]/70" />
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center relative z-10">
                  <h3 className="text-lg font-black uppercase tracking-tighter text-white font-display mb-1 group-hover:animate-bounce transition-all duration-100">
                    Sale
                  </h3>
                  <p className="text-[10px] text-white/80 uppercase tracking-wider group-hover:text-yellow-300 transition-colors duration-100">
                    Limited time
                  </p>
                </div>
                <div className="absolute inset-0 bg-red-500/30 mix-blend-screen translate-x-0 group-hover:translate-x-2 transition-transform duration-75 group-hover:duration-75" />
                <div className="absolute inset-0 bg-cyan-500/30 mix-blend-screen translate-x-0 group-hover:-translate-x-2 transition-transform duration-75 group-hover:duration-75 delay-25" />
                <div className="absolute inset-0 bg-white/10 translate-y-0 group-hover:translate-y-2 transition-transform duration-75 group-hover:duration-75 delay-50" />
                <div className="absolute inset-0 border-4 border-red-500 rounded-[4px] opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-100" />
              </Link>

              {/* Small Card - Shoes - Floating Parallax */}
              <Link href="/shop?category=shoes" className="group relative bg-white border border-[#121212]/5 rounded-[4px] overflow-hidden aspect-square">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg" 
                    alt="Shoes" 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:-translate-y-4"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute inset-0 flex flex-col justify-end items-center p-6 text-center relative z-10">
                  <h3 className="text-lg font-black uppercase tracking-tighter text-white font-display mb-1 group-hover:translate-y-[-20px] transition-transform duration-700 delay-100 drop-shadow-2xl">
                    Shoes
                  </h3>
                  <p className="text-[10px] text-white/80 uppercase tracking-wider opacity-0 group-hover:opacity-100 group-hover:translate-y-[-20px] transition-all duration-700 delay-200">
                    Footwear
                  </p>
                </div>
                <div className="absolute inset-0 border-4 border-[#FE5733] rounded-[4px] opacity-0 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 delay-300" />
                <div className="absolute top-4 right-4 w-8 h-8 bg-[#FE5733] rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 delay-400 flex items-center justify-center">
                  <span className="text-white text-xs font-black">NEW</span>
                </div>
              </Link>

              {/* Small Card - New - Spotlight Reveal */}
              <Link href="/shop?category=new" className="group relative bg-[#F5F5F0] border border-[#121212]/5 rounded-[4px] overflow-hidden aspect-square">
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg" 
                    alt="New" 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-110 group-hover:contrast-125"
                  />
                </div>
                <div className="absolute inset-0 bg-[#F5F5F0]/80 transition-all duration-700 group-hover:bg-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FE5733] via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-all duration-700" style={{
                    clipPath: 'circle(0% at 50% 50%)'
                  }} />
                  <style>{`.group-hover\:clip-circle-expand { clipPath: circle(150% at 50% 50%); }`}</style>
                  <h3 className="text-lg font-black uppercase tracking-tighter text-[#121212] font-display mb-1 group-hover:text-white group-hover:scale-125 transition-all duration-700 drop-shadow-lg relative z-20">
                    New
                  </h3>
                  <p className="text-[10px] text-[#121212]/60 group-hover:text-white/90 transition-colors duration-700 uppercase tracking-wider relative z-20">
                    Latest drops
                  </p>
                </div>
                <div className="absolute inset-0 bg-[#FE5733]/0 group-hover:bg-[#FE5733]/40 transition-all duration-700" style={{
                  clipPath: 'circle(0% at 50% 50%)'
                }} />
                <style>{`.group-hover\:clip-circle-expand-2 { clipPath: circle(150% at 50% 50%); }`}</style>
                <div className="absolute top-2 left-2 w-2 h-2 bg-[#FE5733] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-700" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-[#FE5733] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-700 delay-100" />
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#FE5733] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-700 delay-200" />
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#FE5733] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-700 delay-300" />
              </Link>
            </div>
          </div>
        </section>

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
