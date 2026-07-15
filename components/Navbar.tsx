'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';
import { ShoppingBag, Heart, Menu } from 'lucide-react';
import CartSidebar from '@/components/CartSidebar';
import MenuDrawer from '@/components/MenuDrawer';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const totalCartItems = useCart((state) => state.getTotalItems());
  const totalWishItems = useWishlist((state) => state.itemIds.length);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/orders', label: 'Orders' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <div className="sticky top-0 z-50 w-full">
        <header
          className={`transition-all duration-300 ${
            scrolled 
              ? 'bg-white/80 backdrop-blur-3xl shadow-lg' 
              : 'bg-white shadow-sm'
          }`}
        >
          <nav className="max-w-[1560px] mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-12 sm:h-14">
              {/* Logo - Left */}
              <Link href="/" aria-label="Home" className="flex items-center">
                <div className="w-[150px] pt-1">
                  <img src="logo.png" alt="The Style Zone" />
                </div>
              </Link>

              {/* Desktop Navigation - Center */}
              <div className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-label={`Navigate to ${link.label}`}
                    className={`hover:text-[#FE5733] font-sm transition-colors duration-200 relative group tracking-wider whitespace-nowrap ${
                      isActive(link.href)
                        ? 'text-[#FE5733]'
                        : 'text-stone-600'
                    }`}
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FE5733] transition-all duration-300 group-hover:w-full"></span>
                    <span className={`${
                      isActive(link.href)
                        ? 'absolute bottom-0 left-0 w-0 h-[2px] bg-[#FE5733] w-full'
                        : ''
                    }`}></span>
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

                {/* Mobile Menu Button - Right */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden flex items-center justify-center p-2 text-stone-600 hover:text-black transition-colors"
                  aria-label="Toggle navigation"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </nav>
        </header>
      </div>

      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
