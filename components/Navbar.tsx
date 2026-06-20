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
  const [scrolled, setScrolled] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(false);

  const totalCartItems = useCart((state) => state.getTotalItems());
  const totalWishItems = useWishlist((state) => state.itemIds.length);

  useEffect(() => {
    setIsMounted(true);
    const announcementKey = 'announcementDismissedAt';
    const expiryMs = 1000 * 60 * 60 * 24; // 1 day

    try {
      const dismissedAt = localStorage.getItem(announcementKey);

      if (!dismissedAt) {
        setAnnouncementVisible(true);
        return;
      }

      const timestamp = Number(dismissedAt);
      if (Number.isNaN(timestamp) || Date.now() - timestamp > expiryMs) {
        setAnnouncementVisible(true);
      }
    } catch {
      setAnnouncementVisible(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const dismissAnnouncement = () => {
    setAnnouncementVisible(false);
    localStorage.setItem('announcementDismissedAt', Date.now().toString());
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/orders', label: 'Orders' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isHome = pathname === '/';

  return (
    <>
      <div className="sticky top-0 z-50 w-full">
        {announcementVisible && (
          <div className="w-full flex items-center justify-between gap-4 px-4 py-2 bg-[#FE5733] text-white text-[12px] font-medium tracking-[0.18em]">
            <p className="min-w-0 truncate text-left">
              Free delivery above Rs. 2000 — 30 day returns — Authentic products only
            </p>
            <button
              onClick={dismissAnnouncement}
              aria-label="Dismiss announcement"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <header
          className="w-full bg-white/90 backdrop-blur-md border-b border-stone-200/80 text-black shadow-sm"
        >
          <nav className="max-w-[1560px] mx-auto px-3 sm:px-5 lg:px-6 h-[56px] flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex items-center justify-center p-2 rounded-full text-stone-600 hover:text-black transition-colors duration-200"
                aria-label="Toggle navigation"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link href="/" aria-label="Home" className="flex items-center">
                <img
                  src="/logo.png"
                  alt="The Style Zone"
                  className={`h-7 w-auto object-contain transition-all duration-300`}
                />
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-label={`Navigate to ${link.label}`}
                  className={`text-[13px] font-nav font-medium tracking-[0.16em] transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'text-black'
                      : 'text-stone-600 hover:text-black'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
                  isActive('/wishlist')
                    ? 'text-[#FE5733]'
                    : 'text-stone-600 hover:text-[#FE5733]'
                }`}
              >
                <Heart className="w-5 h-5" />
                {isMounted && totalWishItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FE5733] text-white text-[8px] font-semibold min-w-[14px] h-3.5 rounded-full flex items-center justify-center px-0.5">
                    {totalWishItems > 9 ? '9+' : totalWishItems}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ${
                  isCartOpen
                    ? 'text-[#FE5733]'
                    : 'text-stone-600 hover:text-[#FE5733]'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {isMounted && totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FE5733] text-white text-[8px] font-semibold min-w-[14px] h-3.5 rounded-full flex items-center justify-center px-0.5">
                    {totalCartItems > 9 ? '9+' : totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </nav>

          {isOpen && (
            <div className="md:hidden bg-white border-t border-stone-200 px-4 py-4">
              <div className="space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    aria-label={`Navigate to ${link.label}`}
                    className="block text-sm font-nav font-medium text-stone-700 hover:text-black transition-colors"
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
