import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb, generateId, Order, OrderItem, Notification } from '@/lib/db';

function calculateShipping(district: string): number {
  const normalized = district.trim().toLowerCase();
  if (normalized === 'kanchanpur') return 0;
  
  const sudurpashchim = ['dadeldhura', 'baitadi', 'darchula', 'bajhang', 'bajura', 'achham', 'doti', 'kailali'];
  if (sudurpashchim.includes(normalized)) return 80;
  
  return 150;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionToken = searchParams.get('sessionToken');
    
    if (!sessionToken) {
      return NextResponse.json({ success: false, error: 'Session token required' }, { status: 400 });
    }
    
    const db = await readDb();
    
    // Find all orders for this guest session token
    const orders = db.orders.filter(o => o.session_token === sessionToken);
    
    // Sort orders from newest to oldest
    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Include items for each order
    const ordersWithItems = orders.map(o => {
      const items = db.orderItems.filter(item => item.order_id === o.id);
      return {
        ...o,
        items
      };
    });
    
    return NextResponse.json({
      success: true,
      orders: ordersWithItems
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await readDb();
    const data = await req.json();
    
    const {
      sessionToken,
      items,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      municipality,
      wardNo,
      paymentMethod,
      paymentTxnId,
      couponCode,
      notes
    } = data;
    
    // 1. Basic validation
    if (!sessionToken || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart items and session token are required' }, { status: 400 });
    }
    if (!customerName || !customerPhone || !shippingAddress || !municipality || !wardNo) {
      return NextResponse.json({ success: false, error: 'Shipping details are incomplete' }, { status: 400 });
    }
    if (!['esewa', 'khalti', 'cash_on_delivery'].includes(paymentMethod)) {
      return NextResponse.json({ success: false, error: 'Invalid payment method' }, { status: 400 });
    }
    if (paymentMethod !== 'cash_on_delivery' && !paymentTxnId) {
      return NextResponse.json({ success: false, error: `Transaction ID is required for ${paymentMethod}` }, { status: 400 });
    }
    
    // 2. Validate phone number (Nepal format 98 or 97 and 10 digits)
    const phoneRegex = /^(98|97)\d{8}$/;
    if (!phoneRegex.test(customerPhone)) {
      return NextResponse.json({ success: false, error: 'Invalid Nepal phone format. Use 98XXXXXXXX or 97XXXXXXXX' }, { status: 400 });
    }
    
    // 3. Recalculate subtotal on the server side (NEVER trust client pricing)
    let calculatedSubtotal = 0;
    const orderItemsToSave: OrderItem[] = [];
    const orderId = generateId();
    
    for (const item of items) {
      const product = db.products.find(p => p.id === item.productId);
      if (!product) {
        return NextResponse.json({ success: false, error: `Product not found: ${item.name}` }, { status: 404 });
      }
      
      const variant = db.variants.find(v => v.id === item.variantId);
      if (!variant) {
        // Also check if there are any variants for this product at all
        const productVariants = db.variants.filter(v => v.product_id === item.productId);
        if (productVariants.length === 0) {
          return NextResponse.json({ 
            success: false, 
            error: `No variants found for product: ${item.name}. Please contact support.` 
          }, { status: 404 });
        }
        return NextResponse.json({ 
          success: false, 
          error: `Selected variant not found for: ${item.name}. Available variants: ${productVariants.map(v => `${v.size}/${v.color}`).join(', ')}` 
        }, { status: 404 });
      }
      
      // Stock check
      if (variant.stock < item.quantity) {
        return NextResponse.json({ success: false, error: `Insufficient stock for ${item.name} in size ${variant.size} - ${variant.color}. Only ${variant.stock} left.` }, { status: 400 });
      }
      
      const activeUnitPrice = product.sale_price !== null && product.sale_price !== undefined ? product.sale_price : product.base_price;
      // Note: price_delta can adjust the unit price (e.g. XL adds Rs 100)
      const adjustedPrice = activeUnitPrice + (variant.price_delta || 0);
      
      calculatedSubtotal += adjustedPrice * item.quantity;
      
      orderItemsToSave.push({
        id: generateId(),
        order_id: orderId,
        product_id: product.id,
        variant_id: variant.id,
        name: product.name,
        image_url: product.images[0] || 'https://picsum.photos/seed/defaultitem/300/400',
        size: variant.size,
        color: variant.color,
        quantity: item.quantity,
        unit_price: adjustedPrice,
        total_price: adjustedPrice * item.quantity
      });
    }
    
    // 4. Validate coupon discount
    let discountAmount = 0;
    let validatedCouponCode: string | null = null;
    
    if (couponCode) {
      const coupon = db.coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.is_active);
      if (coupon) {
        // Date check
        const isNotExpired = !coupon.expires_at || new Date(coupon.expires_at).getTime() >= Date.now();
        const minValMet = calculatedSubtotal >= coupon.min_order_value;
        const limitNotMet = !coupon.max_uses || coupon.used_count < coupon.max_uses;
        
        if (isNotExpired && minValMet && limitNotMet) {
          validatedCouponCode = coupon.code.toUpperCase();
          if (coupon.discount_type === 'percentage') {
            discountAmount = Math.round((calculatedSubtotal * coupon.discount_value) / 100);
          } else {
            discountAmount = coupon.discount_value;
          }
          // Clamp discount so it doesn't exceed subtotal
          discountAmount = Math.min(discountAmount, calculatedSubtotal);
          
          // Increment used count
          coupon.used_count += 1;
        }
      }
    }
    
    // 5. Shipping Fee Calculation
    const shippingFee = 0; // Free shipping for Kanchanpur
    const total = calculatedSubtotal - discountAmount + shippingFee;
    
    // 6. Deduct inventory stocks
    for (const item of orderItemsToSave) {
      const variant = db.variants.find(v => v.id === item.variant_id);
      if (variant) {
        variant.stock -= item.quantity;
      }
      const product = db.products.find(p => p.id === item.product_id);
      if (product) {
        product.stock_total -= item.quantity;
      }
    }
    
    // 7. Status transitions
    const orderStatus = paymentMethod === 'cash_on_delivery' 
      ? 'confirmed' 
      : 'payment_submitted'; // Awaiting verification
      
    const paymentStatus = paymentMethod === 'cash_on_delivery'
      ? 'pending' // Paid later
      : 'submitted'; // QR txn ID provided
      
    // Generate order number like TSZ-XXXXXXXX
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randCode = '';
    for (let i = 0; i < 8; i++) {
      randCode += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    const orderNumber = `TSZ-${randCode}`;
    
    const nowStr = new Date().toISOString();
    
    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      session_token: sessionToken,
      status: orderStatus,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      payment_txn_id: paymentTxnId || null,
      subtotal: calculatedSubtotal,
      discount_amount: discountAmount,
      shipping_fee: shippingFee,
      total,
      coupon_code: validatedCouponCode,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail || null,
      shipping_address: shippingAddress,
      municipality: municipality,
      wardNo: wardNo,
      notes: notes || null,
      admin_note: null,
      created_at: nowStr,
      updated_at: nowStr
    };
    
    // 8. Create admin notification
    const notification: Notification = {
      id: generateId(),
      type: paymentMethod === 'cash_on_delivery' ? 'new_order' : 'payment_submitted',
      title: paymentMethod === 'cash_on_delivery' ? 'New COD Order Confirmed' : 'New QR Payment Awaiting Verification',
      body: `${customerName} placed order ${orderNumber} for Rs ${total}. Payment: ${paymentMethod.toUpperCase()}${paymentTxnId ? ' (Txn ID: ' + paymentTxnId + ')' : ''}`,
      data: { orderId, orderNumber, total },
      is_read: false,
      created_at: nowStr
    };
    
    // Save everything in one transaction locally
    db.orders.push(newOrder);
    db.orderItems.push(...orderItemsToSave);
    db.notifications.push(notification);
    await saveDb(db);

    // Sync to WooCommerce if configured
    try {
      const { woocommerce } = await import('@/lib/woocommerce');
      if (woocommerce) {
        const wcLineItems = orderItemsToSave.map(item => ({
          name: `${item.name} (${item.color} - ${item.size})`,
          product_id: parseInt(item.product_id.replace(/\D/g, '')) || 0, // Fallback if local product IDs aren't integers
          quantity: item.quantity,
          total: item.total_price.toString()
        }));

        await woocommerce.post("orders", {
          payment_method: paymentMethod,
          payment_method_title: paymentMethod.replace(/_/g, ' ').toUpperCase(),
          set_paid: paymentMethod !== 'cash_on_delivery',
          billing: {
            first_name: customerName,
            last_name: '',
            address_1: shippingAddress,
            city: municipality,
            state: 'Kanchanpur',
            postcode: wardNo,
            country: 'NP',
            email: customerEmail || 'noemail@example.com',
            phone: customerPhone
          },
          shipping: {
            first_name: customerName,
            last_name: '',
            address_1: shippingAddress,
            city: municipality,
            state: 'Kanchanpur',
            postcode: wardNo,
            country: 'NP'
          },
          line_items: wcLineItems,
          customer_note: notes,
          meta_data: [
            {
              key: "session_token",
              value: sessionToken
            },
            {
              key: "payment_txn_id",
              value: paymentTxnId || ''
            },
            {
              key: "municipality",
              value: municipality
            },
            {
              key: "ward_no",
              value: wardNo.toString()
            },
            {
              key: "order_source",
              value: "nextjs_frontend"
            }
          ],
          fee_lines: [
            {
              name: "Shipping",
              total: shippingFee.toString()
            }
          ]
        });
        console.log("Order successfully created in WooCommerce");
      }
    } catch (wcError) {
      console.error("Failed to sync order to WooCommerce:", wcError);
    }
    
    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
      total,
      shippingFee,
      discountAmount,
      status: orderStatus
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
