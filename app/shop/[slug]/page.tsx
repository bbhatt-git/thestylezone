import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readDb } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductDetailsClient from './ProductDetailsClient';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const db = await readDb();
  const product = db.products.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    return notFound();
  }

  // Find related products
  const relatedProducts = db.products
    .filter((p) => p.id !== product.id && p.categories.some((cat) => product.categories.includes(cat)))
    .slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      <Navbar />

      {/* Main Container */}
      <main className="flex-grow py-8 px-6 md:px-10">
        <div className="max-w-[1560px] mx-auto">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-10 text-xs font-mono font-bold text-[#121212]/40 uppercase">
            <Link href="/" className="hover:text-[#FE5733] transition-colors">THE STYLE ZONE</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-[#FE5733] transition-colors">SHOP ALL</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#121212]/80 max-w-[200px] truncate">{product.name}</span>
          </div>

          {/* Dynamic Details Interactive Section */}
          <ProductDetailsClient product={product} />

          {/* Related Products Grid */}
          {relatedProducts.length > 0 && (
            <div className="mt-32 border-t border-[#121212]/10 pt-16">
              <p className="text-xs font-bold tracking-[0.25em] text-[#FE5733] uppercase mb-3 font-mono">
                CURATED FOR YOU
              </p>
              <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-[#121212] font-display mb-10">
                Related <span className="text-[#FE5733]">Creations.</span>
              </h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
