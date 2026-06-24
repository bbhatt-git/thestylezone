import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb, generateId, Order, OrderItem, Notification } from '@/lib/db';
import { calculateShippingCost } from '@/lib/shipping-api';

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
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
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
      country,
      district,
      paymentMethod,
      paymentTxnId,
      couponCode,
      notes
    } = data;
    
    // 1. Basic validation
    if (!sessionToken || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart items and session token are required' }, { status: 400 });
    }
    if (!customerName || !customerPhone || !shippingAddress || !country) {
      return NextResponse.json({ success: false, error: 'Shipping details are incomplete' }, { status: 400 });
    }
    // For Nepal, require district
    if (country === 'NP' && !district) {
      return NextResponse.json({ success: false, error: 'District is required for Nepal orders' }, { status: 400 });
    }
    if (!['esewa', 'khalti', 'cash_on_delivery'].includes(paymentMethod)) {
      return NextResponse.json({ success: false, error: 'Invalid payment method' }, { status: 400 });
    }
    if (paymentMethod !== 'cash_on_delivery' && !paymentTxnId) {
      return NextResponse.json({ success: false, error: `Transaction ID is required for ${paymentMethod}` }, { status: 400 });
    }
    
    // 2. Validate phone number (Nepal format 98 or 97 and 10 digits for Nepal orders)
    if (country === 'NP') {
      const phoneRegex = /^(98|97)\d{8}$/;
      if (!phoneRegex.test(customerPhone)) {
        return NextResponse.json({ success: false, error: 'Invalid Nepal phone format. Use 98XXXXXXXX or 97XXXXXXXX' }, { status: 400 });
      }
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
      
      // For simple products, we may not have variations - allow order if product exists
      const productVariations = db.variations.filter(v => v.product_id === item.productId);
      
      let variation = null;
      if (productVariations.length > 0) {
        // Product has variations - try to find the specific one
        variation = db.variations.find(v => v.id === item.variantId);
        if (!variation) {
          // Try to find a matching variation by attributes as fallback
          variation = productVariations.find(v => {
            const sizeAttr = v.attributes.find(a => a.name.toLowerCase() === 'size');
            const colorAttr = v.attributes.find(a => a.name.toLowerCase() === 'color');
            return sizeAttr?.option === item.size && colorAttr?.option === item.color;
          });
        }
        if (!variation) {
          return NextResponse.json({ 
            success: false, 
            error: `Selected variation not found for: ${item.name}. Available variations: ${productVariations.map(v => v.attributes.map(a => `${a.name}:${a.option}`).join(', ')).join('; ')}` 
          }, { status: 404 });
        }
      } else {
        // Simple product without variations - create a virtual variation for ordering
        variation = {
          id: item.variantId || `simple_${product.id}`,
          product_id: product.id,
          attributes: [{ name: 'size', option: item.size || 'M' }, { name: 'color', option: item.color || 'Default' }],
          stock_quantity: product.stock_quantity || 10,
          price: product.regular_price || '0',
          regular_price: product.regular_price || '0'
        };
      }
      
      // Stock check
      const availableStock = productVariations.length > 0 ? (variation.stock_quantity || 0) : (product.stock_quantity || 10);
      if (availableStock < item.quantity) {
        const sizeAttr = variation.attributes.find(a => a.name.toLowerCase() === 'size');
        const colorAttr = variation.attributes.find(a => a.name.toLowerCase() === 'color');
        return NextResponse.json({ success: false, error: `Insufficient stock for ${item.name} in size ${sizeAttr?.option || 'N/A'} - ${colorAttr?.option || 'N/A'}. Only ${availableStock} left.` }, { status: 400 });
      }
      
      const regularPrice = parseFloat(product.regular_price || '0');
      const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
      const activeUnitPrice = salePrice || regularPrice;
      // For variations, use their own price if available
      const variationPrice = variation.price ? parseFloat(variation.price) : activeUnitPrice;
      const adjustedPrice = variationPrice;
      
      calculatedSubtotal += adjustedPrice * item.quantity;
      
      const sizeAttr = variation.attributes.find(a => a.name.toLowerCase() === 'size');
      const colorAttr = variation.attributes.find(a => a.name.toLowerCase() === 'color');
      
      orderItemsToSave.push({
        id: generateId(),
        order_id: orderId,
        product_id: String(product.id),
        variant_id: String(variation.id),
        name: product.name,
        image_url: product.images[0]?.src || 'https://picsum.photos/seed/defaultitem/300/400',
        size: sizeAttr?.option || 'M',
        color: colorAttr?.option || 'Default',
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
    
    // 5. Shipping Fee Calculation using Supabase
    let shippingFee = 0;
    let districtName = '';
    
    try {
      if (country === 'NP' && district) {
        // Fetch district name from Supabase
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );
        
        const { data: districtData } = await supabase
          .from('districts')
          .select('name')
          .eq('id', district)
          .single();
        
        if (districtData) districtName = districtData.name;
      }
      
      shippingFee = await calculateShippingCost(country, districtName || undefined);
    } catch (error) {
      console.error('Error calculating shipping cost:', error);
      // Fallback to default
      shippingFee = country === 'NP' ? 200 : 2500;
    }
    
    const total = calculatedSubtotal - discountAmount + shippingFee;
    
    // 6. Deduct inventory stocks
    for (const item of orderItemsToSave) {
      const variation = db.variations.find(v => String(v.id) === item.variant_id);
      if (variation && variation.stock_quantity !== undefined) {
        variation.stock_quantity -= item.quantity;
      }
      const product = db.products.find(p => String(p.id) === item.product_id);
      if (product && product.stock_quantity !== undefined) {
        product.stock_quantity -= item.quantity;
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
      country: country,
      district: district || null,
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
          product_id: parseInt(item.product_id) || 0,
          quantity: item.quantity,
          total: item.total_price.toString()
        }));

        const wcOrderData = {
          payment_method: paymentMethod === 'cash_on_delivery' ? 'cod' : paymentMethod,
          payment_method_title: paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : paymentMethod.replace(/_/g, ' ').toUpperCase(),
          set_paid: paymentMethod !== 'cash_on_delivery',
          status: 'pending',
          billing: {
            first_name: customerName.split(' ')[0] || customerName,
            last_name: customerName.split(' ').slice(1).join(' ') || '',
            address_1: shippingAddress,
            city: districtName || '',
            state: 'Sudurpashchim',
            country: 'NP',
            email: customerEmail || `customer${Date.now()}@example.com`,
            phone: customerPhone
          },
          shipping: {
            first_name: customerName.split(' ')[0] || customerName,
            last_name: customerName.split(' ').slice(1).join(' ') || '',
            address_1: shippingAddress,
            city: districtName || '',
            state: 'Sudurpashchim',
            country: 'NP'
          },
          line_items: wcLineItems,
          customer_note: notes || '',
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
              key: "district",
              value: district
            },
            {
              key: "order_source",
              value: "nextjs_frontend"
            }
          ]
        };

        // Only add fee_lines if there's a shipping fee
        if (shippingFee > 0) {
          (wcOrderData as any).fee_lines = [{
            name: "Shipping",
            total: shippingFee.toString()
          }];
        }

        await woocommerce.post("orders", wcOrderData);
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
      status: orderStatus,
      // Include full order details for checkout success page
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail || null,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      payment_status: paymentStatus,
      payment_txn_id: paymentTxnId || null,
      subtotal: calculatedSubtotal,
      coupon_code: couponCode || null,
      notes: notes || null,
      created_at: new Date().toISOString(),
      items: orderItemsToSave.map(item => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        name: item.name,
        image_url: item.image_url,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }))
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
