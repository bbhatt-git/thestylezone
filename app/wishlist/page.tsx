import React from 'react';
import { readDb } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WishlistClient from './WishlistClient';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const db = await readDb();

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      <Navbar />

      <main className="flex-grow py-12 px-6 md:px-10">
        <div className="max-w-[1560px] mx-auto">
          
          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.3em] text-[#FE5733] uppercase mb-2 font-mono">THE STYLE ZONE • WISHLIST</p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#121212] font-display">
              My <span className="text-[#FE5733]">Favorites.</span>
            </h1>
            <p className="text-sm opacity-60 max-w-xl mt-2 leading-relaxed">
              Curate and lock in your favorite designs. Keep track of limited stocks and seasonal updates in Western Nepal.
            </p>
          </div>

          <WishlistClient allProducts={db.products} />

        </div>
      </main>

      <Footer />
    </div>
  );
}
