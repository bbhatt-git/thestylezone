'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ClipboardList, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Package,
  ShoppingBag
} from 'lucide-react';

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

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_method: string;
  payment_status: string;
  payment_txn_id?: string | null;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  municipality: string;
  wardNo: string;
  created_at: string;
  items: OrderItem[];
}

export default function GuestOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Get order IDs from localStorage
        if (typeof window !== 'undefined') {
          const guestOrders = localStorage.getItem('sz_guest_orders');
          if (guestOrders) {
            try {
              const orderIds = JSON.parse(guestOrders);
              if (Array.isArray(orderIds) && orderIds.length > 0) {
                // Fetch each order from API
                const orderPromises = orderIds.map(id => 
                  fetch(`/api/orders/${id}`).then(res => res.json())
                );
                
                const results = await Promise.all(orderPromises);
                const successfulOrders = results
                  .filter(result => result.success && result.order)
                  .map(result => result.order);
                
                setOrders(successfulOrders);
              }
            } catch (e) {
              console.error('Failed to parse guest orders:', e);
              setError('Failed to load order history.');
            }
          }
        }
      } catch (err) {
        setError('Network error syncing with order backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper status color badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-50 text-amber-700 border border-amber-250 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">Pending</span>;
      case 'processing':
        return <span className="bg-blue-50 text-blue-700 border border-blue-250 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">Processing</span>;
      case 'completed':
      case 'confirmed':
        return <span className="bg-green-50 text-green-700 border border-green-250 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">Confirmed</span>;
      case 'shipped':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-250 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">Shipped</span>;
      case 'cancelled':
        return <span className="bg-red-50 text-red-700 border border-red-250 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">Cancelled</span>;
      case 'refunded':
        return <span className="bg-orange-50 text-orange-700 border border-orange-250 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">Refunded</span>;
      default:
        return <span className="bg-zinc-50 text-zinc-700 border border-zinc-250 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0] text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16 flex-grow space-y-10 w-full">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-black/50 font-bold uppercase tracking-widest mb-4">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black">Orders</span>
        </div>

        <div className="space-y-4 max-w-3xl border-b border-black/10 pb-8">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-[#FE5733]">Guest Orders</p>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase font-display">Track your order history</h1>
          <p className="text-sm text-black/70 leading-relaxed">View recent guest orders, shipment status, and order details from any device. Keep your shopping experience smooth and easy to revisit.</p>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-xs font-bold uppercase tracking-widest text-black/50">
            <Clock className="w-8 h-8 text-black animate-spin mb-4" />
            <span>Checking order history status...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 p-8 shadow-2xl max-w-xl mx-auto text-center space-y-4">
            <ClipboardList className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-xs text-red-600 font-black uppercase tracking-widest">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-black/10 rounded-[4px] p-14 text-center max-w-2xl mx-auto shadow-xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FE5733]/10 text-[#FE5733]">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-3">No orders yet</h3>
            <p className="text-sm text-black/60 max-w-lg mx-auto leading-relaxed">
              Your guest order history is empty. Add something to your bag and return here to track its delivery progress.
            </p>
            <Link
              href="/shop"
              className="btn btn-primary mt-8 inline-flex items-center justify-center text-xs uppercase tracking-widest px-6 py-3"
            >
              Shop Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xs uppercase font-black tracking-widest text-black/50 px-1">Your Orders ({orders.length})</h3>
            
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-black/10 p-6 md:p-7 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <p className="text-sm font-black uppercase tracking-[0.35em] text-black/50">Order #{order.order_number}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(order.status)}
                        <span className="text-sm font-semibold text-black">Rs {(order.total || 0).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-black/50">{new Date(order.created_at).toLocaleDateString()}</p>
                      <p className="text-xs text-black/60">Paid with {order.payment_method}</p>
                    </div>

                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <div className="text-right text-xs uppercase tracking-[0.35em] text-black/40">
                        <p>{order.payment_status}</p>
                      </div>
                      <Link
                        href={`/checkout/success?order_id=${order.id}`}
                        className="btn btn-primary text-xs uppercase tracking-widest px-4 py-2"
                      >
                        Track order
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}