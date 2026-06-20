import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OrdersLoading() {
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
        <div className="max-w-[1000px] mx-auto">
          {/* Header Skeleton */}
          <div className="mb-10 text-center">
            <div className="h-4 animate-shimmer bg-stone-100 mb-3" />
            <div className="h-10 md:h-12 animate-shimmer bg-stone-100" />
          </div>

          {/* Orders List Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 md:p-8 rounded-[4px] border border-black/5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-black/5 pb-6">
                  <div className="space-y-2">
                    <div className="h-5 animate-shimmer bg-stone-100" />
                    <div className="h-4 animate-shimmer bg-stone-100" />
                  </div>
                  <div className="h-8 animate-shimmer bg-stone-100" />
                </div>
                <div className="space-y-4">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex gap-4 items-center">
                      <div className="w-16 h-16 animate-shimmer bg-stone-100 shrink-0" />
                      <div className="flex-grow space-y-2">
                        <div className="h-4 animate-shimmer bg-stone-100" />
                        <div className="h-4 animate-shimmer bg-stone-100" />
                      </div>
                      <div className="h-4 animate-shimmer bg-stone-100 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
