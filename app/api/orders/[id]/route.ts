import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb, Order, Notification, generateId } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await readDb();
    
    // Find order by ID or order_number
    const order = db.orders.find(o => o.id === id || o.order_number === id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    
    const items = db.orderItems.filter(item => item.order_id === order.id);
    
    return NextResponse.json({
      success: true,
      order: {
        ...order,
        items
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await readDb();
    const data = await req.json(); // { status, payment_status, admin_note }
    
    const orderIndex = db.orders.findIndex(o => o.id === id || o.order_number === id);
    if (orderIndex === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    
    const order = db.orders[orderIndex];
    const nowStr = new Date().toISOString();
    
    // Check for payment verification action or general status changes
    if (data.status) {
      order.status = data.status;
      
      if (data.status === 'shipped') {
        order.shipped_at = nowStr;
      } else if (data.status === 'delivered') {
        order.delivered_at = nowStr;
        if (order.payment_method === 'cash_on_delivery') {
          order.payment_status = 'verified'; // paid on delivery!
        }
      }
    }
    
    if (data.payment_status) {
      order.payment_status = data.payment_status;
    }
    
    if (data.admin_note !== undefined) {
      order.admin_note = data.admin_note;
    }
    
    order.updated_at = nowStr;
    
    // Create notifications for the admin regarding transitions
    if (data.status === 'payment_verified' || data.payment_status === 'verified') {
      order.status = 'confirmed';
      order.payment_status = 'verified';
    }
    
    db.orders[orderIndex] = order;
    
    // Push simple notification
    const transitionNotification: Notification = {
      id: generateId(),
      type: 'low_stock', // Alert type
      title: `Order ${order.order_number} Updated`,
      body: `Status changed to: ${order.status.toUpperCase()} (${order.payment_status.toUpperCase()})`,
      data: { orderId: order.id, status: order.status },
      is_read: false,
      created_at: nowStr
    };
    db.notifications.push(transitionNotification);
    
    await saveDb(db);
    
    return NextResponse.json({
      success: true,
      order
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
