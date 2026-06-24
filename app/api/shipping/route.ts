import { NextRequest, NextResponse } from 'next/server';
import { getShippingCosts, calculateShippingCost } from '@/lib/simple-shipping-api';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'districts') {
      const districts = await getShippingCosts();
      return NextResponse.json({ success: true, districts });
    }

    if (action === 'calculate') {
      const countryCode = searchParams.get('countryCode');
      const districtName = searchParams.get('districtName');

      if (!countryCode) {
        return NextResponse.json({ success: false, error: 'Country code is required' }, { status: 400 });
      }

      const shippingCost = await calculateShippingCost(
        countryCode,
        districtName || undefined
      );
      return NextResponse.json({ success: true, shippingCost });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Shipping API error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
