import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb, Order, Notification, generateId } from '@/lib/db';
import { getWooCommerce } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = await readDb();
    
    // First try to find in local database
    const order = db.orders.find(o => o.id === id || o.order_number === id);
    if (order) {
      const items = db.orderItems.filter(item => item.order_id === order.id);
      return NextResponse.json({
        success: true,
        order: {
          ...order,
          items
        }
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      });
    }
    
    // If not found in local database, try fetching from WooCommerce
    try {
      const api = getWooCommerce();
      const response = await api.get(`orders/${id}`);
      const wcOrder = response.data;
      
      if (wcOrder) {
        // Transform WooCommerce order to our format
        const transformedOrder = {
          id: `wc_${wcOrder.id}`,
          order_number: wcOrder.number || `WC-${wcOrder.id}`,
          status: wcOrder.status,
          payment_method: wcOrder.payment_method,
          payment_status: wcOrder.payment_method === 'cod' ? 'pending' : wcOrder.payment_status,
          payment_txn_id: wcOrder.transaction_id || null,
          subtotal: parseFloat(wcOrder.total) - parseFloat(wcOrder.shipping_total || '0'),
          discount_amount: parseFloat(wcOrder.discount_total || '0'),
          shipping_fee: parseFloat(wcOrder.shipping_total || '0'),
          total: parseFloat(wcOrder.total),
          coupon_code: wcOrder.coupon_lines?.[0]?.code || null,
          customer_name: wcOrder.billing?.first_name && wcOrder.billing?.last_name 
            ? `${wcOrder.billing.first_name} ${wcOrder.billing.last_name}` 
            : wcOrder.billing?.first_name || wcOrder.billing?.last_name || 'Guest',
          customer_phone: wcOrder.billing?.phone || '',
          customer_email: wcOrder.billing?.email || null,
          shipping_address: `${wcOrder.billing?.address_1} ${wcOrder.billing?.address_2 || ''}`.trim(),
          municipality: wcOrder.billing?.city || '',
          wardNo: wcOrder.billing?.postcode || '',
          notes: wcOrder.customer_note || null,
          admin_note: null,
          shipped_at: null,
          delivered_at: null,
          created_at: wcOrder.date_created,
          updated_at: wcOrder.date_modified,
          // Transform line items
          items: wcOrder.line_items?.map((item: any) => ({
            id: `wc_item_${item.id}`,
            order_id: `wc_${wcOrder.id}`,
            product_id: `wc_product_${item.product_id}`,
            variant_id: `wc_variant_${item.variation_id || item.product_id}`,
            name: item.name,
            image_url: item.image?.src || 'https://picsum.photos/seed/default/300/400',
            size: 'M', // Default size since WooCommerce doesn't always send this
            color: 'Default', // Default color
            quantity: item.quantity,
            unit_price: parseFloat(item.price),
            total_price: parseFloat(item.total)
          })) || []
        };
        
        return NextResponse.json({
          success: true,
          order: transformedOrder
        }, {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
          }
        });
      }
    } catch (wcError) {
      console.error('WooCommerce fetch error:', wcError);
    }
    
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
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
