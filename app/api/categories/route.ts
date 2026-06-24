import { NextRequest, NextResponse } from 'next/server';
import { readDb, Category } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const db = await readDb();
    
    // Sort by menu_order
    const categories = [...db.categories].sort((a, b) => a.menu_order - b.menu_order);
    
    return NextResponse.json({
      success: true,
      categories
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await readDb();
    const data = await req.json();
    
    if (!data.name || !data.slug) {
      return NextResponse.json({ success: false, error: 'Missing name or slug' }, { status: 400 });
    }
    
    if (db.categories.some(c => c.slug === data.slug)) {
      return NextResponse.json({ success: false, error: 'Category slug already exists' }, { status: 400 });
    }
    
    // Note: This would need to sync with WooCommerce via admin panel
    // For now, return error as storefront shouldn't create categories directly
    return NextResponse.json({ 
      success: false, 
      error: 'Categories should be created via admin panel' 
    }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
