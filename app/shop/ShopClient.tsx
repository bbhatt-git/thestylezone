'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import PriceSliderClient from '@/components/PriceSliderClient';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  base_price: number;
  sale_price: number | null;
  discount_pct: number;
  images: string[];
  rating_avg: number;
  rating_count: number;
  stock_total: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  description: string;
  categories: string[];
  colors: string[];
  sizes: string[];
}

interface ShopClientProps {
  initialProducts: Product[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  
  // Extract all categories, sizes, and colors for filter buttons
  const categories = ['All', ...Array.from(new Set(initialProducts.flatMap(p => p.categories)))];
  const allSizes = ['All', ...Array.from(new Set(initialProducts.flatMap(p => p.sizes)))];
  const allColors = ['All', ...Array.from(new Set(initialProducts.flatMap(p => p.colors)))];

  // Price range of WooCommerce items available
  const prices = initialProducts.map(p => p.sale_price || p.base_price);
  const lowestPriceInStore = initialProducts.length > 0 ? Math.min(...prices) : 0;
  const highestProductPrice = initialProducts.length > 0 ? Math.max(...prices) : 10000;
  const highestPriceInStore = highestProductPrice + 2000;

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(highestPriceInStore);
  const [sortBy, setSortBy] = useState('latest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const productsPerPage = 12;
  
  // Simulated loading state for the skeleton shimmer effect during filtering
  const [isPending, startTransition] = useTransition();
  const [isFiltering, setIsFiltering] = useState(false);

  // Update filtering state immediately
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 50); // minimal delay just to show reaction

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedSize, selectedColor, minPrice, maxPrice, sortBy]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.sort-dropdown') && !target.closest('.sort-dropdown-button')) {
        setIsSortDropdownOpen(false);
      }
    };

    if (isSortDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isSortDropdownOpen]);

  // Reset to page 1 when filters change
  const filterKey = `${searchTerm}-${selectedCategory}-${selectedSize}-${selectedColor}-${minPrice}-${maxPrice}-${sortBy}`;
  useEffect(() => {
    setCurrentPage(1);
  }, [filterKey]);

  // Handle filtrations
  const filteredProducts = initialProducts.filter((product) => {
    const price = product.sale_price || product.base_price;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.categories.includes(selectedCategory);
    const matchesSize = selectedSize === 'All' || product.sizes.includes(selectedSize);
    const matchesColor = selectedColor === 'All' || product.colors.includes(selectedColor);
    const matchesPrice = price >= minPrice && price <= maxPrice;

    return matchesSearch && matchesCategory && matchesSize && matchesColor && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.sale_price || a.base_price;
    const priceB = b.sale_price || b.base_price;

    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return b.rating_avg - a.rating_avg;
    // default ‘latest’
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      {/* Mobile Filter and Sort Bar */}
      <div className="lg:hidden flex items-center gap-2 bg-white rounded-[5px] p-2 border-2 border-black/10">
        <button 
          onClick={() => setIsMobileFilterOpen(true)}
          className="btn btn-primary flex items-center justify-center gap-2 text-xs uppercase tracking-widest flex-1 whitespace-nowrap"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </button>
        <div className="relative flex-1">
          <button 
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="btn btn-ghost sort-dropdown-button w-full px-2 flex items-center justify-between gap-1 text-xs uppercase tracking-tight whitespace-nowrap"
          >
            <span className="truncate">
              {sortBy === 'latest' && 'New Arrivals'}
              {sortBy === 'price-low' && 'Price: Low to High'}
              {sortBy === 'price-high' && 'Price: High to Low'}
              {sortBy === 'rating' && 'Top Rated'}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isSortDropdownOpen && (
            <div className="sort-dropdown absolute top-full left-0 right-0 mt-1 rounded-[5px] bg-white border-2 border-black shadow-2xl z-50 tracking-tight">
              {[
                { value: 'latest', label: 'New' },
                { value: 'price-low', label: 'Price: Low' },
                { value: 'price-high', label: 'Price: High' },
                { value: 'rating', label: 'Top Rated' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setIsSortDropdownOpen(false);
                  }}
                  className={`w-full text-left text-xs font-bold uppercase tracking-tight px-4 py-2 hover:bg-black hover:text-white transition-colors whitespace-nowrap ${
                    sortBy === option.value ? 'bg-black/80 text-white' : 'text-black'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters Overlay and Sidebar */}
      {isMobileFilterOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileFilterOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 bottom-0 left-0 z-[70] w-4/5 max-w-[320px] bg-white overflow-y-auto shadow-2xl p-4 pt-5
        transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        lg:static lg:translate-x-0 lg:w-full lg:max-w-none lg:h-auto lg:overflow-visible lg:shadow-none lg:p-8 lg:pt-8 lg:border-2 lg:border-black rounded-[6px] lg:bg-white lg:z-0
        lg:col-span-3 space-y-10
        ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between pb-1 border-b border-black/10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-black" />
            <h3 className="text-xs font-semibold uppercase tracking-wide text-black">Filters</h3>
          </div>
          <button 
            className="lg:hidden p-2 -mr-2 text-stone-400 hover:text-[#121212] transition-colors"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/50">Search</label>
          <div className="relative">
            <Search className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-3 text-xs bg-transparent border border-black/10 rounded-md text-black focus:border-black focus:ring-0 outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/50">Categories</label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm h-7 text-xs px-3 mx-0 tracking-wide transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-black border-black text-white' 
                    : 'bg-white border-black/20 hover:border-black text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sizing */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-black/50">Sizing Filter</label>
          <div className="flex flex-wrap gap-1.5">
            {allSizes.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`btn btn-sm h-7 text-xs px-3 mx-0 uppercase tracking-wide transition-all ${
                  selectedSize === sz 
                    ? 'bg-black border-black text-white' 
                    : 'bg-white border-black/20 hover:border-black text-black'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Colorway */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/50">Colors</label>
          <div className="flex flex-wrap gap-1.5">
            {allColors.map((col) => (
              <button
                key={col}
                onClick={() => setSelectedColor(col)}
                className={`flex items-center justify-center rounded-full w-7 h-7 border transition-all ${
                  selectedColor === col
                    ? 'border-black bg-black/20'
                    : 'border-black/10 bg-white hover:border-black'
                }`}
                aria-label={col}
                title={col}
              >
                <span
                  className="block w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: col.toLowerCase(),
                    boxShadow: col.toLowerCase() === 'white' ? '0 0 0 1px #000 inset' : undefined,
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Price Slider */}
        <div className="space-y-2">
          <PriceSliderClient 
            min={0}
            max={highestPriceInStore}
            onChange={(min, max) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
          />
        </div>

        <button 
          onClick={() => {
            setSearchTerm('');
            setSelectedCategory('All');
            setSelectedSize('All');
            setSelectedColor('All');
            setMinPrice(0);
            setMaxPrice(highestPriceInStore);
            setSortBy('latest');
          }}
          className="btn btn-ghost w-full text-xs uppercase tracking-[0.1em]"
        >
          Reset All
        </button>
      </div>

      {/* Products Column */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* Sorting and Layout Preferences */}
        <div className="hidden lg:flex flex-col sm:flex-row justify-between items-center bg-transparent pb-2 border-b border-black/20 mb-8 gap-4">
          <p className="text-[12px] font-semibold tracking-widest uppercase text-black/40">
            SHOWING {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, sortedProducts.length)} OF {sortedProducts.length} PRODUCTS
          </p>

          <div className="flex items-center gap-4">
            {/* Sorter */}
            <div className="relative">
              <button 
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="sort-dropdown-button flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide bg-white rounded-[5px] border border-black/10 px-3 py-1 hover:border-black transition-colors text-black whitespace-nowrap"
              >
                Sort By
                <ChevronDown className={`w-4 h-4 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSortDropdownOpen && (
                <div className="sort-dropdown absolute top-full right-0 mt-1 rounded-[5px] bg-white border-2 border-black shadow-2xl z-50 min-w-[180px]">
                  {[
                    { value: 'latest', label: 'New Arrivals' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'rating', label: 'Top Rated' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full text-left text-[10px] font-bold uppercase tracking-widest px-4 py-3 hover:bg-black/40 hover:text-white transition-colors whitespace-nowrap ${
                        sortBy === option.value ? 'bg-black/80 text-white' : 'text-black'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shimmer Loading Skeleton / Product Grid */}
        {isFiltering ? (
          <div className="grid gap-3 md:gap-6 grid-cols-2 lg:grid-cols-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-[#121212]/5 p-4 rounded-[4px] bg-white space-y-4 animate-pulse">
                <div className="aspect-[3/4] bg-neutral-200 rounded-[4px] w-full relative overflow-hidden">
                  {/* Rotating shimmer overlay */}
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)' }}></div>
                </div>
                <div className="h-3.5 bg-neutral-200 rounded-[4px] w-1/3"></div>
                <div className="h-4 bg-neutral-200 rounded-[4px] w-4/5"></div>
                <div className="h-3 bg-neutral-200 rounded-[4px] w-1/2"></div>
                <div className="flex gap-2 pt-2">
                  <div className="h-5 bg-neutral-200 rounded-[4px] w-16"></div>
                  <div className="h-5 bg-neutral-200 rounded-[4px] w-12"></div>
                </div>
              </div>
            ))}
          </div>
        ) : currentProducts.length > 0 ? (
          <div className="grid gap-3 md:gap-6 transition-all duration-300 grid-cols-2 lg:grid-cols-4">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[4px] border border-[#121212]/5">
            <SlidersHorizontal className="w-10 h-10 text-[#121212]/20 mx-auto mb-4" />
            <h4 className="text-lg font-bold uppercase tracking-tight text-[#121212]">No Products Matched</h4>
            <p className="text-xs text-[#121212]/50 mt-1 max-w-sm mx-auto leading-relaxed">
              We couldn&apos;t find any items matching your current filters. Try relaxing your color, sizing, or category filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="btn btn-ghost btn-sm px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex flex-wrap items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`btn btn-sm w-10 h-10 text-xs uppercase tracking-widest ${
                    currentPage === page
                      ? 'bg-[#121212] text-white border-[#121212]'
                      : 'bg-[#F5F5F0]/50 text-[#121212] border-black/10 hover:bg-[#121212] hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="btn btn-ghost btn-sm px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
