'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/store/wishlistStore';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    base_price: number;
    sale_price?: number | null;
    discount_pct?: number;
    images: string[];
    rating_avg: number;
    rating_count: number;
    stock_total: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, hasItem } = useWishlist();
  const [isMounted, setIsMounted] = useState(false);
  const isLiked = hasItem(product.id);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const price = product.sale_price !== null && product.sale_price !== undefined ? product.sale_price : product.base_price;
  const originalPrice = product.sale_price !== null && product.sale_price !== undefined ? product.base_price : null;

  return (
    <div className={`group relative flex flex-col h-full bg-transparent transition-all duration-500 ${product.stock_total <= 0 ? 'opacity-60 grayscale' : ''}`}>
      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden mb-5">

        {/* Sale and New badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {originalPrice && product.discount_pct && (
            <span className="bg-white/90 backdrop-blur-sm text-[#121212] text-[10px] font-medium px-3 py-1 uppercase tracking-[0.2em] shadow-sm">
              Sale {product.discount_pct}%
            </span>
          )}
          {product.stock_total <= 0 && (
            <span className="bg-stone-500/90 backdrop-blur-sm text-white text-[10px] font-medium px-3 py-1 uppercase tracking-[0.2em] shadow-sm">
              Sold Out
            </span>
          )}
        </div>

        <Link href={`/shop/${product.slug}`} className="block h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0] || 'https://picsum.photos/seed/placeholder/600/800'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
          />
        </Link>

        {/* Floating Wishlist Heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-md p-3 rounded-full text-[#121212] shadow-sm opacity-100 translate-y-0 transition-all duration-500 ease-out focus:outline-none hover:bg-[#FE5733] hover:text-white hover:scale-110"
          aria-label={isMounted && isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className="w-4 h-4 transition-colors"
            fill={isMounted && isLiked ? "currentColor" : "transparent"}
            strokeWidth="1.5"
          />
        </button>
      </div>

      <div className="flex flex-col flex-grow">
        <h3 className={`text-sm font-medium tracking-tight line-clamp-1 mb-2 ${product.stock_total <= 0 ? 'text-stone-500' : 'text-[#121212]'}`}>
          <Link href={`/shop/${product.slug}`} className={`transition-colors ${product.stock_total <= 0 ? 'hover:text-stone-600' : 'hover:text-[#FE5733]'}`}>
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto flex items-baseline gap-3">
          <span className={`text-sm font-medium tracking-wide ${product.stock_total <= 0 ? 'text-stone-500' : 'text-[#121212]'}`}>Rs {price.toLocaleString()}</span>
          {originalPrice && (
            <span className="text-xs text-stone-400 line-through">Rs {originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
