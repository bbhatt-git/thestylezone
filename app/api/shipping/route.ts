import { NextRequest, NextResponse } from 'next/server';
import { getCountries, getDistricts, getMunicipalitiesByDistrict, calculateShippingCost } from '@/lib/shipping-api';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'countries') {
      const countries = await getCountries();
      return NextResponse.json({ success: true, countries });
    }

    if (action === 'districts') {
      const districts = await getDistricts();
      return NextResponse.json({ success: true, districts });
    }

    if (action === 'municipalities') {
      const districtId = searchParams.get('districtId');
      if (!districtId) {
        return NextResponse.json({ success: false, error: 'District ID is required' }, { status: 400 });
      }
      const municipalities = await getMunicipalitiesByDistrict(districtId);
      return NextResponse.json({ success: true, municipalities });
    }

    if (action === 'calculate') {
      const countryCode = searchParams.get('countryCode');
      const districtName = searchParams.get('districtName');
      const municipalityName = searchParams.get('municipalityName');

      if (!countryCode) {
        return NextResponse.json({ success: false, error: 'Country code is required' }, { status: 400 });
      }

      const shippingCost = await calculateShippingCost(
        countryCode,
        districtName || undefined,
        municipalityName || undefined
      );
      return NextResponse.json({ success: true, shippingCost });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Shipping API error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
