'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  sale_price: number | null;
  images: string[];
  is_featured: boolean;
}

interface HeroClientProps {
  featuredProducts: Product[];
  allProducts: Product[];
}

const SLIDES = [
  {
    id: 'slide-1',
    headline: 'Dressed for\nEvery Chapter',
    ctaText: 'Shop the Collection',
    ctaLink: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=80',
    overlayOpacity: 0.45,
  },
  {
    id: 'slide-2',
    headline: 'Minimalism\nPerfected',
    ctaText: 'Explore Essentials',
    ctaLink: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1800&q=80',
    overlayOpacity: 0.50,
  },
  {
    id: 'slide-3',
    headline: 'Built to Last\nStyled to Lead',
    ctaText: 'Shop Outerwear',
    ctaLink: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1800&q=80',
    overlayOpacity: 0.40,
  },
];

const SLIDE_DURATION = 6000;

export default function HeroClient({ featuredProducts, allProducts }: HeroClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [progressKey, setProgressKey] = useState(0);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setProgressKey((k) => k + 1);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % SLIDES.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + SLIDES.length) % SLIDES.length);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = SLIDES[currentSlide];

  return (
    <>
      <section className="relative w-full h-[93vh] min-h-[500px] max-h-[900px] overflow-hidden bg-black">

        {/* ── Background slides ── */}
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 w-full h-full transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: i === currentSlide ? 1 : 0,
              transform: i === currentSlide ? 'scale(1.03) translateY(0px)' : 'scale(1.01) translateY(12px)',
            }}
            aria-hidden={i !== currentSlide}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              style={{
                transform: i === currentSlide ? 'scale(1.12) translateY(0px)' : 'scale(1.04) translateY(10px)',
                transition: 'transform 24s ease-out',
              }}
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(0,0,0,${s.overlayOpacity})` }}
            />
          </div>
        ))}

        {/* ── Bottom vignette for text legibility ── */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

        {/* ── Hero text content ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-10 text-center">
          <div
            key={`content-${currentSlide}`}
            className="max-w-4xl"
            style={{ animation: 'heroFadeUp 0.65s ease both' }}
          >
            {/* Main headline — Cormorant-inspired via font-display */}
            <h1
              className="font-display font-black text-white leading-[0.95] tracking-tight mb-10 whitespace-pre-line"
              style={{ fontSize: 'clamp(3rem, 10vw, 5rem)' }}
            >
              {slide.headline}
            </h1>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={slide.ctaLink}
                className="group btn btn-primary inline-flex items-center gap-2 px-5 py-2"
              >
                {slide.ctaText}
                <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/shop"
                className="group btn btn-ghost inline-flex items-center gap-2.5 px-4 py-2"
              >
                <Search className="w-4 h-4" />
                Search Products
              </Link>
            </div>
          </div>
        </div>

        {/* ── Slide indicators (dots) ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-400 ${
                i === currentSlide
                  ? 'bg-[#FE5733] w-8 h-2'
                  : 'bg-white/40 hover:bg-white/70 w-2 h-2'
              }`}
            />
          ))}
        </div>

        {/* ── Full-width progress bar at very bottom ── */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10">
          <div
            key={`progress-${progressKey}`}
            className="h-full bg-[#FE5733] origin-left"
            style={{ animation: `progressBar ${SLIDE_DURATION}ms linear both` }}
          />
        </div>

        {/* ── Arrow navigation ── */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm border border-white/10 transition-all duration-200 hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm border border-white/10 transition-all duration-200 hover:scale-105"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

      </section>

      {/* Search is now a dedicated page at /search */}
    </>
  );
}
