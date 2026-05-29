import React from 'react';
import Link from 'next/link';
import { readDb, getOrderByNumber, getOrderItems } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, ClipboardList, ShoppingBag, Truck, Calendar, MapPin, CreditCard, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface SuccessPageProps {
  params: Promise<{ orderNum: string }>;
}

export default async function CheckoutSuccessPage({ params }: SuccessPageProps) {
  const { orderNum } = await params;
  
  // Try to get order by order number using SQLite first
  const order = getOrderByNumber(orderNum);
  
  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center border border-amber-100">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#121212]">Order Not Found</h1>
            <p className="text-sm text-stone-500 mt-2 max-w-md">
              We couldn&apos;t find order <span className="font-mono text-[#FE5733]">{orderNum}</span> in our system. 
              Your order may still be processing. Please check your orders page or contact support.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/orders" className="bg-[#121212] text-white rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#FE5733] transition-colors">
              View My Orders
            </Link>
            <Link href="/shop" className="border border-[#121212] text-[#121212] rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#121212] hover:text-white transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const orderItems = getOrderItems(order.id);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex-grow space-y-8">
        
        {/* 1. SUCCESS BANNER */}
        <div className="bg-white border border-stone-200 rounded-lg p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-[#FE5733] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          
          <div className="space-y-2">
            <span className="text-[10px] bg-[#F5F5F0] text-[#121212] px-3 py-1 rounded-full uppercase tracking-wider font-bold font-mono">
              {order.payment_method === 'cash_on_delivery' ? 'Order Confirmed' : 'Order Submitted'}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-[#121212] font-display tracking-tight">Thank You for Your Order!</h1>
            <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              Order <span className="font-mono text-[#FE5733] font-bold">{order.order_number}</span> has been received. We&apos;re preparing your items.
            </p>
          </div>

          <div className="border-t border-stone-100 pt-4">
            {order.payment_method === 'cash_on_delivery' ? (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-green-800 font-medium text-center">
                  <strong className="block mb-1">Order Confirmed — Pay on Delivery</strong>
                  We&apos;ll dispatch your order to {order.municipality} right away.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg max-w-md mx-auto">
                <p className="text-sm text-amber-800 font-medium text-center">
                  <strong className="block mb-1">Awaiting Payment Verification</strong>
                  Transaction ID: <span className="font-mono">{order.payment_txn_id}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. ORDER DETAILS CARD */}
        <div className="bg-white border border-stone-200 rounded-lg p-6 md:p-8 space-y-6 shadow-sm">
          <h2 className="text-sm font-black text-[#121212] uppercase tracking-widest pb-3 border-b border-stone-100">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Meta */}
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <Calendar className="w-5 h-5 text-stone-400" />
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Date Ordered</p>
                  <p className="text-[#121212] font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <CreditCard className="w-5 h-5 text-stone-400" />
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Payment Method</p>
                  <p className="text-[#121212] font-bold uppercase">{order.payment_method.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </div>

            {/* Ship address */}
            <div className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 text-stone-400 mt-0.5" />
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Shipping Address</p>
                <p className="text-[#121212] font-bold">{order.customer_name}</p>
                <p className="text-stone-500 text-sm mt-0.5">{order.shipping_address}, {order.municipality}, Ward {order.wardNo}</p>
                <p className="text-stone-400 text-xs">{order.customer_phone}</p>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="pt-4 border-t border-stone-100 space-y-4">
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Order Items</p>
            <div className="divide-y divide-stone-50">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center py-4 first:pt-0 last:pb-0">
                  <img src={item.image_url} alt={item.name} className="w-14 h-16 object-cover rounded bg-stone-50 border border-stone-100 flex-none" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#121212]">{item.name}</p>
                    <p className="text-xs text-stone-400">Qty: {item.quantity} | Size: {item.size} | Color: {item.color}</p>
                  </div>
                  <span className="text-sm font-bold text-[#121212] font-mono">Rs {item.total_price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing aggregates */}
          <div className="border-t border-stone-100 pt-4 flex flex-col items-end gap-2 text-sm">
            <div className="flex justify-between w-full max-w-xs">
              <span className="text-stone-500">Subtotal</span>
              <span className="text-[#121212] font-mono">Rs {order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between w-full text-[#FE5733]">
                <span>Discount</span>
                <span className="font-mono">-Rs {order.discount_amount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between w-full text-stone-500">
              <span>Shipping</span>
              <span className="text-[#121212] font-mono">Rs {order.shipping_fee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between w-full max-w-xs text-lg font-black text-[#121212] border-t border-stone-100 pt-2 mt-2">
              <span>Total</span>
              <span className="text-[#FE5733] font-mono">Rs {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 3. ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <Link
            href="/orders"
            className="bg-[#121212] hover:bg-[#FE5733] text-white rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-widest text-center transition-colors"
          >
            View My Orders
          </Link>
          <Link
            href="/shop"
            className="border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-white rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-widest text-center transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
