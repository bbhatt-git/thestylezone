import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Target, Heart, Eye } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About Us | The Style Zone Fashion Boutique',
  description: 'Learn about The Style Zone, your trusted fashion boutique in Mahendranagar, Kanchanpur. Quality clothes, authentic products, and excellent local service since 2020.',
  keywords: ['about us', 'fashion boutique', 'Mahendranagar', 'Kanchanpur', 'clothing store', 'local business', 'authentic products'],
  openGraph: {
    title: 'About Us | The Style Zone Fashion Boutique',
    description: 'Learn about The Style Zone, your trusted fashion boutique in Mahendranagar, Kanchanpur.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
      <Navbar />

      <main className="flex-grow">
        
        {/* Hero Section - Black background like home page categories */}
        <section className="bg-black text-white py-24 px-6 md:px-10">
          <div className="max-w-[1560px] mx-auto">
            <p className="text-xs font-bold tracking-[0.3em] text-[#FE5733] uppercase mb-4">
              THE STYLE ZONE • OUR STORY
            </p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display leading-none mb-6">
              Our Archival <span className="text-[#FE5733]">Story.</span>
            </h1>
            <p className="text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
              The Style Zone is a fashion boutique in Bhimdatta Municipality (Mahendranagar), Kanchanpur, Nepal. We sell clothes, hoodies, jackets, and accessories online and in our physical store.
            </p>
          </div>
        </section>

        {/* Content Section - White background */}
        <section className="bg-white py-24 px-6 md:px-10">
          <div className="max-w-[1560px] mx-auto">
            
            {/* Intro Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-900 relative shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Our boutique warehouse" 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter font-display text-black">
                  Real Inventory, Real Products
                </h3>
                <p className="text-sm text-black/70 leading-relaxed">
                  The Style Zone connects directly to our WooCommerce store system. Every product you see online is actually in stock at our Mahendranagar shop. No fake listings, no placeholder images - just real clothes you can buy and wear.
                </p>
                <p className="text-sm text-black/70 leading-relaxed">
                  We offer hoodies, jackets, t-shirts, and fashion accessories with different sizes and colors. Our inventory updates automatically so you always see what&apos;s available right now.
                </p>
              </div>
            </div>

            {/* Mission Core Values */}
            <div className="border-b-2 border-black pb-16 mb-16">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter font-display text-black mb-16">
                Core <span className="text-[#FE5733]">Values</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4 p-8 bg-[#F9F9F9] rounded-xl">
                  <Target className="w-8 h-8 text-[#FE5733]" />
                  <h4 className="text-lg font-black uppercase tracking-tight font-display text-black">Direct from Source</h4>
                  <p className="text-sm text-black/60 leading-relaxed">
                    We source our products directly to keep prices reasonable and quality high. No middlemen, just good clothes at fair prices.
                  </p>
                </div>

                <div className="space-y-4 p-8 bg-[#F9F9F9] rounded-xl">
                  <Eye className="w-8 h-8 text-[#FE5733]" />
                  <h4 className="text-lg font-black uppercase tracking-tight font-display text-black">Quality Checked</h4>
                  <p className="text-sm text-black/60 leading-relaxed">
                    Every item is checked at our Gali No. 2 shop before it goes online. We make sure sizes are right and clothes are in good condition.
                  </p>
                </div>

                <div className="space-y-4 p-8 bg-[#F9F9F9] rounded-xl">
                  <Heart className="w-8 h-8 text-[#FE5733]" />
                  <h4 className="text-lg font-black uppercase tracking-tight font-display text-black">Local Service</h4>
                  <p className="text-sm text-black/60 leading-relaxed">
                    Visit our shop in Mahendranagar to try clothes before buying. We&apos;re here to help you find the right fit and style.
                  </p>
                </div>
              </div>
            </div>

            {/* Location Focus Info Card */}
            <div className="bg-black text-white p-8 md:p-12 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="max-w-2xl space-y-3">
                <p className="text-xs font-bold text-[#FE5733] uppercase tracking-widest">VISIT OUR SHOP</p>
                <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tighter font-display">Find us in Mahendranagar</h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  Come to our store to see the clothes in person, try different sizes, and get help from our staff. We&apos;re located at Gali No. 2 near Madan Chowk in Bhimdatta Municipality.
                </p>
              </div>
              <Link href="/contact" className="bg-[#FE5733] hover:bg-white hover:text-black text-white px-8 py-4 shrink-0 transition-colors uppercase tracking-widest text-xs font-bold rounded-sm">
                Get Directions
              </Link>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
