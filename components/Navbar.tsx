'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';
import { ShoppingBag, Heart, Menu, X, Search } from 'lucide-react';
import CartSidebar from '@/components/CartSidebar';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const totalCartItems = useCart((state) => state.getTotalItems());
  const totalWishItems = useWishlist((state) => state.itemIds.length);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
      <div className="fixed top-0 left-0 right-0 z-50">
        <header
          className={`transition-all duration-300 ${
            scrolled 
              ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-black/5' 
              : 'bg-transparent border-transparent'
          }`}
        >
          <nav className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors duration-200"
                aria-label="Toggle navigation"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo */}
              <Link href="/" aria-label="Home" className="flex items-center">
                <div className={`font-display font-black text-xl sm:text-2xl tracking-tighter ${scrolled ? 'text-black' : 'text-white'}`}>
                  THE STYLE ZONE
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-label={`Navigate to ${link.label}`}
                    className={`text-sm font-semibold tracking-wide transition-colors duration-200 ${
                      isActive(link.href)
                        ? scrolled ? 'text-[#FE5733]' : 'text-[#FE5733]'
                        : scrolled ? 'text-stone-600 hover:text-black' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  aria-label="Search"
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
                    scrolled 
                      ? 'bg-black/5 text-stone-600 hover:text-black hover:bg-black/10' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Search className="w-5 h-5" />
                </button>

                <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
                    isActive('/wishlist')
                      ? scrolled ? 'bg-[#FE5733] text-white' : 'bg-[#FE5733] text-white'
                      : scrolled 
                        ? 'bg-black/5 text-stone-600 hover:text-black hover:bg-black/10' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  {isMounted && totalWishItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FE5733] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                      {totalWishItems > 9 ? '9+' : totalWishItems}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Cart"
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
                    isCartOpen
                      ? scrolled ? 'bg-[#FE5733] text-white' : 'bg-[#FE5733] text-white'
                      : scrolled 
                        ? 'bg-black/5 text-stone-600 hover:text-black hover:bg-black/10' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {isMounted && totalCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FE5733] text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                      {totalCartItems > 9 ? '9+' : totalCartItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden bg-white border-t border-black/5 shadow-xl">
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    aria-label={`Navigate to ${link.label}`}
                    className="block text-lg font-semibold text-stone-800 hover:text-[#FE5733] transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </header>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
