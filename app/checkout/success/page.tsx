'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, ClipboardList, ShoppingBag, Truck, Calendar, MapPin, CreditCard, Clock } from 'lucide-react';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  name: string;
  image_url: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface OrderData {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  payment_method: string;
  payment_status: string;
  payment_txn_id: string | null;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total: number;
  coupon_code: string | null;
  notes: string | null;
  created_at: string;
  items?: OrderItem[];
  status?: string;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError('Order ID not provided');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();
        
        if (data.success && data.order) {
          setOrderData(data.order);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError('Failed to fetch order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Clock className="w-8 h-8 text-[#FE5733] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
          <div className="w-24 h-24 border-2 border-black rounded-full flex items-center justify-center mb-8">
            <Clock className="w-8 h-8 text-black" strokeWidth={1} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-widest text-black mb-4 font-display">Order Status</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-black/50 mb-12 leading-relaxed">
            {error || 'We are currently processing your order. It may take a moment to appear. Please check your orders page or contact client services.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/orders" className="bg-black text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#FE5733] transition-colors">
              View Orders
            </Link>
            <Link href="/shop" className="border border-black text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const orderItems = orderData.items || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9] text-black">
      <Navbar />

      <main className="max-w-[1000px] mx-auto px-6 lg:px-10 py-16 md:py-24 flex-grow w-full space-y-12">
        
        {/* 1. SUCCESS BANNER */}
        <div className="text-center space-y-8 pb-12 border-b-2 border-black/10">
          <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <CheckCircle2 className="w-10 h-10" strokeWidth={1.5} />
          </div>
          
          <div className="space-y-4">
            <span className="text-xs bg-black text-white px-4 py-2 rounded-full uppercase tracking-widest font-black">
              {orderData.payment_method === 'cod' || orderData.payment_method === 'cash_on_delivery' ? 'Order Confirmed' : 'Order Submitted'}
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black font-display leading-none mt-6">
              Thank You.
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest text-black/50 max-w-lg mx-auto mt-4">
              Order <span className="text-[#FE5733]">{orderData.order_number}</span> received. We are preparing your items.
            </p>
          </div>

          <div className="pt-8">
            {orderData.payment_method === 'cod' || orderData.payment_method === 'cash_on_delivery' ? (
              <div className="bg-black/5 p-6 rounded-xl max-w-md mx-auto">
                <p className="text-xs font-bold tracking-widest uppercase text-black text-center">
                  <strong className="block mb-2 text-[#FE5733]">Pay on Delivery</strong>
                  Dispatching shortly.
                </p>
              </div>
            ) : (
              <div className="bg-black/5 p-6 rounded-xl max-w-md mx-auto">
                <p className="text-xs font-bold tracking-widest uppercase text-black text-center">
                  <strong className="block mb-2 text-[#FE5733]">Awaiting Verification</strong>
                  Txn ID: {orderData.payment_txn_id}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. ORDER DETAILS CARD */}
        <div className="bg-white p-8 md:p-12 space-y-8 shadow-2xl">
          <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tighter pb-4 border-b-2 border-black">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Meta */}
            <div className="space-y-6">
              <div className="flex gap-4 items-center">
                <Calendar className="w-6 h-6 text-black" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mb-1">Date Ordered</p>
                  <p className="text-black font-black uppercase text-sm">{new Date(orderData.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <CreditCard className="w-6 h-6 text-black" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mb-1">Payment Method</p>
                  <p className="text-black font-black uppercase text-sm">{orderData.payment_method.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </div>

            {/* Ship address */}
            <div className="flex gap-4 items-start">
              <MapPin className="w-6 h-6 text-black mt-1" strokeWidth={1.5} />
              <div>
                <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mb-1">Shipping Address</p>
                <p className="text-black font-black uppercase text-sm">{orderData.customer_name}</p>
                <p className="text-black/60 text-xs mt-1 uppercase font-bold tracking-widest">{orderData.shipping_address}</p>
                <p className="text-black/40 text-xs mt-1">{orderData.customer_phone}</p>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="pt-8 border-t border-black/10 space-y-6">
            <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mb-4">Purchased Items</p>
            <div className="space-y-6">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-6 items-center">
                  <img src={item.image_url} alt={item.name} className="w-20 h-24 object-cover bg-black/5 flex-none" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black uppercase tracking-widest text-black mb-1">{item.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">Qty: {item.quantity} | Size: {item.size} | Color: {item.color}</p>
                  </div>
                  <span className="text-sm font-black text-black">Rs {(item.total_price || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing aggregates */}
          <div className="border-t border-black/10 pt-8 flex flex-col items-end gap-3 text-xs font-bold uppercase tracking-widest">
            <div className="flex justify-between w-full max-w-xs">
              <span className="text-black/50">Subtotal</span>
              <span className="text-black">Rs {(orderData.subtotal || 0).toLocaleString()}</span>
            </div>
            {(orderData.discount_amount || 0) > 0 && (
              <div className="flex justify-between w-full max-w-xs text-[#FE5733]">
                <span>Discount</span>
                <span>-Rs {(orderData.discount_amount || 0).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between w-full max-w-xs text-black/50">
              <span>Shipping</span>
              <span className="text-black">Rs {(orderData.shipping_fee || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between w-full max-w-xs text-xl font-black text-black border-t-2 border-black pt-4 mt-2">
              <span>Total</span>
              <span className="text-black">Rs {(orderData.total || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 3. ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8">
          <Link href="/orders" className="bg-black hover:bg-[#FE5733] text-white rounded-full px-10 py-5 text-xs font-bold uppercase tracking-widest transition-all shadow-xl text-center">
            View My Orders
          </Link>
          <Link href="/shop" className="border-2 border-black text-black hover:bg-black hover:text-white rounded-full px-10 py-5 text-xs font-bold uppercase tracking-widest transition-all text-center">
            Continue Shopping
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Clock className="w-8 h-8 text-[#FE5733] animate-spin" />
        </div>
        <Footer />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}