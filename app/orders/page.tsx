'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSessionToken } from '@/hooks/useSessionToken';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ClipboardList, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Truck, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  Package,
  Share2,
  AlertCircle
} from 'lucide-react';

interface OrderItem {
  id: string;
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
  shipping_address: string;
  shipping_city?: string;
  shipping_district?: string;
  municipality?: string;
  wardNo?: string;
  created_at: string;
  items: OrderItem[];
}

export default function GuestOrdersPage() {
  const sessionToken = useSessionToken();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Track selected order which is expanded for detail timelines
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionToken) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders?sessionToken=${sessionToken}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
          // Auto expand first order if available
          if (data.orders.length > 0) {
            setExpandedOrderId(data.orders[0].id);
          }
        } else {
          setError(data.error || 'Failed to fetch historic orders.');
        }
      } catch (err) {
        setError('Network error syncing with order backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sessionToken]);

  // Helper status color badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'payment_submitted':
        return <span className="bg-amber-50 text-amber-700 border border-amber-250 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">Awaiting verification</span>;
      case 'confirmed':
        return <span className="bg-blue-50 text-blue-700 border border-blue-250 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">Confirmed Order</span>;
      case 'processing':
        return <span className="bg-blue-50 text-blue-700 border border-blue-250 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">Packing Cargo</span>;
      case 'shipped':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-250 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">En Route</span>;
      case 'delivered':
        return <span className="bg-green-50 text-green-700 border border-green-250 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">Delivered Handover</span>;
      case 'cancelled':
        return <span className="bg-red-50 text-red-700 border border-red-250 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">Cancelled</span>;
      default:
        return <span className="bg-zinc-50 text-zinc-700 border border-zinc-250 text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide">Awaiting Payment</span>;
    }
  };

  // Compile active stages for timeline visual trackers
  const getTimelineStages = (order: Order) => {
    const isCod = order.payment_method === 'cash_on_delivery';
    
    const stages = [
      { key: 'placed', label: 'Order Submitted', done: true, desc: 'Your fashion order request was logged.' },
    ];

    if (!isCod) {
      const txnSub = order.payment_status === 'submitted' || order.payment_status === 'verified';
      stages.push({ 
        key: 'paid', 
        label: 'Payment Verifying', 
        done: txnSub,
        desc: txnSub ? `Admin is cross-matching Transaction ID: ${order.payment_txn_id}` : 'Awaiting Transaction reference submission.'
      });
    }

    const confirmed = order.status === 'confirmed' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered';
    stages.push({
      key: 'confirmed',
      label: 'Boutique Confirmed',
      done: confirmed,
      desc: confirmed ? 'We checked variant stocks and confirmed the purchase.' : 'Order pending confirmation.'
    });

    const processing = order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered';
    stages.push({
      key: 'processing',
      label: 'Cargo Packaging',
      done: processing,
      desc: processing ? 'Tailoring final stitch checks and boxing parcel details.' : 'Pending parcel bundling.'
    });

    const shipped = order.status === 'shipped' || order.status === 'delivered';
    stages.push({
      key: 'shipped',
      label: 'Out for Dispatch',
      done: shipped,
      desc: shipped ? 'Parcel handed over to regional courier express.' : 'Pending shipping handover.'
    });

    const delivered = order.status === 'delivered';
    stages.push({
      key: 'delivered',
      label: 'Delivered',
      done: delivered,
      desc: delivered ? 'Package safely left with the customer.' : 'Awaiting arrival at doorstep.'
    });

    return stages;
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex-grow space-y-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
          <Link href="/" className="hover:text-brand">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-500 font-bold">Guest Order Center</span>
        </div>

        <div className="space-y-1 max-w-lg">
          <h1 className="text-xl md:text-3xl font-black text-[#121212] tracking-tight font-sans">Guest Order Center</h1>
          <p className="text-xs text-stone-400 font-medium">Track your boutique shipments and pending payments verification queue securely from Mahendranagar.</p>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-xs text-stone-400">
            <Clock className="w-8 h-8 text-[#FE5733] animate-spin mb-1.5" />
            <span>Checking order history status...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-150 p-6 rounded-[4px] max-w-xl mx-auto text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-xs text-red-700 font-bold">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-[4px] p-16 text-center space-y-4 shadow-sm max-w-xl mx-auto py-20 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-stone-50 border border-stone-200 text-stone-400 rounded-full flex items-center justify-center">
              <ClipboardList className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#121212]">No Orders Found</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-xs leading-relaxed">It seems you have not placed any orders on this browser session yet, or your database sync is fresh.</p>
            </div>
            <div>
              <Link href="/shop" className="bg-[#121212] text-white rounded-[4px] text-xs font-bold px-6 py-2.5 inline-block">
                Start Browsing Fashion
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: HISTORIC ORDERS CARDS STACK */}
            <section className="lg:col-span-5 space-y-4">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-stone-400 px-1">Your Order Stack ({orders.length})</h3>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {orders.map((order) => {
                  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  const isCurExpanded = expandedOrderId === order.id;

                  return (
                    <button
                      key={order.id}
                      onClick={() => setExpandedOrderId(order.id)}
                      className={`w-full p-4 border rounded-[4px] text-left transition-all bg-white relative flex flex-col gap-3 outline-hidden cursor-pointer ${isCurExpanded ? 'border-[#FE5733] ring-1 ring-[#FE5733] shadow-sm' : 'border-stone-200 hover:border-stone-300 shadow-sm'}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-black text-[#121212] font-mono">{order.order_number}</span>
                        {getStatusBadge(order.status)}
                      </div>

                      {/* Items thumbs summary */}
                      <div className="flex gap-2 items-center">
                        <div className="flex -space-x-3 overflow-hidden">
                          {order.items.slice(0, 3).map((item) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              key={item.id} 
                              src={item.image_url} 
                              alt={item.name} 
                              className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover border border-stone-200 bg-stone-50" 
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-stone-400 font-medium">
                          {itemsCount} {itemsCount === 1 ? 'item' : 'items'} purchased
                        </span>
                      </div>

                      {/* Summary Pricing Footer */}
                      <div className="flex justify-between items-center w-full border-t border-stone-200 pt-2 text-[10px] text-stone-400 font-medium">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(order.created_at).toLocaleDateString()}</span>
                        <span className="text-[#121212] font-extrabold text-xs">Rs {order.total.toLocaleString()}</span>
                      </div>

                    </button>
                  );
                })}
              </div>
            </section>

            {/* RIGHT: TIMELINE AND INVOICE STATEMENT TRACKER */}
            <section className="lg:col-span-7 bg-white border border-stone-200 rounded-[4px] p-6 md:p-8 space-y-6 shadow-sm">
              {(() => {
                const activeOrder = orders.find(o => o.id === expandedOrderId);
                if (!activeOrder) {
                  return (
                    <div className="h-64 flex flex-col justify-center items-center text-stone-400 text-xs">
                      <Package className="w-8 h-8 text-stone-200 animate-bounce mb-1" />
                      <span>Select an order from the list to track details.</span>
                    </div>
                  );
                }

                const stages = getTimelineStages(activeOrder);

                return (
                  <div className="space-y-6 animate-fade-in font-sans">
                    
                    {/* Panel Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-200 pb-4">
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Active Track Details</p>
                        <h4 className="text-base font-black text-[#121212] font-mono flex items-center gap-1.5 pt-0.5">
                          {activeOrder.order_number}
                        </h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Grand Total NPR</p>
                        <span className="text-[#FE5733] font-black text-base font-sans">Rs {activeOrder.total.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Timeline Transition Tracks */}
                    <div className="space-y-4 pt-1">
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block px-1">Tracking Milestones</p>
                      
                      <div className="relative border-l border-stone-200 ml-4.5 pl-6.5 space-y-5">
                        {stages.map((stage, sIdx) => {
                          const isDone = stage.done;
                          const iconColor = isDone ? 'bg-[#FE5733] text-white border-[#FE5733] scale-110' : 'bg-white text-stone-300 border-stone-200';
                          return (
                            <div key={stage.key} className="relative">
                              {/* Bullets point icon */}
                              <div className={`absolute top-0.5 -left-10 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-extrabold transition-all duration-300 ${iconColor}`}>
                                {isDone ? '✓' : sIdx + 1}
                              </div>
                              
                              <div className="space-y-0.5">
                                <h5 className={`text-xs font-bold leading-normal transition-colors duration-300 ${isDone ? 'text-[#121212] font-black' : 'text-stone-400 font-medium'}`}>{stage.label}</h5>
                                <p className="text-[10px] text-stone-400 leading-normal font-sans font-medium">{stage.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dynamic Invoice Summary items nested inside history detailing */}
                    <div className="border-t border-stone-200 pt-5 space-y-3">
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Boutique Delivery Recipient</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-stone-500 bg-stone-50 border border-stone-200 p-4 rounded-[4px] leading-relaxed">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-stone-400">Recipient Particulars</p>
                          <p className="text-[#121212] font-bold">{activeOrder.customer_name}</p>
                          <p>Phone: <strong>{activeOrder.customer_phone}</strong></p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-stone-400">Destination Location</p>
                          <p className="text-[#121212] font-bold">{activeOrder.municipality || activeOrder.shipping_city}, Ward {activeOrder.wardNo || 'N/A'}</p>
                          <p className="text-[11px] truncate text-stone-500">{activeOrder.shipping_address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Items Summary list block */}
                    <div className="space-y-2 pt-1">
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Items list</p>
                      
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 divide-y divide-stone-200">
                        {activeOrder.items.map((item) => (
                          <div key={item.id} className="flex gap-3 items-center py-2 first:pt-0 last:pb-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image_url} alt={item.name} className="w-8 h-10 object-cover rounded bg-stone-50 border border-stone-200" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#121212] truncate">{item.name}</p>
                              <p className="text-[10px] text-stone-400">Qty: {item.quantity} | Size: {item.size} | Color: {item.color}</p>
                            </div>
                            <span className="text-xs font-bold text-[#121212] font-mono">Rs {item.total_price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })()}
            </section>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
