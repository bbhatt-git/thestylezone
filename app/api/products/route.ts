import { NextRequest, NextResponse } from 'next/server';
import { readDb, Product } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const db = await readDb();
    const { searchParams } = new URL(req.url);
    
    // Parse filters
    const categorySlug = searchParams.get('category');
    const q = searchParams.get('q')?.toLowerCase() || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '100000');
    const sort = searchParams.get('sort') || 'popularity';
    const activeOnly = searchParams.get('admin') !== 'true';
    
    // Arrays for multiple filters
    const sizes = searchParams.get('sizes')?.split(',').filter(Boolean) || [];
    const colors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
    
    let filteredProducts = db.products;
    
    // Filter active (published)
    if (activeOnly) {
      filteredProducts = filteredProducts.filter(p => p.status === 'publish');
    }
    
    // Filter category
    if (categorySlug) {
      const cat = db.categories.find(c => c.slug === categorySlug);
      if (cat) {
        // Find if this is parent category or subcategory
        const childCats = db.categories.filter(c => c.parent === cat.id);
        const catIds = [cat.id, ...childCats.map(c => c.id)];
        filteredProducts = filteredProducts.filter(p => 
          p.categories.some((c: any) => catIds.includes(c.id))
        );
      } else {
        filteredProducts = [];
      }
    }
    
    // Filter by query (name, description, tags)
    if (q) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t: any) => t.name.toLowerCase().includes(q))
      );
    }
    
    // Filter by sizes and colors (via attributes)
    if (sizes.length > 0 || colors.length > 0) {
      filteredProducts = filteredProducts.filter(p => {
        const sizeAttr = p.attributes.find((a: any) => a.name?.toLowerCase() === 'size');
        const colorAttr = p.attributes.find((a: any) => a.name?.toLowerCase() === 'color');
        
        const sizeOptions = sizeAttr?.options || [];
        const colorOptions = colorAttr?.options || [];
        
        const matchesSize = sizes.length === 0 || sizes.some((s: string) => sizeOptions.includes(s));
        const matchesColor = colors.length === 0 || colors.some((c: string) => colorOptions.some((co: string) => co.toLowerCase().includes(c.toLowerCase())));
        
        return matchesSize && matchesColor;
      });
    }
    
    // Filter by price range (using sale_price if present, else regular_price)
    filteredProducts = filteredProducts.filter(p => {
      const price = p.sale_price ? parseFloat(p.sale_price) : parseFloat(p.regular_price || '0');
      return price >= minPrice && price <= maxPrice;
    });
    
    // Sort products
    if (sort === 'newest') {
      filteredProducts.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
    } else if (sort === 'price-asc') {
      filteredProducts.sort((a, b) => {
        const pa = a.sale_price ? parseFloat(a.sale_price) : parseFloat(a.regular_price || '0');
        const pb = b.sale_price ? parseFloat(b.sale_price) : parseFloat(b.regular_price || '0');
        return pa - pb;
      });
    } else if (sort === 'price-desc') {
      filteredProducts.sort((a, b) => {
        const pa = a.sale_price ? parseFloat(a.sale_price) : parseFloat(a.regular_price || '0');
        const pb = b.sale_price ? parseFloat(b.sale_price) : parseFloat(b.regular_price || '0');
        return pb - pa;
      });
    } else if (sort === 'rating') {
      filteredProducts.sort((a, b) => parseFloat(b.average_rating || '0') - parseFloat(a.average_rating || '0'));
    } else {
      // default: popularity (sort by rating_count desc, then rating_avg desc)
      filteredProducts.sort((a, b) => {
        if (b.rating_count !== a.rating_count) {
          return b.rating_count - a.rating_count;
        }
        return parseFloat(b.average_rating || '0') - parseFloat(a.average_rating || '0');
      });
    }
    
    // Assemble variations inside the return if requested
    const withVariants = searchParams.get('include_variants') === 'true';
    const productsToSend = filteredProducts.map(p => {
      if (withVariants) {
        return {
          ...p,
          variations: db.variations.filter(v => v.product_id === p.id)
        };
      }
      return p;
    });
    
    return NextResponse.json({
      success: true,
      count: productsToSend.length,
      products: productsToSend
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Note: Products should be created via admin panel which syncs to WooCommerce
    // Storefront is read-only for products
    return NextResponse.json({ 
      success: false, 
      error: 'Products should be created via admin panel' 
    }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
