'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';
import { Star, Heart, Check, ShoppingCart } from 'lucide-react';
import ProductReviews from '@/components/ProductReviews';
import CartSidebar from '@/components/CartSidebar';
import type { ProductVariation } from '@/lib/db';

interface Product {
  id: number;
  name: string;
  slug: string;
  regular_price: string;
  sale_price?: string;
  images: Array<{ src: string }>;
  average_rating: string;
  rating_count: number;
  stock_quantity?: number;
  stock_status: string;
  description: string;
  short_description: string;
  categories: Array<{ id: number; name: string; slug: string }>;
  attributes: Array<{ name: string; options: string[] }>;
  sku?: string;
}

interface ProductDetailsClientProps {
  product: Product;
  variations?: ProductVariation[];
}

// Basic color mapping for swatch UI
const colorMap: Record<string, string> = {
  'black': '#121212',
  'white': '#ffffff',
  'red': '#ef4444',
  'blue': '#3b82f6',
  'green': '#10b981',
  'yellow': '#f59e0b',
  'gray': '#6b7280',
  'grey': '#6b7280',
  'navy': '#1e3a8a',
  'pink': '#ec4899',
  'purple': '#8b5cf6',
  'orange': '#f97316',
  'teal': '#14b8a6',
  'beige': '#f5f5dc',
  'brown': '#8b4513'
};

export default function ProductDetailsClient({ product, variations = [] }: ProductDetailsClientProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]?.src || 'https://picsum.photos/seed/placeholder/600/800');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [addedMessage, setAddedMessage] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { addItem } = useCart();
  const { toggleWishlist, hasItem } = useWishlist();
  const isLiked = hasItem(String(product.id));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sizeAttr = product.attributes.find(a => a.name.toLowerCase() === 'size');
  const colorAttr = product.attributes.find(a => a.name.toLowerCase() === 'color');
  const requiresSize = sizeAttr?.options && sizeAttr.options.length > 0;
  const requiresColor = colorAttr?.options && colorAttr.options.length > 0;

  // Use selected options if picked, else default to null for the logic
  const matchSize = selectedSize || (requiresSize ? null : 'M');
  const matchColor = selectedColor || (requiresColor ? null : 'Default');

  // Find matching variation only if required options are selected
  let selectedVariation = variations[0] || null; // fallback
  if ((!requiresSize || selectedSize) && (!requiresColor || selectedColor)) {
    selectedVariation = variations.find(
      (v) => {
        const sizeAttr = v.attributes.find(a => a.name.toLowerCase() === 'size');
        const colorAttr = v.attributes.find(a => a.name.toLowerCase() === 'color');
        return (sizeAttr?.option === matchSize || (!sizeAttr && matchSize === 'M')) && 
               (colorAttr?.option === matchColor || (!colorAttr && matchColor === 'Default'));
      }
    ) || variations[0];
  }
  
  // Display stock. If options selected, show variation stock, else show total
  const missingOptions = (requiresSize && !selectedSize) || (requiresColor && !selectedColor);
  const currentStock = missingOptions ? (product.stock_quantity || 10) : (selectedVariation ? (selectedVariation.stock_quantity || 10) : (product.stock_quantity || 10));

  const regularPrice = parseFloat(product.regular_price || '0');
  const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
  const variationPrice = selectedVariation?.price ? parseFloat(selectedVariation.price) : (salePrice || regularPrice);
  const price = variationPrice;
  const originalPrice = salePrice ? regularPrice : null;
  const discountPct = salePrice && regularPrice > 0 ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

  const isDisabled = currentStock <= 0 || missingOptions;
  const buttonText = currentStock <= 0 ? 'Out of Stock' : missingOptions ? 'Select Options' : 'Add to Cart';

  const handleAddToCart = () => {
    if (isDisabled) return;

    addItem({
      productId: product.id,
      variantId: selectedVariation?.id || 0,
      name: product.name,
      imageUrl: product.images[0]?.src || selectedImage,
      size: selectedSize || '',
      color: selectedColor || '',
      quantity: 1,
      unitPrice: price,
      maxStock: currentStock,
    });

    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 3000);
  };

  return (
    <div className="font-sans bg-white">
      
      {addedMessage && (
        <div className="fixed w-55 top-24 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-3 py-3 rounded-[5px] flex items-center gap-3 shadow-lg">
          <span className="text-sm font-medium"> Product Added to cart</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-white/80 hover:text-white text-sm font-semibold underline"
          >
            View
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
        
        {/* Image Section */}
        <div className="relative bg-white">
          {/* Main Image */}
          <div className="h-full relative overflow-hidden">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnail Navigation */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/10 backdrop-blur-sm rounded-full px-3 py-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img.src)}
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                    selectedImage === img.src ? 'border-black scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.src} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(String(product.id))}
            className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <Heart
              className="w-5 h-5"
              fill={isMounted && isLiked ? "#FE5733" : "none"}
              stroke={isMounted && isLiked ? "#FE5733" : "currentColor"}
            />
          </button>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col p-6 lg:p-12 rounded-[4px]">
        

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-black leading-tight mb-4">{product.name}</h1>

          {/* Rating */}
          {product.rating_count > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(parseFloat(product.average_rating || '0')) ? 'fill-amber-500' : 'fill-neutral-200 text-neutral-200'}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-neutral-700">{parseFloat(product.average_rating || '0').toFixed(1)}</span>
              <span className="text-sm text-neutral-500">({product.rating_count} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-bold text-black">Rs {Math.round(price).toLocaleString()}</span>
            {originalPrice && (
              <>
                <span className="text-md text-neutral-400 line-through">Rs {Math.round(originalPrice).toLocaleString()}</span>
                <span className="bg-red-400 text-white text-xs px-1 py-1 rounded-[3px]">
                  - {discountPct}%
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          {currentStock > 0 && currentStock <= 3 && (
            <div className="inline-flex items-center gap-2 text-sm font-medium mb-8 text-orange-600">
              <div className="w-2 h-2 rounded-full bg-orange-600" />
              Limited Stock ({currentStock} left)
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-neutral-200 mb-8" />

          {/* Color Selection */}
          {requiresColor && (
            <div className="mb-8">
              <p className="text-sm font-semibold text-black mb-3">Color: <span className="font-normal text-neutral-600">{selectedColor || 'Select'}</span></p>
              <div className="flex gap-3">
                {colorAttr?.options.map((col) => {
                  const mappedColor = colorMap[col.toLowerCase()] || '#cccccc';
                  return (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      title={col}
                      className={`w-12 h-12 rounded-lg border-2 transition-all relative overflow-hidden ${
                        selectedColor === col ? 'border-black scale-105' : 'border-neutral-300 hover:border-black'
                      }`}
                    >
                      <div className="w-full h-full" style={{ backgroundColor: mappedColor }} />
                      {selectedColor === col && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {requiresSize && (
            <div className="mb-8">
              <p className="text-sm font-semibold text-black mb-3">Size: <span className="font-normal text-neutral-600">{selectedSize || 'Select'}</span></p>
              <div className="flex flex-wrap gap-2">
                {sizeAttr?.options.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-16 h-10 text-sm font-semibold border-2 transition-all rounded ${
                      selectedSize === sz
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-300 hover:border-black text-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}


          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isDisabled}
            className="w-full h-13 bg-orange-700 text-white font-semibold text-lg rounded-lg hover:bg-orange-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            {isDisabled ? (currentStock <= 0 ? 'Out of Stock' : 'Select Options') : 'Add to Cart'}
          </button>

          

          {/* Short Description */}
          {product.short_description && (
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <p className="text-neutral-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: product.short_description }} />
            </div>
          )}


        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
