'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/store/wishlistStore';

interface ProductCardProps {
  product: {
    id: number | string;
    name: string;
    slug: string;
    regular_price?: string;
    sale_price?: string | null;
    base_price?: number;
    images: Array<{ src: string }> | string[];
    average_rating?: string;
    rating_avg?: number;
    rating_count?: number;
    stock_quantity?: number;
    stock_total?: number;
    stock_status?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, hasItem } = useWishlist();
  const [isMounted, setIsMounted] = useState(false);
  const isLiked = hasItem(String(product.id));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle both WooCommerce format and local DB format
  const regularPrice = parseFloat(product.regular_price || String(product.base_price || 0));
  const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
  const price = salePrice || regularPrice;
  const originalPrice = salePrice ? regularPrice : null;
  const discountPct = salePrice && regularPrice > 0 ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

  // Handle both image formats
  const imagesArray = Array.isArray(product.images) ? product.images : [];
  const primaryImage = imagesArray[0]?.src || imagesArray[0] || 'https://picsum.photos/seed/placeholder/600/800';
  const secondaryImage = imagesArray[1]?.src || imagesArray[1] || primaryImage;

  // Handle stock status
  const stockStatus = product.stock_status || (product.stock_total === 0 ? 'outofstock' : 'instock');

  return (
    <div className={`group relative flex flex-col h-full bg-transparent transition-all duration-500 ${stockStatus === 'outofstock' ? 'opacity-60 grayscale' : ''}`}>
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden rounded-xl mb-3 md:mb-5">

        {/* Sale and New badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {originalPrice && discountPct > 0 && (
            <span className="bg-white/95 backdrop-blur-sm text-[#121212] text-[10px] font-bold px-3 py-1 uppercase tracking-[0.2em] shadow-sm border border-black/10">
              Sale {discountPct}%
            </span>
          )}
          {stockStatus === 'outofstock' && (
            <span className="bg-black/95 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 uppercase tracking-[0.2em] shadow-sm">
              Sold Out
            </span>
          )}
        </div>

        <Link href={`/shop/${product.slug}`} className="block h-full w-full relative overflow-hidden">
          {/* Primary Image with clean hover zoom */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Floating Wishlist Heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(String(product.id));
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
        <h4 className={`text-lg font-semibold tracking-tight line-clamp-2 mb-2 ${stockStatus === 'outofstock' ? 'text-black/50' : 'text-black/90'}`}>
          <Link href={`/shop/${product.slug}`} className={`transition-colors ${stockStatus === 'outofstock' ? 'hover:text-black/70' : 'hover:text-black'}`}>
            {product.name}
          </Link>
        </h4>

        <div className="mt-auto flex items-baseline gap-3">
          <span className={`text-sm font-black font-semibold tracking-wide ${stockStatus === 'outofstock' ? 'text-black/50' : 'text-black'}`}>Rs {Math.round(price).toLocaleString()}</span>
          {originalPrice && (
            <span className="text-xs text-black/40 line-through">Rs {originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
