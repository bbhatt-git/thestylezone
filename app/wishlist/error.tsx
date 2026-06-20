'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function WishlistError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 relative overflow-hidden bg-[#121212]">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-red-900/20 via-[#121212] to-[#121212]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 bg-white/5 backdrop-blur-xl p-10 md:p-16 rounded-[4px] border border-white/10 shadow-2xl max-w-xl w-full text-center group mx-6">
          <div className="w-20 h-20 bg-black/50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/30 group-hover:scale-110 transition-transform duration-700 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="w-8 h-8 group-hover:animate-pulse" strokeWidth={1.5} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-red-500 mb-4 ">Archive Unavailable</p>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white font-display mb-4">
            Failed to Load <br/> Wishlist
          </h2>
          <p className="text-sm text-stone-400 mb-10 font-sans leading-relaxed max-w-sm mx-auto font-light">
            We couldn't retrieve your saved items. Please attempt to reconnect to synchronize your data.
          </p>
          <button
            onClick={() => reset()}
            className="relative overflow-hidden group/btn w-full h-14 bg-white text-[#121212] rounded-[4px] font-bold uppercase tracking-[0.2em] text-xs transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <RefreshCw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-700" />
              Attempt Reconnect
            </span>
            <div className="absolute inset-0 bg-stone-200 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
