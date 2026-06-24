'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';
import { ShoppingBag, Heart, Menu, X } from 'lucide-react';
import CartSidebar from '@/components/CartSidebar';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const totalCartItems = useCart((state) => state.getTotalItems());
  const totalWishItems = useWishlist((state) => state.itemIds.length);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/orders', label: 'Orders' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-white border-b border-black/5">
        <nav className="max-w-[1560px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden flex items-center justify-center p-2 text-stone-600 hover:text-black transition-colors"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link href="/" aria-label="Home" className="flex items-center">
              <div className="font-display font-black text-lg sm:text-xl tracking-tighter text-black">
                THE STYLE ZONE
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-label={`Navigate to ${link.label}`}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-[#FE5733]'
                      : 'text-stone-600 hover:text-black'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className={`relative flex items-center justify-center p-2 transition-colors ${
                  isActive('/wishlist')
                    ? 'text-[#FE5733]'
                    : 'text-stone-600 hover:text-[#FE5733]'
                }`}
              >
                <Heart className="w-5 h-5" />
                {isMounted && totalWishItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FE5733] text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center">
                    {totalWishItems > 9 ? '9+' : totalWishItems}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
                className={`relative flex items-center justify-center p-2 transition-colors ${
                  isCartOpen
                    ? 'text-[#FE5733]'
                    : 'text-stone-600 hover:text-[#FE5733]'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {isMounted && totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FE5733] text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center">
                    {totalCartItems > 9 ? '9+' : totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-black/5">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-label={`Navigate to ${link.label}`}
                  className="block text-sm font-medium text-stone-700 hover:text-[#FE5733] transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
