import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb, Product, ProductVariant } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const db = await readDb();
    
    const product = db.products.find(p => p.slug === slug);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    // Fetch variants and reviews
    const variants = db.variants.filter(v => v.product_id === product.id && v.is_active);
    const reviews = db.reviews.filter(r => r.product_id === product.id);
    const category = db.categories.find(c => c.id === product.category_id);
    
    return NextResponse.json({
      success: true,
      product: {
        ...product,
        variants,
        reviews,
        category: category || null
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const db = await readDb();
    const data = await req.json();
    
    const productIndex = db.products.findIndex(p => p.slug === slug);
    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    const product = db.products[productIndex];
    const nowStr = new Date().toISOString();
    
    // Update basic product details
    const base_price = data.base_price !== undefined ? parseFloat(data.base_price) : product.base_price;
    const sale_price = data.sale_price !== undefined ? (data.sale_price ? parseFloat(data.sale_price) : null) : product.sale_price;
    const discount_pct = sale_price && base_price > 0 
      ? Math.round(((base_price - sale_price) / base_price) * 100) 
      : 0;

    const updatedProduct: Product = {
      ...product,
      name: data.name || product.name,
      description: data.description !== undefined ? data.description : product.description,
      category_id: data.category_id || product.category_id,
      brand: data.brand || product.brand,
      gender: data.gender || product.gender,
      base_price,
      sale_price,
      discount_pct,
      images: data.images || product.images,
      tags: data.tags || product.tags,
      is_active: data.is_active !== undefined ? data.is_active : product.is_active,
      is_featured: data.is_featured !== undefined ? data.is_featured : product.is_featured,
      updated_at: nowStr
    };
    
    // Handle variants list update if passed
    if (data.variants) {
      // De-active old variants
      db.variants = db.variants.filter(v => v.product_id !== product.id);
      
      let stock_total = 0;
      const savedVariants: ProductVariant[] = data.variants.map((v: any, index: number) => {
        const sQty = parseInt(v.stock || '0', 10);
        stock_total += sQty;
        return {
          id: v.id || 'var_' + Math.random().toString(36).substring(2, 9),
          product_id: product.id,
          size: v.size || 'M',
          color: v.color || 'Default',
          color_hex: v.color_hex || '978877',
          sku: v.sku || `${updatedProduct.brand.substring(0,3).toUpperCase()}-${updatedProduct.name.substring(0,3).toUpperCase()}-${index}-${v.size || 'M'}`,
          stock: sQty,
          price_delta: parseFloat(v.price_delta || '0'),
          is_active: true,
          created_at: v.created_at || nowStr
        };
      });
      
      db.variants.push(...savedVariants);
      updatedProduct.stock_total = stock_total;
    }
    
    db.products[productIndex] = updatedProduct;
    await saveDb(db);
    
    return NextResponse.json({
      success: true,
      product: updatedProduct
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const db = await readDb();
    
    const productIndex = db.products.findIndex(p => p.slug === slug);
    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    const pId = db.products[productIndex].id;
    
    // Delete product, variants, and reviews
    db.products.splice(productIndex, 1);
    db.variants = db.variants.filter(v => v.product_id !== pId);
    db.reviews = db.reviews.filter(r => r.product_id !== pId);
    
    await saveDb(db);
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
