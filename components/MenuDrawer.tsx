'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Instagram, Facebook, PhoneCall, Mail } from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  const pathname = usePathname();

  // TikTok Icon SVG
const TikTokIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-2.51V7.843a6.3 6.3 0 0 0-5.396 3.642 6.298 6.298 0 0 0 3.148 8.18 6.3 6.3 0 0 0 9.61-5.37v-6.03a8.3 8.3 0 0 0 4.77 1.512V6.89a4.775 4.775 0 0 1-1.9-.204z"/>
  </svg>
);


  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/orders', label: 'Orders' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/wishlist', label: 'Wishlist' }
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: TikTokIcon, href: '#', label: 'TikTok' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

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
          className="fixed inset-0 bg-black/50 z-[95] transition-opacity duration-300 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-[100dvh] w-60vw bg-white shadow-2xl z-[100] transform transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 shrink-0">
          <h2 className="text-lg font-black text-black uppercase tracking-tighter">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-stone-600 hover:text-black transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <nav className="space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`block text-2xl font-semibold uppercase tracking-tight transition-colors ${
                  isActive(link.href)
                    ? 'text-[#FE5733]'
                    : 'text-stone-800 hover:text-[#FE5733]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Social Links */}
        <div className="px-6 py-6 border-t border-black/10 shrink-0">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">Connect With Us</p>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="p-2 text-stone-600 hover:text-[#FE5733] transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          <hr className="text-black/20"/>
          <p className="mt-2 flex  text-black/40 text-semibold text-sm">Phone: +977 9865900094</p>
        </div>
      </div>
    </>
  );
}
