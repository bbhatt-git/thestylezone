"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Search, Tag, TrendingUp } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  base_price: number;
  sale_price: number | null;
  images: string[];
  rating_avg: number;
  rating_count: number;
  stock_total: number;
  categories: string[];
}

const trendingSearches = ['Hoodies', 'Jackets', 'T-Shirts', 'Accessories', 'Winter Layers'];

export default function SearchPageClient({ allProducts }: { allProducts: Product[] }) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) return allProducts.slice(0, 12);
    return allProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.slug.toLowerCase().includes(normalizedQuery) ||
        product.brand.toLowerCase().includes(normalizedQuery) ||
        product.categories.some((category) => category.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [allProducts, normalizedQuery]);

  const categories = useMemo(
    () => Array.from(new Set(allProducts.flatMap((product) => product.categories))).slice(0, 6),
    [allProducts]
  );

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black">
      <Navbar />
      <div className="max-w-[1560px] mx-auto px-6 md:px-10 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center mb-14">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#FE5733] mb-4">SEARCH THE COLLECTION</p>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-6">Find the perfect look with fast product search.</h1>
          <p className="mx-auto max-w-2xl text-sm md:text-base text-stone-600 leading-7">Search everything from hoodies and jackets to everyday staples. Our results update instantly so you can shop with confidence.</p>
        </div>

        <div className="relative max-w-3xl mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for hoodies, jackets, tees, accessories..."
            className="w-full rounded-full border border-black/10 bg-white px-14 py-4 text-black text-sm shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-[#FE5733]/20 transition-all"
          />
        </div>

        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-8">
            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <TrendingUp className="w-5 h-5 text-[#FE5733]" />
                <h2 className="text-xs font-black uppercase tracking-[0.35em] text-black/60">Trending searches</h2>
              </div>
              <div className="grid gap-3">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="text-sm font-semibold text-black bg-stone-100 hover:bg-[#FE5733] hover:text-white rounded-full px-4 py-3 text-left transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <Tag className="w-5 h-5 text-[#FE5733]" />
                <h2 className="text-xs font-black uppercase tracking-[0.35em] text-black/60">Popular categories</h2>
              </div>
              <div className="grid gap-3">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/shop?category=${category.toLowerCase()}`}
                    className="flex items-center justify-between rounded-full border border-black/10 px-4 py-3 text-sm font-semibold text-black hover:bg-black hover:text-white transition-all"
                  >
                    <span>{category}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <section className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.35em] text-black/50">
                  {query ? `${filteredProducts.length} results` : 'Featured products'}
                </p>
                <h2 className="mt-4 text-2xl md:text-3xl font-black tracking-tight text-black">
                  {query ? `Results for “${query}”` : 'Browse our latest arrivals'}
                </h2>
              </div>
              {query && (
                <button type="button" onClick={() => setQuery('')} className="btn btn-ghost text-xs uppercase tracking-widest">
                  Clear search
                </button>
              )}
            </div>

            {normalizedQuery && filteredProducts.length === 0 ? (
              <div className="rounded-[2rem] border border-black/10 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-bold text-black mb-3">No matches found.</p>
                <p className="text-sm text-stone-600 mb-6">Try a broader keyword or browse one of the popular categories.</p>
                <button type="button" onClick={() => setQuery('')} className="btn btn-primary">
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
