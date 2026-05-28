import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb, generateId, Product, ProductVariant } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const db = await readDb();
    const { searchParams } = new URL(req.url);
    
    // Parse filters
    const categorySlug = searchParams.get('category');
    const gender = searchParams.get('gender');
    const q = searchParams.get('q')?.toLowerCase() || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '100000');
    const sort = searchParams.get('sort') || 'popularity';
    const activeOnly = searchParams.get('admin') !== 'true';
    
    // Arrays for multiple filters
    const sizes = searchParams.get('sizes')?.split(',').filter(Boolean) || [];
    const colors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
    
    let filteredProducts = db.products;
    
    // Filter active
    if (activeOnly) {
      filteredProducts = filteredProducts.filter(p => p.is_active);
    }
    
    // Filter category
    if (categorySlug) {
      const cat = db.categories.find(c => c.slug === categorySlug);
      if (cat) {
        // Find if this is parent category or subcategory
        const childCats = db.categories.filter(c => c.parent_id === cat.id);
        const catIds = [cat.id, ...childCats.map(c => c.id)];
        filteredProducts = filteredProducts.filter(p => catIds.includes(p.category_id));
      } else {
        filteredProducts = [];
      }
    }
    
    // Filter gender
    if (gender) {
      filteredProducts = filteredProducts.filter(p => p.gender === gender || p.gender === 'unisex');
    }
    
    // Filter by query (name, description, brand, tags)
    if (q) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    
    // Filter by sizes and colors (via variants)
    if (sizes.length > 0 || colors.length > 0) {
      filteredProducts = filteredProducts.filter(p => {
        const productVariants = db.variants.filter(v => v.product_id === p.id && v.is_active && v.stock > 0);
        
        const matchesSize = sizes.length === 0 || productVariants.some(v => sizes.includes(v.size));
        const matchesColor = colors.length === 0 || productVariants.some(v => colors.some(col => v.color.toLowerCase().includes(col.toLowerCase())));
        
        return matchesSize && matchesColor;
      });
    }
    
    // Filter by price range (using sale_price if present, else base_price)
    filteredProducts = filteredProducts.filter(p => {
      const price = p.sale_price !== null && p.sale_price !== undefined ? p.sale_price : p.base_price;
      return price >= minPrice && price <= maxPrice;
    });
    
    // Sort products
    if (sort === 'newest') {
      filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === 'price-asc') {
      filteredProducts.sort((a, b) => {
        const pa = a.sale_price !== null && a.sale_price !== undefined ? a.sale_price : a.base_price;
        const pb = b.sale_price !== null && b.sale_price !== undefined ? b.sale_price : b.base_price;
        return pa - pb;
      });
    } else if (sort === 'price-desc') {
      filteredProducts.sort((a, b) => {
        const pa = a.sale_price !== null && a.sale_price !== undefined ? a.sale_price : a.base_price;
        const pb = b.sale_price !== null && b.sale_price !== undefined ? b.sale_price : b.base_price;
        return pb - pa;
      });
    } else if (sort === 'rating') {
      filteredProducts.sort((a, b) => b.rating_avg - a.rating_avg);
    } else {
      // default: popularity (sort by rating_count desc, then rating_avg desc)
      filteredProducts.sort((a, b) => {
        if (b.rating_count !== a.rating_count) {
          return b.rating_count - a.rating_count;
        }
        return b.rating_avg - a.rating_avg;
      });
    }
    
    // Assemble variants inside the return if requested
    const withVariants = searchParams.get('include_variants') === 'true';
    const productsToSend = filteredProducts.map(p => {
      if (withVariants) {
        return {
          ...p,
          variants: db.variants.filter(v => v.product_id === p.id)
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
    const db = await readDb();
    const data = await req.json();
    
    // Validate required fields
    if (!data.name || !data.category_id || !data.brand || data.base_price === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required product fields' }, { status: 400 });
    }
    
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check uniqueness
    if (db.products.some(p => p.slug === slug)) {
      return NextResponse.json({ success: false, error: 'Product slug or name already exists' }, { status: 400 });
    }
    
    const nowStr = new Date().toISOString();
    const productId = generateId();
    
    // Round sale price vs base price
    const base_price = parseFloat(data.base_price);
    const sale_price = data.sale_price ? parseFloat(data.sale_price) : null;
    const discount_pct = sale_price && base_price > 0 
      ? Math.round(((base_price - sale_price) / base_price) * 100) 
      : 0;
      
    // Set total stock based on variants
    const formVariants = data.variants || [];
    let stock_total = 0;
    
    const savedVariants: ProductVariant[] = formVariants.map((v: any, index: number) => {
      const sQty = parseInt(v.stock || '0', 10);
      stock_total += sQty;
      return {
        id: generateId(),
        product_id: productId,
        size: v.size || 'M',
        color: v.color || 'Default',
        color_hex: v.color_hex || '978877',
        sku: v.sku || `${data.brand.substring(0,3).toUpperCase()}-${data.name.substring(0,3).toUpperCase()}-${index}-${v.size || 'M'}`,
        stock: sQty,
        price_delta: parseFloat(v.price_delta || '0'),
        is_active: true,
        created_at: nowStr
      };
    });
    
    const newProduct: Product = {
      id: productId,
      name: data.name,
      slug,
      description: data.description || '',
      short_description: data.short_description || data.description?.substring(0, 150) || '',
      category_id: data.category_id,
      brand: data.brand,
      gender: data.gender || 'unisex',
      base_price,
      sale_price,
      discount_pct,
      images: data.images && data.images.length > 0 ? data.images : ['https://picsum.photos/seed/defaultp/600/800'],
      tags: data.tags || [],
      is_active: data.is_active !== undefined ? data.is_active : true,
      is_featured: data.is_featured !== undefined ? data.is_featured : false,
      stock_total,
      rating_avg: 0,
      rating_count: 0,
      categories: db.categories.find(c => String(c.id) === String(data.category_id))?.name ? [db.categories.find(c => String(c.id) === String(data.category_id))!.name] : [],
      colors: Array.from(new Set(savedVariants.map(v => v.color))),
      sizes: Array.from(new Set(savedVariants.map(v => v.size))),
      sku: savedVariants[0]?.sku || '',
      created_at: nowStr,
      updated_at: nowStr
    };
    
    db.products.push(newProduct);
    db.variants.push(...savedVariants);
    await saveDb(db);
    
    return NextResponse.json({
      success: true,
      product: newProduct,
      variantsCount: savedVariants.length
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
