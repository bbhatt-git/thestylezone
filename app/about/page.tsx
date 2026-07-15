import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';
import { ArrowUpRight, Facebook } from 'lucide-react';

// TikTok Icon SVG
const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-2.51V7.843a6.3 6.3 0 0 0-5.396 3.642 6.298 6.298 0 0 0 3.148 8.18 6.3 6.3 0 0 0 9.61-5.37v-6.03a8.3 8.3 0 0 0 4.77 1.512V6.89a4.775 4.775 0 0 1-1.9-.204z"/>
  </svg>
);

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "About | The Style Zone",
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
    "Pan-Nepal women's clothing delivery",
  ],
  openGraph: {
    title: "About | The Style Zone",
    description:
      "A youth-led women's boutique in Mahendranagar founded by Sanbi Bist. Trendy kurti sets, combos, and western pieces — from NPR 899. In-store or delivered across Nepal.",
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      {}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .font-sans {
          font-family: 'Inter', system-ui, sans-serif;
        }
      `}</style>

      <div className="flex flex-col min-h-screen bg-[#FCFAF6] font-sans antialiased text-stone-900">
        <Navbar />

        <main className="flex-grow">
          
          {}
          <section className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Side Campaign Vignette (Unique Editorial touch) */}
              <div className="hidden lg:block lg:col-span-3">
                <div className="aspect-[3/4] w-full bg-stone-100 rounded-[5px] overflow-hidden border border-stone-200/50">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600"
                    alt="Minimalist curation"
                    className="w-full h-full object-cover hover:scale-[1.05] transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Center Column: Direct & Refined E-commerce Header */}
              <div className="lg:col-span-6 space-y-8 text-center lg:px-8">
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-stone-100 border border-stone-200/40 rounded-[5px]">
                  <span className="text-[12px] font-bold tracking-[0.2em] text-[#FE5733] uppercase">
                 Our Story
                  </span>
                </div>

                <h1 className="font-serif text-5xl md:text-6xl xl:text-7xl leading-[1.05] text-stone-900 font-light tracking-tight">
                  Dressed for her, <br />
                  <span className="italic text-stone-500 font-normal">made for here.</span>
                </h1>

                <p className="text-base text-stone-600 leading-relaxed font-light max-w-md mx-auto">
                  The Style Zone is Mahendranagar&apos;s premier ladies&apos; wear destination. We bring viral modern aesthetics straight to Kanchanpur, back-checked in-house for absolute quality.
                </p>

                <div className="flex justify-center items-center gap-4 pt-4">
                  <Link 
                    href="/shop" 
                    className="inline-flex justify-center items-center px-4 py-3.5 bg-[#FE5733] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#e04a29] transition-all rounded-[5px] shadow-sm"
                  >
                    Shop Collection
                  </Link>
                  <Link 
                    href="/contact" 
                    className="inline-flex justify-center items-center px-4 py-3.5 bg-white border border-stone-200 text-stone-800 text-xs font-semibold tracking-widest uppercase hover:bg-stone-50 transition-all rounded-[5px]"
                  >
                    Visit Store
                  </Link>
                </div>
              </div>

              {/* Right Column: Interactive Flagship Preview */}
              <div className="col-span-1 lg:col-span-3">
                <div className="aspect-[3/4] w-full bg-stone-100 rounded-[5px] overflow-hidden border border-stone-200/50 shadow-sm">
                  <img
                    src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="The Style Zone Kurti Collection"
                    className="w-full h-full object-cover hover:scale-[1.05] transition-transform duration-700"
                  />
                </div>
              </div>

            </div>
          </section>

          {/* Minimal Horizontal Rule divider */}
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="border-t border-stone-200/60" />
          </div>

          {}

          <div className="lg:col-span-6 space-y-8 text-center lg:px-8 pt-10">
                <span className="text-sm font-bold tracking-[0.2em] text-[#FE5733] uppercase block">
                  The Narrative
                </span>
                </div>
          {/* ── NARRATIVE SECTION (PRESERVED EXACTLY AS YOU LIKED) ── */}
          <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-15">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
              
              {/* Left Column of Narrative: Large Quote & Founder Details */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-12">
                
                <h2 className="font-serif text-3xl md:text-4xl leading-tight text-stone-900 font-light">
                  Bridging the gap between online trends and physical trust.
                </h2>
                
                <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-600 italic">
                  &ldquo;If you want the latest trends without leaving Mahendranagar, this was built for you.&rdquo; 
                </p>
                
                <div className="flex items-center gap-4 pt-4">
                  <img
                    src="/sanbi_bist.jpg"
                    alt="Sanbi Bist, Founder of The Style Zone"
                    className="w-12 h-12 rounded-full object-cover border border-stone-200/50"
                  />
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Sanbi Bist</p>
                    <p className="text-xs text-stone-500">Founder</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                {[
                  { icon: <Facebook size={18} />, label: 'Facebook', href: 'https://www.facebook.com/sanbi.bist.2025' },
                  { icon: <TikTokIcon />, label: 'TikTok', href: 'https://www.tiktok.com/@sanbibista/video' },
                ].map((item, idx) => (
                  <a 
                    key={idx} 
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="w-8 h-8 rounded-[8px] bg-neutral/50 border border-stone-400 flex items-center justify-center text-stone-400 hover:text-[#FE5733] hover:border-transparent hover:bg-zinc-800 transition-all duration-300 relative group"
                  >
                    <div className="absolute inset-0 rounded-[8px] scale-0 group-hover:scale-100 bg-[#FE5733]/10 transition-all duration-300 z-0"></div>
                    <span className="relative z-10 transition-colors duration-300">
                      {item.icon}
                    </span>
                  </a>
                ))}
              </div>
                </div>
              </div>

              {/* Right Column of Narrative: Clean Paragraphs & Dual Image Grid */}
              <div className="lg:col-span-7 space-y-6 text-stone-600 leading-relaxed font-light text-base md:text-[17px]">
                <p>
                  Founded by an MBA student who recognized a clear gap in the regional market, The Style Zone is far more than just a shop. It serves as a modern community hub where women in Far-Western Nepal can express themselves through carefully selected, high-quality garments.
                </p>
                <p>
                  Our collection catalog spans from beautiful, traditional-contemporary kurti sets to highly versatile cargo denims and structural seasonal coordinates. You are always welcome to explore our new collections online or drop by in person to discover your next favorite piece.
                </p>

                {/* Local Lookbook Images with strict 5px rounding constraint */}
                <div className="grid grid-cols-2 gap-4 pt-8">
                  <div className="aspect-square bg-stone-100 rounded-[5px] overflow-hidden border border-stone-200/50">
                    <img 
                      src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600" 
                      alt="Premium Kurti textures" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="aspect-square bg-stone-100 rounded-[5px] overflow-hidden border border-stone-200/50">
                    <img 
                      src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600" 
                      alt="Boutique fitting curation" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                </div>
              </div>

            </div>
          </section>

          {}
          {/* ── HOW WE WORK SECTION (REDESIGNED) ── */}
          
      <section className="bg-white border-y border-stone-200/40 py-10 md:py-20">

      <div className="lg:col-span-6 space-y-8 text-center lg:px-8 pb-10">
                <span className="text-sm font-bold tracking-[0.2em] text-[#FE5733] uppercase block">
                 Our Standards
                </span>
                </div>
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">

                
                {/* Left Side: Elegant contextual intro block with a focus image */}
                <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-12">
                  
                  <h3 className="font-serif text-3xl md:text-4xl leading-tight font-light text-stone-900">
                    A rigorous, hand-vetted approach to retail.
                  </h3>
                  <p className="text-base text-stone-600 leading-relaxed font-light">
                    We reject standard dropshipping models. Every item on our hangers passes a physical vetting process in our Mahendranagar flagship boutique before it reaches you.
                  </p>
                  
                  {/* Complementary landscape image with exact 5px rounding constraint */}
                  <div className="aspect-[1.5] w-full bg-stone-50 rounded-[5px] overflow-hidden border border-stone-200/50">
                    <img 
                      src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800" 
                      alt="Quality inspection and curation" 
                      className="w-full h-full object-cover filter contrast-[1.02]"
                    />
                  </div>
                </div>

                {/* Right Side: Clean vertical timeline with custom serif indexes */}
                <div className="lg:col-span-7 space-y-12">
                  
                  {/* Step 1 */}
                  <div className="space-y-4 pb-8 border-b border-stone-200/60">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-xl text-[#FE5733]">01</span>
                      <h3 className="text-lg font-semibold text-stone-900 tracking-tight">Physical In-House Inspection</h3>
                    </div>
                    <p className="text-base text-stone-600 leading-relaxed font-light pl-8">
                      Every garment in our catalog is physically located and checked at our store. We verify fabrics, sizing consistency, and alignments personally so there are no surprises when you open your box.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-4 pb-8 border-b border-stone-200/60">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-xl text-[#FE5733]">02</span>
                      <h3 className="text-lg font-semibold text-stone-900 tracking-tight">Dynamic Trend Sourcing</h3>
                    </div>
                    <p className="text-base text-stone-600 leading-relaxed font-light pl-8">
                      We ignore outdated wholesalers. Our catalog keeps direct pace with real-time fashion movements. Whether it&apos;s coordinate sets or utility denim, we stock it immediately to keep you ahead of the trend line.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-xl text-[#FE5733]">03</span>
                      <h3 className="text-lg font-semibold text-stone-900 tracking-tight">Seamless Doorstep Logistics</h3>
                    </div>
                    <p className="text-base text-stone-600 leading-relaxed font-light pl-8">
                      Though our flagship base is deeply connected to Mahendrangar, we provide delivery all over Nepal and International shippings too. Experience safe, streamlined boutique checkouts with rapid delivery straight to your doorstep.
                    </p>
                  </div>

                </div>

              </div>
            </div>
          </section>

          {}
          {/* ── LAST CTA SECTION (REDESIGNED) ── */}
          <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Atmospheric Lookbook Image */}
              <div className="lg:col-span-5 h-[350px] lg:h-auto min-h-[300px]">
                <div className="w-full h-full rounded-[5px] overflow-hidden border border-stone-200/50 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a6?auto=format&fit=crop&q=80&w=800"
                    alt="Boutique fitting curation"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column: Editorial Invitation & Directory Block */}
              <div className="lg:col-span-7 bg-[#F6F5F0] border border-stone-200/60 p-8 md:p-12 rounded-[5px] flex flex-col justify-between">
                <div>
                  <span className="text-[12px] font-bold tracking-[0.25em] text-[#FE5733] uppercase block mb-3">
                    VISIT Our Store
                  </span>
                  
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-stone-900 leading-tight mb-6">
                    Step inside our physical boutique in <span className="italic text-stone-600">Mahendranagar.</span>
                  </h2>
                  
                  <p className="text-stone-600 font-light text-sm max-w-xl leading-relaxed mb-8">
                    Explore fabrics firsthand, try on sets in a comfortable fitting environment, and find your absolute Best-fit garment with helpful advice in our flagship location.
                  </p>
                </div>

                {/* Highly Clean, Structured Directory list */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-stone-200/80 mb-8">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#FE5733] mb-1">Our Location</h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">
                      Street No. 2, Mahendranagar<br />
                      Kanchanpur, Nepal
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#FE5733] mb-1">Opening Hours</h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">
                      Sun - Fri: 10AM - 7PM<br />
                      Saturdays: Closed
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#FE5733] mb-1">Our Contact</h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">
                      info@thestylezone.com.np<br />
                      +977 9865900094
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link 
                    href="/contact" 
                    className="inline-flex justify-center items-center px-8 py-3.5 bg-[#FE5733] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#e04a29] transition-colors rounded-[5px]"
                  >
                    Get Directions
                  </Link>
                  <Link 
                    href="/shop" 
                    className="inline-flex justify-center items-center px-8 py-3.5 bg-transparent border border-stone-300 text-stone-800 text-xs font-semibold tracking-widest uppercase hover:bg-stone-50 transition-colors rounded-[5px]"
                  >
                    Browse Collections
                  </Link>
                </div>
              </div>

            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
}