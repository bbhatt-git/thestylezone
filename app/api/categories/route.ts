import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb, generateId, Category } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const db = await readDb();
    const categories = db.categories.filter(c => c.is_active);
    
    // Sort by sort_order
    categories.sort((a, b) => a.sort_order - b.sort_order);
    
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
    
    const newCategory: Category = {
      id: generateId(),
      name: data.name,
      slug: data.slug,
      parent_id: data.parent_id || null,
      image_url: data.image_url || null,
      gender: data.gender || 'unisex',
      sort_order: parseInt(data.sort_order || '0', 10),
      is_active: data.is_active !== undefined ? data.is_active : true,
      created_at: new Date().toISOString()
    };
    
    db.categories.push(newCategory);
    await saveDb(db);
    
    return NextResponse.json({
      success: true,
      category: newCategory
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
