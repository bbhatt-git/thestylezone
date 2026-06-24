'use client';

import React, { useState, useEffect } from 'react';
import { useCart, CartItem } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';
import { Heart, Plus, Minus, ShoppingCart, Share2, Check } from 'lucide-react';

interface Variation {
  id: number;
  product_id: number;
  attributes: Array<{ id: number; name: string; option: string }>;
  price: string;
  regular_price: string;
  sale_price?: string;
  stock_quantity?: number;
  stock_status: string;
  sku?: string;
}

interface ProductActionPanelProps {
  product: {
    id: number;
    name: string;
    regular_price: string;
    sale_price?: string;
    images: Array<{ src: string }>;
    stock_quantity?: number;
    stock_status: string;
  };
  variations: Variation[];
}

export default function ProductActionPanel({ product, variations }: ProductActionPanelProps) {
  const addItem = useCart(state => state.addItem);
  const { toggleWishlist, hasItem } = useWishlist();
  const isLiked = hasItem(String(product.id));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Group unique colors from variations
  const uniqueColorsMap: { [key: string]: string } = {};
  variations.forEach(v => {
    const colorAttr = v.attributes.find(a => a.name.toLowerCase() === 'color');
    if (colorAttr?.option) uniqueColorsMap[colorAttr.option] = colorAttr.option.toLowerCase(); // Use color name as hex fallback
  });
  const uniqueColors = Object.entries(uniqueColorsMap).map(([name, hex]) => ({ name, hex }));
  
  // States
  const [selectedColor, setSelectedColor] = useState(uniqueColors[0]?.name || 'Default');
  const [selectedSize, setSelectedSize] = useState('M'); // default size
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Sync size selection if the new color doesn't have stock or exists
  useEffect(() => {
    // Check if the current size is available for the newly selected color
    const sizesForColor = variations.filter(v => {
      const colorAttr = v.attributes.find(a => a.name.toLowerCase() === 'color');
      return colorAttr?.option === selectedColor;
    });
    const matchingVariant = sizesForColor.find(v => {
      const sizeAttr = v.attributes.find(a => a.name.toLowerCase() === 'size');
      return sizeAttr?.option === selectedSize;
    });
    
    // Auto-select first available size if current one is not valid
    if (!matchingVariant || (matchingVariant.stock_quantity !== undefined && matchingVariant.stock_quantity <= 0)) {
      const firstInStock = sizesForColor.find(v => (v.stock_quantity || 0) > 0);
      if (firstInStock) {
        const sizeAttr = firstInStock.attributes.find(a => a.name.toLowerCase() === 'size');
        if (sizeAttr?.option) queueMicrotask(() => setSelectedSize(sizeAttr.option));
      } else if (sizesForColor.length > 0) {
        const sizeAttr = sizesForColor[0].attributes.find(a => a.name.toLowerCase() === 'size');
        if (sizeAttr?.option) queueMicrotask(() => setSelectedSize(sizeAttr.option));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor, variations]);

  // Find active variation corresponding to size + color selection
  const activeVariation = variations.find(v => {
    const sizeAttr = v.attributes.find(a => a.name.toLowerCase() === 'size');
    const colorAttr = v.attributes.find(a => a.name.toLowerCase() === 'color');
    return sizeAttr?.option === selectedSize && colorAttr?.option === selectedColor;
  }) || variations[0];
  
  // Fallback if no variations exist
  if (!activeVariation) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <p className="text-sm font-bold">Product variants not available</p>
        <p className="text-xs mt-1">This product cannot be added to cart right now. Please contact support.</p>
      </div>
    );
  }
  
  const regularPrice = parseFloat(product.regular_price || '0');
  const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
  const variationPrice = activeVariation?.price ? parseFloat(activeVariation.price) : (salePrice || regularPrice);
  const currentUnitPrice = variationPrice;
  const currentOriginalPrice = salePrice ? regularPrice : null;
  const discountPct = salePrice && regularPrice > 0 ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

  const maxStockLimit = activeVariation?.stock_quantity || product.stock_quantity || 10;

  const handleAddToCart = () => {
    if (!activeVariation || maxStockLimit <= 0) return;

    const cartItem: CartItem = {
      productId: product.id,
      variantId: activeVariation.id,
      name: product.name,
      imageUrl: product.images[0]?.src || 'https://picsum.photos/seed/cartplaceholder/300/400',
      size: selectedSize,
      color: selectedColor,
      quantity,
      unitPrice: currentUnitPrice,
      maxStock: maxStockLimit
    };

    addItem(cartItem);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. PRICE METRICS AREA */}
      <div className="space-y-2 bg-stone-50 border border-stone-100 rounded-xl p-6 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-4xl font-black text-stone-950 tracking-tight">
            Rs {currentUnitPrice.toLocaleString()}
          </span>
          {currentOriginalPrice && (
            <span className="text-xl text-red-500/80 line-through font-bold">
              Rs {currentOriginalPrice.toLocaleString()}
            </span>
          )}
        </div>
        {discountPct > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              {discountPct}% OFF
            </span>
            <p className="text-[11px] text-red-600 font-bold uppercase tracking-widest">
              SAVE Rs {currentOriginalPrice ? Math.round(currentOriginalPrice - currentUnitPrice).toLocaleString() : '0'}
            </p>
          </div>
        )}
      </div>

      {/* 2. COLOR PICKER */}
      {uniqueColors.length > 0 && (
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between">
            <span>Color: <strong className="text-stone-900 font-extrabold font-sans">{selectedColor}</strong></span>
          </label>
          <div className="flex gap-2">
            {uniqueColors.map((color) => {
              const borderStyles = selectedColor === color.name 
                ? 'ring-2 ring-brand ring-offset-2' 
                : 'hover:scale-105';
              return (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-8 h-8 rounded-full border border-stone-300 outline-hidden transition-all cursor-pointer ${borderStyles}`}
                  style={{ backgroundColor: `#${color.hex}` }}
                  title={color.name}
                  aria-label={`Select color ${color.name}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 3. SIZE SELECTOR WITH INVENTORY CHECKS */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between">
          <span>Size Option: <strong className="text-stone-900 font-extrabold font-sans">{selectedSize}</strong></span>
          {activeVariation && (
            <span className={`text-[10px] font-bold ${maxStockLimit > 3 ? 'text-stone-400' : 'text-red-500 font-extrabold'}`}>
              {maxStockLimit > 0 ? `Stock Left: ${maxStockLimit}` : 'Out of Stock'}
            </span>
          )}
        </label>
        
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(variations.map(v => {
            const sizeAttr = v.attributes.find(a => a.name.toLowerCase() === 'size');
            return sizeAttr?.option;
          }).filter(Boolean))).map((size) => {
            const vOpt = variations.find(v => {
              const sizeAttr = v.attributes.find(a => a.name.toLowerCase() === 'size');
              const colorAttr = v.attributes.find(a => a.name.toLowerCase() === 'color');
              return colorAttr?.option === selectedColor && sizeAttr?.option === size;
            });
            const sizeInStock = vOpt && (vOpt.stock_quantity || 0) > 0;
            const isSelected = selectedSize === size;
            
            let btnClass = 'border-stone-200 text-stone-800 bg-white hover:border-stone-400';
            if (isSelected) {
              btnClass = 'bg-stone-900 text-white border-stone-900 font-bold';
            } else if (!vOpt) {
                // Size doesn't exist for this color
                btnClass = 'hidden';
            } else if (!sizeInStock) {
              btnClass = 'opacity-30 border-dashed border-stone-200 text-stone-300 pointer-events-none cursor-not-allowed';
            }
            
            if (!vOpt) return null;

            return (
              <button
                key={String(size)}
                disabled={!sizeInStock}
                onClick={() => setSelectedSize(String(size))}
                className={`text-xs font-heavy tracking-wider h-11 px-4 sm:px-6 rounded-xl border transition-all cursor-pointer flex items-center justify-center min-w-14 sm:min-w-16 ${btnClass}`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. QUANTITY CONTROLLER STEPPER */}
      {maxStockLimit > 0 && (
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Quantity Selection</label>
          <div className="flex items-center border border-stone-200 rounded-full w-fit bg-stone-50 p-1 shadow-xs">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setQuantity(prev => Math.max(1, prev - 1)); }}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 border border-stone-200 flex items-center justify-center text-stone-700 transition-colors disabled:opacity-30 cursor-pointer"
              aria-label="Reduce quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-sm font-bold font-sans text-stone-900">{quantity}</span>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setQuantity(prev => Math.min(maxStockLimit, prev + 1)); }}
              disabled={quantity >= maxStockLimit}
              className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 border border-stone-200 flex items-center justify-center text-stone-700 transition-colors disabled:opacity-30 cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. ADD TO CART AND WISHLIST CTA ACTION BUTTONS */}
      <div className="flex items-center gap-2 md:gap-3 pt-4">
        {maxStockLimit <= 0 ? (
          <button
            disabled
            className="flex-1 bg-stone-200 text-stone-400 h-12 rounded-full text-xs font-black uppercase tracking-wider cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`flex-1 ${added ? 'bg-stone-700' : 'bg-stone-900 hover:bg-black'} text-white h-12 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 shadow-xl cursor-pointer px-3 sm:px-6`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 shrink-0" /> Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 shrink-0" /> <span className="hidden xs:inline">Add to Bag</span><span className="xs:hidden">Add to Bag</span>
              </>
            )}
          </button>
        )}

        <div className="flex gap-1.5 md:gap-2 shrink-0">
          {/* Heart Wishlist Toggler */}
          <button
            onClick={() => toggleWishlist(String(product.id))}
            className="w-12 h-12 rounded-full border border-stone-200 hover:border-stone-400 bg-white shadow-xs flex items-center justify-center transition-all cursor-pointer shrink-0"
            aria-label={isMounted && isLiked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-5 h-5 ${isMounted && isLiked ? 'fill-red-500 text-red-500 scale-105' : 'text-stone-500'}`} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShareClick}
            className="w-12 h-12 rounded-full border border-stone-200 hover:border-stone-400 bg-white shadow-xs flex items-center justify-center transition-all cursor-pointer relative shrink-0"
            aria-label="Share style"
          >
            {copiedShare ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Share2 className="w-5 h-5 text-stone-500" />
            )}
            
            {copiedShare && (
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-stone-900 text-white text-[9px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                Link Copied!
              </span>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
