import { NextRequest, NextResponse } from 'next/server';
import { getWooCommerce } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const api = getWooCommerce();
    
    const response = await api.get('products', { slug });
    
    if (!response.data || response.data.length === 0) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    
    const product = response.data[0];
    
    // Fetch variations if it's a variable product
    let variations = [];
    if (product.type === 'variable') {
      const variationsResponse = await api.get(`products/${product.id}/variations`);
      variations = variationsResponse.data || [];
    }
    
    return NextResponse.json({
      success: true,
      product: {
        ...product,
        variations
      }
    });
  } catch (err: any) {
    console.error('Error fetching product:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
