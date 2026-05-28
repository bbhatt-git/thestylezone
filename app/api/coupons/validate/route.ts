import { NextRequest, NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { code, subtotal } = data;
    
    if (!code) {
      return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 });
    }
    
    const db = await readDb();
    
    // Find matching active coupon
    const coupon = db.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    
    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Coupon code is invalid' });
    }
    
    if (!coupon.is_active) {
      return NextResponse.json({ success: false, error: 'This coupon is no longer active' });
    }
    
    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ success: false, error: 'This coupon has expired' });
    }
    
    // Check max usages
    if (coupon.max_uses !== null && coupon.max_uses !== undefined && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ success: false, error: 'This coupon has reached its maximum usage limit' });
    }
    
    // Check minimum order value
    if (subtotal < coupon.min_order_value) {
      return NextResponse.json({ 
        success: false, 
        error: `Minimum order value of Rs ${coupon.min_order_value} required to apply this coupon. Your subtotal is Rs ${subtotal}.` 
      });
    }
    
    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discount_value) / 100);
    } else {
      discountAmount = coupon.discount_value;
    }
    
    // Caps discount to subtotal
    discountAmount = Math.min(discountAmount, subtotal);
    
    return NextResponse.json({
      success: true,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discountAmount,
      description: coupon.description
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
