import React from 'react';
import Link from 'next/link';
import { readDb } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, ClipboardList, ShoppingBag, Truck, Calendar, MapPin, CreditCard, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface SuccessPageProps {
  params: Promise<{ orderNum: string }>;
}

export default async function CheckoutSuccessPage({ params }: SuccessPageProps) {
  const { orderNum } = await params;
  const db = await readDb();
  
  // Find order
  const order = db.orders.find(o => o.order_number === orderNum);
  if (!order) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center border border-red-100">
            ❌
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Order Reference Missing</h1>
            <p className="text-xs text-zinc-500 mt-1">We could not pull that specific order code details.</p>
          </div>
          <Link href="/shop" className="bg-[#FE5733] text-white rounded-full text-xs font-bold px-6 py-2.5">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const orderItems = db.orderItems.filter(item => item.order_id === order.id);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex-grow space-y-8">
        
        {/* 1. STATE SUMMARIES BANNER */}
        <div className="bg-white border border-zinc-100 rounded-[32px] p-8 text-center space-y-4 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md shadow-green-550/10">
            <CheckCircle2 className="w-9 h-9 fill-green-500 text-white" />
          </div>
          
          <div className="space-y-1.5">
            <span className="text-[10px] bg-zinc-100 text-zinc-700 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold font-mono">Order {order.payment_method === 'cash_on_delivery' ? 'Confirmed' : 'Submitted'}</span>
            <h1 className="text-xl md:text-2xl font-black text-zinc-950 font-sans tracking-tight">Thank You for Your Order!</h1>
            <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">Your order statement reference is <strong className="text-zinc-950 font-mono text-xs">{order.order_number}</strong>. We are prepping your style details.</p>
          </div>

          <div className="border-t border-zinc-100 pt-4 text-center">
            {order.payment_method === 'cash_on_delivery' ? (
              <div className="bg-green-50/50 border border-green-200/60 p-4 rounded-2xl max-w-md mx-auto flex gap-3 items-center text-left">
                <Truck className="w-5 h-5 text-green-600 flex-none" />
                <p className="text-xs text-green-800 leading-relaxed font-medium">Order Status: <strong>Order Confirmed — pay on delivery.</strong> We will dispatch your shipment package immediately to {order.shipping_city}.</p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl max-w-md mx-auto flex gap-3 items-start text-left">
                <Clock className="w-5 h-5 text-amber-600 flex-none mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed font-medium">Order Status: <strong>Awaiting payment verification by admin.</strong> We have logged transaction ID: <strong className="font-mono text-[11px]">{order.payment_txn_id}</strong>. Once our audit verify matches, your order starts packing!</p>
              </div>
            )}
          </div>
        </div>

        {/* 2. ORDER SPEC DETAILS CARD */}
        <div className="bg-white border border-zinc-100 rounded-[32px] p-6 md:p-8 space-y-6 shadow-[0_2px_15px_rgba(0,0,0,0.01)] font-sans">
          <h2 className="text-sm font-black text-zinc-950 uppercase tracking-widest pb-3 border-b border-zinc-150">Order Invoice Statement</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Meta */}
            <div className="space-y-3.5">
              <div className="flex gap-2.5 items-center">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Date Ordered</p>
                  <p className="text-zinc-800 font-bold">{new Date(order.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2.5 items-center">
                <CreditCard className="w-4 h-4 text-zinc-400" />
                <div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Payment Method</p>
                  <p className="text-zinc-805 font-bold uppercase">{order.payment_method.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </div>

            {/* Ship address */}
            <div className="flex gap-2.5 items-start">
              <MapPin className="w-4 h-4 text-zinc-400 mt-0.5" />
              <div>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Recipient & Address</p>
                <p className="text-zinc-850 font-bold">{order.customer_name} ({order.customer_phone})</p>
                <p className="text-zinc-550 leading-relaxed mt-0.5">{order.shipping_address}, {order.shipping_city}, {order.shipping_district}</p>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="pt-4 border-t border-zinc-100 space-y-3">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Purchased Outfits</p>
            <div className="divide-y divide-zinc-50">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-3.5 items-center py-3 first:pt-0 last:pb-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image_url} alt={item.name} className="w-10 h-13 object-cover rounded bg-zinc-50 border border-zinc-50 flex-none" />
                  <div className="flex-1 min-w-0 font-medium">
                    <p className="text-xs font-semibold text-zinc-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-zinc-400">Qty: {item.quantity} | Size: {item.size} | Color: {item.color}</p>
                  </div>
                  <span className="text-xs font-extrabold text-zinc-950 flex-none font-mono">Rs {item.total_price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing aggregates */}
          <div className="border-t border-zinc-100 pt-4 flex flex-col items-end gap-1.8 text-xs font-semibold text-zinc-500">
            <div className="flex justify-between w-full max-w-xs">
              <span>Subtotal Amount</span>
              <span className="text-zinc-900 font-mono">Rs {order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between w-full max-w-xs text-red-500">
                <span>Promotional Discount</span>
                <span className="font-mono">-Rs {order.discount_amount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between w-full max-w-xs">
              <span>Boutique Shipping</span>
              <span className="text-zinc-900 font-mono">Rs {order.shipping_fee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between w-full max-w-xs text-sm text-zinc-950 font-black border-t border-zinc-150 pt-2.5 mt-1.2">
              <span>Final Total NPR</span>
              <span className="text-[#FE5733] font-mono text-base">Rs {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 3. QUICK CHANNELS ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
          <Link
            href="/orders"
            className="bg-zinc-950 hover:bg-zinc-900 text-white rounded-full font-bold h-11.5 text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" /> Track Order Status
          </Link>
          <Link
            href="/shop"
            className="bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-700 rounded-full font-bold h-11.5 text-xs flex items-center justify-center gap-1.3 transition-all cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
