'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductError({
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
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="bg-white border border-black/10 p-8 md:p-12 rounded-lg shadow-sm max-w-md w-full space-y-6">
          <div className="w-16 h-16 bg-[#FE5733]/10 text-[#FE5733] rounded-full flex items-center justify-center mx-auto border border-[#FE5733]/20">
            <AlertTriangle className="w-7 h-7" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 mb-2">Oops</p>
            <h2 className="text-2xl font-bold text-black">Product Not Found</h2>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            We couldn't load the details for this product. It may have been removed or there was a network issue.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="w-full h-11 bg-[#FE5733] hover:bg-[#121212] text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="w-full h-11 bg-[#121212] hover:bg-white hover:text-[#121212] text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 border border-[#121212]"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
