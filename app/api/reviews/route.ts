import { NextRequest, NextResponse } from 'next/server';
import { getWooCommerce } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const api = getWooCommerce();
    const response = await api.get('products/reviews', { product: [productId], status: 'approved' });

    return NextResponse.json({ success: true, reviews: response.data });
  } catch (error: any) {
    console.error('Failed to fetch reviews:', error.response?.data || error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, review, reviewer, reviewer_email, rating } = body;

    if (!product_id || !review || !reviewer || !reviewer_email || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const autoApprove = process.env.NEXT_AUTO_APPROVE_REVIEWS === 'true';
    
    const api = getWooCommerce();
    const response = await api.post('products/reviews', {
      product_id: parseInt(product_id, 10),
      review,
      reviewer,
      reviewer_email,
      rating: parseInt(rating, 10),
      status: autoApprove ? 'approved' : 'hold'
    });

    return NextResponse.json({ success: true, review: response.data, status: autoApprove ? 'approved' : 'hold' });
  } catch (error: any) {
    console.error('Failed to post review:', error.response?.data || error);
    return NextResponse.json({ success: false, error: error.response?.data?.message || 'Failed to submit review' }, { status: 500 });
  }
}
