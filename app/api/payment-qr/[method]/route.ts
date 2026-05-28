import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ method: string }> }) {
  try {
    const { method } = await params;
    if (method !== 'esewa' && method !== 'khalti') {
      return NextResponse.json({ success: false, error: 'Invalid payment method' }, { status: 400 });
    }
    
    const db = await readDb();
    const config = db.paymentQrConfigs.find(c => c.method === method);
    
    if (!config) {
      return NextResponse.json({ success: false, error: 'Payment configuration not found' }, { status: 404 });
    }
    
    return NextResponse.json(config);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ method: string }> }) {
  try {
    const { method } = await params;
    if (method !== 'esewa' && method !== 'khalti') {
      return NextResponse.json({ success: false, error: 'Invalid payment method' }, { status: 400 });
    }
    
    const db = await readDb();
    const configIndex = db.paymentQrConfigs.findIndex(c => c.method === method);
    
    if (configIndex === -1) {
      return NextResponse.json({ success: false, error: 'Payment configuration not found' }, { status: 404 });
    }
    
    const data = await req.json();
    const config = db.paymentQrConfigs[configIndex];
    
    const updatedConfig = {
      ...config,
      qr_image_url: data.qr_image_url || config.qr_image_url,
      account_name: data.account_name || config.account_name,
      account_id: data.account_id !== undefined ? data.account_id : config.account_id,
      instructions: data.instructions || config.instructions,
      is_active: data.is_active !== undefined ? data.is_active : config.is_active,
      updated_at: new Date().toISOString()
    };
    
    db.paymentQrConfigs[configIndex] = updatedConfig;
    await saveDb(db);
    
    return NextResponse.json({
      success: true,
      config: updatedConfig
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
