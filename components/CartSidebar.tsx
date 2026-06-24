'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/cartStore';
import { X, Truck, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { calculateShippingCost } from '@/lib/shipping-api';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const [shippingCost, setShippingCost] = useState(200);
  const finalTotal = totalPrice + shippingCost;

  // Calculate shipping cost (default to Nepal rate for cart display)
  useEffect(() => {
    const fetchShippingCost = async () => {
      try {
        const cost = await calculateShippingCost('NP');
        setShippingCost(cost);
      } catch (err) {
        console.error('Error fetching shipping cost:', err);
        setShippingCost(200);
      }
    };
    fetchShippingCost();
  }, []);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[95] transition-opacity duration-300 backdrop-blur-[2px]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-[100dvh] w-full max-w-[420px] bg-white shadow-2xl z-[100] transform transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ touchAction: 'pan-y', paddingBottom: 'env(safe-area-inset-bottom, 20px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b-2 border-black shrink-0">
          <h2 className="text-xl font-black text-black uppercase tracking-tighter">
            Your Bag
            <span className="ml-2 font-serif text-black/40 font-bold text-[15px] tracking-widest">({isMounted ? totalItems : 0} {isMounted && totalItems === 1 ? 'ITEM' : 'ITEMS'})</span>
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm p-1 rounded-[6px]"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>



        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          {!isMounted || items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 border-2 border-black rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-black" strokeWidth={1} />
              </div>
              <p className="text-xl font-black uppercase tracking-widest text-black mb-2 font-display">Your bag is empty</p>
              <p className="text-xs font-bold uppercase tracking-widest text-black/40 mb-8">No items added yet</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="btn btn-primary w-full h-12 text-xs font-bold uppercase tracking-widest"
              >
                Discover Pieces
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.variantId} className="flex gap-4 py-5 border-b-2 border-black/10 last:border-0">
                {/* Image */}
                <div className="w-[80px] h-[100px] bg-black/5 overflow-hidden shrink-0 border-2 border-black/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-black leading-snug mb-0.5 line-clamp-2">{item.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">{item.size} {item.color ? `${item.size ? '•' : ''} ${item.color}` : ''}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="btn btn-ghost btn-sm p-2 rounded-full text-black/60 hover:text-black"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Pill Quantity */}
                    <div className="flex items-center border-2 border-black/20 rounded-full bg-white">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="btn btn-ghost btn-sm w-9 h-9 rounded-full text-black/80 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-[10px] font-black tracking-widest text-black">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="btn btn-ghost btn-sm w-9 h-9 rounded-full text-black/80"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    {/* Price */}
                    <p className="text-sm font-black tracking-tighter text-black">Rs {(item.unitPrice * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {isMounted && items.length > 0 && (
          <div className="border-t border-black/10 px-6 pt-6 pb-5 space-y-4 shrink-0 bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-black/50">Subtotal</span>
                <span className="text-black">Rs {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-black/50">Shipping</span>
                <span className="text-black">Rs {shippingCost}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-black/10 pt-4 mt-2">
                <span className="font-black uppercase tracking-widest text-black">Total</span>
                <span className="font-black uppercase tracking-widest text-black">Rs {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/checkout"
                onClick={onClose}
                className="btn btn-primary w-full h-12 text-xs font-bold uppercase tracking-widest"
              >
                Checkout
              </Link>
              <button
                onClick={onClose}
                className="btn btn-ghost w-full h-12 text-xs font-bold uppercase tracking-widest"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
