'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/store/wishlistStore';
import ProductCard from '@/components/ProductCard';
import { Heart, ArrowLeft, SlidersHorizontal } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  base_price: number;
  sale_price: number | null;
  discount_pct: number;
  images: string[];
  rating_avg: number;
  rating_count: number;
  stock_total: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  description: string;
  categories: string[];
  colors: string[];
  sizes: string[];
}

interface WishlistClientProps {
  allProducts: Product[];
}

export default function WishlistClient({ allProducts }: WishlistClientProps) {
  const { itemIds } = useWishlist();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const wishlistedProducts = allProducts.filter((product) => itemIds.includes(product.id));

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center py-32 w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (wishlistedProducts.length === 0) {
    return (
      <div className="bg-white border border-black/10 rounded-[4px] shadow-xl p-10 max-w-2xl mx-auto text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FE5733]/10 text-[#FE5733]">
          <Heart className="w-10 h-10" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FE5733] mb-3">Wishlist</p>
        <h3 className="text-3xl font-black uppercase tracking-tight text-black mb-3">No favorites saved yet</h3>
        <p className="text-sm text-black/60 max-w-lg mx-auto leading-relaxed">
          Save pieces while you browse and come back here anytime to view all of your favorite looks in one place.
        </p>
        <Link
          href="/shop"
          className="btn btn-primary mt-8 inline-flex items-center justify-center text-xs uppercase tracking-widest px-6 py-3"
        >
          Explore the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-black/10 rounded-[4px] shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#FE5733] font-black mb-2">Wishlist</p>
          <h2 className="text-3xl font-black uppercase tracking-tight text-black">My Favorites</h2>
          <p className="text-sm text-black/60 mt-3 max-w-2xl leading-relaxed">A curated view of the items you have saved. Manage your favorites and continue shopping from here.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-[0.35em] text-black/40">{wishlistedProducts.length} item{wishlistedProducts.length === 1 ? '' : 's'}</span>
          <Link href="/shop" className="btn btn-ghost text-xs uppercase tracking-widest">
            Back to shop
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlistedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
