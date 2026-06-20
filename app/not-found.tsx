'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-20 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          {/* Static 404 Text */}
          <div className="relative mb-6">
            <h1 className="text-[120px] md:text-[180px] font-bold text-[#FE5733] leading-none tracking-tighter">
              404
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#121212] uppercase tracking-wider mb-4">
              Page Not Found
            </h2>
            <p className="text-sm md:text-base text-stone-500 max-w-md mx-auto leading-relaxed">
              The page you are looking for seems to have wandered off into the fashion void. Let's get you back to style.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/" 
              className="bg-[#FE5733] hover:bg-white hover:text-[#121212] text-white rounded-sm font-bold h-12 px-8 text-xs tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer border border-transparent hover:border-[#121212]"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="bg-[#121212] hover:bg-white hover:text-[#121212] text-white rounded-sm font-bold h-12 px-8 text-xs tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer border border-[#121212]"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>

          <div className="mt-12">
            <div className="h-px bg-[#121212]/10 w-64 mx-auto" />
          </div>

          <div className="mt-6">
            <p className="text-xs text-stone-400 uppercase tracking-widest">
              Error Code: 404 • Page Missing
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
