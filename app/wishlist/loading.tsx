import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function WishlistLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      <Navbar />
      <style>{`
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        .animate-shimmer {
          background-image: linear-gradient(90deg, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.03) 75%);
          background-size: 400% 100%;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
      <main className="flex-grow py-12 px-6 md:px-10">
        <div className="max-w-[1560px] mx-auto">
          {/* Header Skeleton */}
          <div className="mb-10 flex items-center gap-4">
            <div className="w-12 h-12 animate-shimmer bg-stone-100" />
            <div className="h-10 md:h-12 animate-shimmer bg-stone-100" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col">
                <div className="aspect-[3/4] animate-shimmer bg-stone-100 mb-4"></div>
                <div className="h-4 animate-shimmer bg-stone-100 mb-2"></div>
                <div className="h-4 animate-shimmer bg-stone-100"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
