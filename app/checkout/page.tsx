'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cartStore';
import { useSessionToken } from '@/hooks/useSessionToken';
import { useModal } from '@/contexts/ModalContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ChevronRight, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowLeft, 
  Download, 
  BadgeHelp,
  Clock
} from 'lucide-react';

interface Country {
  id: string;
  code: string;
  name: string;
  shipping_cost: number;
  is_active: boolean;
}

interface District {
  id: string;
  name: string;
  shipping_cost: number;
  is_active: boolean;
}

interface Municipality {
  id: string;
  district_id: string;
  name: string;
  type: string;
  wards: number;
  shipping_cost: number | null;
  is_active: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const sessionToken = useSessionToken();
  const { showModal } = useModal();
  
  const cartItems = useCart((state) => state.items);
  const cartTotal = useCart((state) => state.getTotalPrice());
  const clearCart = useCart((state) => state.clearCart);
  
  // Checkout Wizards Steps: 'address' | 'review' | 'payment'
  const [step, setStep] = useState<'address' | 'review' | 'payment'>('address');
  
  // FormData Address states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [country, setCountry] = useState('NP');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [wardNo, setWardNo] = useState<number>(1);
  const [notes, setNotes] = useState('');
  
  // Location data states
  const [countries, setCountries] = useState<Country[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);
  const [shippingCost, setShippingCost] = useState(200);

  // Custom dropdown states
  const [countryOpen, setCountryOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [municipalityOpen, setMunicipalityOpen] = useState(false);
  const [wardOpen, setWardOpen] = useState(false);
  
  // Refs for click outside detection
  const countryRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);
  const municipalityRef = useRef<HTMLDivElement>(null);
  const wardRef = useRef<HTMLDivElement>(null);
  
  // Click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setCountryOpen(false);
      }
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setDistrictOpen(false);
      }
      if (municipalityRef.current && !municipalityRef.current.contains(event.target as Node)) {
        setMunicipalityOpen(false);
      }
      if (wardRef.current && !wardRef.current.contains(event.target as Node)) {
        setWardOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const res = await fetch('/api/shipping?action=countries');
        const data = await res.json();
        if (data.success) {
          setCountries(data.countries);
        }
      } catch (err) {
        console.error('Error fetching countries:', err);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch districts when country changes to Nepal
  useEffect(() => {
    if (country === 'NP') {
      const fetchDistricts = async () => {
        setLoadingDistricts(true);
        try {
          const res = await fetch('/api/shipping?action=districts');
          const data = await res.json();
          if (data.success) {
            setDistricts(data.districts);
          }
        } catch (err) {
          console.error('Error fetching districts:', err);
        } finally {
          setLoadingDistricts(false);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setMunicipalities([]);
      setDistrict('');
      setMunicipality('');
    }
  }, [country]);

  // Fetch municipalities when district changes
  useEffect(() => {
    if (district) {
      const fetchMunicipalities = async () => {
        setLoadingMunicipalities(true);
        try {
          const res = await fetch(`/api/shipping?action=municipalities&districtId=${district}`);
          const data = await res.json();
          if (data.success) {
            setMunicipalities(data.municipalities);
          }
        } catch (err) {
          console.error('Error fetching municipalities:', err);
        } finally {
          setLoadingMunicipalities(false);
        }
      };
      fetchMunicipalities();
    } else {
      setMunicipalities([]);
      setMunicipality('');
    }
  }, [district]);

  // Calculate shipping cost when location changes
  useEffect(() => {
    const calculateShipping = async () => {
      try {
        const params = new URLSearchParams({
          action: 'calculate',
          countryCode: country,
        });
        if (district) params.append('districtName', districts.find(d => d.id === district)?.name || '');
        if (municipality) params.append('municipalityName', municipalities.find(m => m.id === municipality)?.name || '');
        
        const res = await fetch(`/api/shipping?${params}`);
        const data = await res.json();
        if (data.success) {
          setShippingCost(data.shippingCost);
        }
      } catch (err) {
        console.error('Error calculating shipping:', err);
      }
    };
    calculateShipping();
  }, [country, district, municipality, districts, municipalities]);
  
  // Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Payment Selection Selector
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'khalti' | 'cash_on_delivery'>('cash_on_delivery');
  const [paymentTxnId, setPaymentTxnId] = useState('');
  const [qrConfig, setQrConfig] = useState<any | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  // General Statuses
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // 1. Auto fill from last used address
  useEffect(() => {
    const savedAddress = localStorage.getItem('tsz_last_address');
    if (savedAddress) {
      try {
        const parsed = JSON.parse(savedAddress);
        Promise.resolve().then(() => {
          setCustomerName(parsed.customerName || '');
          setCustomerPhone(parsed.customerPhone || '');
          setCustomerEmail(parsed.customerEmail || '');
          setShippingAddress(parsed.shippingAddress || '');
          setMunicipality(parsed.municipality || 'Bhimdatta');
          setWardNo(parsed.wardNo || 1);
        });
      } catch (e) {
        console.error('Failed to parse previous address', e);
      }
    }
  }, []);

  // 2. Fetch QRs configuration when payment method toggles
  useEffect(() => {
    if (paymentMethod === 'cash_on_delivery') {
      Promise.resolve().then(() => {
        setQrConfig(null);
      });
      return;
    }
    const fetchQR = async () => {
      setQrLoading(true);
      try {
        const res = await fetch(`/api/payment-qr/${paymentMethod}`);
        if (res.ok) {
          const config = await res.json();
          setQrConfig(config);
        }
      } catch (err) {
        console.error('Error fetching QR config', err);
      } finally {
        setQrLoading(false);
      }
    };
    Promise.resolve().then(() => {
      fetchQR();
    });
  }, [paymentMethod]);

  // 3. Compute active shipping rates
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingFee = shippingCost;
  const grandTotal = Math.max(cartTotal - discountAmount + shippingFee, 0);

  // Checkout validation Step 1
  const validateAddressForm = () => {
    const errors: {[key: string]: string} = {};
    if (!customerName.trim()) errors.customerName = 'Full name is required';
    
    const phoneRegex = /^(98|97)\d{8}$/;
    if (!customerPhone.trim()) {
      errors.customerPhone = 'Phone number is required';
    } else if (!phoneRegex.test(customerPhone)) {
      errors.customerPhone = 'Valid Nepal formatting required (98XXXXXXXX or 97XXXXXXXX)';
    }

    if (customerEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        errors.customerEmail = 'Invalid email structure';
      }
    }

    if (!shippingAddress.trim()) errors.shippingAddress = 'Street shipping address is required';
    if (!country) errors.country = 'Country is required';
    if (country === 'NP') {
      if (!district) errors.district = 'District is required';
      if (!municipality) errors.municipality = 'Municipality is required';
      if (!wardNo) errors.wardNo = 'Ward number is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 'address' && validateAddressForm()) {
      setStep('review');
    } else if (step === 'review') {
      setStep('payment');
    }
  };

  const handleBackStep = () => {
    if (step === 'review') {
      setStep('address');
    } else if (step === 'payment') {
      setStep('review');
    }
  };

  // Coupon application logic
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: couponCodeInput.trim(),
          subtotal: cartTotal
        })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data);
        showModal('success', 'Coupon Applied!', `Discount code applied successfully. You save Rs ${data.discountAmount.toLocaleString()}!`);
      } else {
        setCouponError(data.error || 'Failed to apply promotional code.');
        showModal('error', 'Coupon Failed', data.error || 'Failed to apply promotional code.');
      }
    } catch (err) {
      setCouponError('Network error validating discount code.');
    } finally {
      setCouponLoading(false);
    }
  };

  // Forced Blob file-download utility for QR codes
  const handleDownloadQR = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download QR code', err);
      // Fallback
      window.open(url, '_blank');
    }
  };

  // PLACE ORDER SUBMIT LOGIC
  const handlePlaceOrder = async () => {
    if (paymentMethod !== 'cash_on_delivery' && !paymentTxnId.trim()) {
      setFormErrors({ paymentTxnId: `Please enter the matching ${paymentMethod === 'esewa' ? 'eSewa' : 'Khalti'} transaction ID.` });
      return;
    }
    
    setOrderSubmitting(true);
    setFormErrors({});

    const orderPayload = {
      sessionToken,
      items: cartItems.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        imageUrl: item.imageUrl,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      })),
      customerName,
      customerPhone,
      customerEmail: customerEmail.trim() || undefined,
      shippingAddress,
      country,
      district: country === 'NP' ? district : undefined,
      municipality: country === 'NP' ? municipality : undefined,
      wardNo: country === 'NP' ? wardNo : undefined,
      paymentMethod,
      paymentTxnId: paymentMethod !== 'cash_on_delivery' ? paymentTxnId.trim() : undefined,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      notes
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      
      if (data.success) {
        // Save WooCommerce order ID to localStorage for guest order history
        if (typeof window !== 'undefined') {
          const guestOrders = localStorage.getItem('sz_guest_orders');
          let orderIds: string[] = [];
          if (guestOrders) {
            try {
              orderIds = JSON.parse(guestOrders);
            } catch (e) {
              orderIds = [];
            }
          }
          
          // Add new order ID if not already in the list (use WooCommerce orderId)
          if (data.orderId && !orderIds.includes(data.orderId)) {
            orderIds.push(data.orderId);
            localStorage.setItem('sz_guest_orders', JSON.stringify(orderIds));
          }
        }
        
        // Save last-used address for auto fill
        const addressObj = { customerName, customerPhone, customerEmail, shippingAddress, municipality, wardNo };
        localStorage.setItem('tsz_last_address', JSON.stringify(addressObj));
        
        // Clear shopping bag and redirect!
        clearCart();
        showModal('success', 'Order Placed Successfully!', `Your order ${data.orderNumber} has been confirmed. Thank you for shopping with us!`);
        setTimeout(() => {
          router.push(`/checkout/success?order_id=${data.orderId}`);
        }, 2000);
      } else {
        setFormErrors({ submit: data.error || 'The server responded with an error. Please retry.' });
        showModal('error', 'Order Failed', data.error || 'The server responded with an error. Please retry.');
      }
    } catch (e) {
      setFormErrors({ submit: 'Unable to connect with The Style Zone database.' });
      showModal('error', 'Connection Error', 'Unable to connect with The Style Zone database. Please check your internet connection and try again.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
          <ShoppingBag className="w-16 h-16 text-stone-300" />
          <div>
            <h1 className="text-xl font-bold text-[#121212] font-sans">No items present</h1>
            <p className="text-xs text-stone-400 max-w-sm mt-1">Please select boutique outfits and add them to your shopping cart bag before checking out.</p>
          </div>
          <Link href="/shop" className="btn btn-primary h-12 px-6 text-xs uppercase tracking-widest">
            Return to Catalogue
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="w-[95%] mx-auto py-3 pb-24 flex-grow space-y-3">
        
        {/* Progress Tracker Stepper Header */}
        <div className="border-b border-black/10 pb-2 mb-4 pt-4 flex flex-wrap gap-2 items-center justify-center text-[10px] font-semibold uppercase tracking-[0.15em] text-black/50">
          <div className={`flex items-center gap-2 ${step === 'address' ? 'text-black' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step === 'address' ? 'border-black text-black' : 'border-black/20'}`}>1</span>
            <span>Billing</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-black/20" />
          <div className={`flex items-center gap-2 ${step === 'review' ? 'text-black' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step === 'review' ? 'border-black text-black' : 'border-black/20'}`}>2</span>
            <span>Review</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-black/20" />
          <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-black' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step === 'payment' ? 'border-black text-black' : 'border-black/20'}`}>3</span>
            <span>Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          
          {/* LEFT: STEP RENDERERS */}
          <div className="lg:col-span-8">
            {step === 'address' && (
              <div className="bg-white p-3 shadow-sm space-y-4 animate-fade-in border border-black/10">
                <div className="flex items-center gap-2 border-b border-black/10 pb-2 mb-3">
                  <MapPin className="w-5 h-5 text-black" strokeWidth={1.5} />
                  <h2 className="text-lg font-semibold text-black tracking-tight">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-black/60">Full name *</label>
                    <input
                      type="text"
                      inputMode="text"
                      autoComplete="name"
                      placeholder="e.g. Ramesh Joshi"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full h-11 bg-transparent border-b border-black/10 focus:border-black text-sm text-black outline-none transition-all duration-200"
                    />
                    {formErrors.customerName && <p className="text-[10px] text-[#FE5733] font-semibold uppercase tracking-[0.18em]">{formErrors.customerName}</p>}
                  </div>

                  {/* Nepal Phone Number */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-black/60">Phone number *</label>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="e.g. 98XXXXXXXX"
                      maxLength={10}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full h-11 bg-transparent border-b border-black/10 focus:border-black text-sm text-black outline-none transition-all duration-200"
                    />
                    {formErrors.customerPhone && <p className="text-[10px] text-[#FE5733] font-semibold uppercase tracking-[0.18em]">{formErrors.customerPhone}</p>}
                  </div>

                  {/* Email address optional */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-[10px] font-semibold text-black/60 uppercase tracking-[0.18em]">Email address</label>
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="email@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full h-11 bg-transparent border-b border-black/10 focus:border-black text-sm text-black outline-none transition-all duration-200"
                    />
                    {formErrors.customerEmail && <p className="text-[10px] text-[#FE5733] font-semibold uppercase tracking-[0.18em]">{formErrors.customerEmail}</p>}
                  </div>

                  {/* Street Shipping address */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-[11px] font-semibold text-black/60">Shipping address *</label>
                    <input
                      type="text"
                      inputMode="text"
                      autoComplete="street-address"
                      placeholder="Gali No. 3, Main Marg, Mahendranagar"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full h-11 bg-transparent border-b border-black/10 focus:border-black text-sm text-black outline-none transition-all duration-200"
                    />
                    {formErrors.shippingAddress && <p className="text-[10px] text-[#FE5733] font-semibold uppercase tracking-[0.18em]">{formErrors.shippingAddress}</p>}
                  </div>

                  {/* Country Dropdown */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-black/60">Country *</label>
                    <div className="relative" ref={countryRef}>
                      <button
                        type="button"
                        onClick={() => {
                          setCountryOpen(!countryOpen);
                          setDistrictOpen(false);
                          setMunicipalityOpen(false);
                        }}
                        className="w-full h-10 bg-transparent border-b border-black/10 px-0 text-sm text-black outline-none flex items-center justify-between"
                      >
                        {countries.find(c => c.code === country)?.name || 'Select Country'}
                        <ChevronRight className={`w-4 h-4 text-black transition-transform duration-200 ${countryOpen ? 'rotate-90' : ''}`} />
                      </button>
                      <div className={`absolute z-10 w-full left-0 top-full mt-1 transition-all duration-200 ease-in-out ${countryOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                        <div 
                          className="bg-white border border-black/10 shadow-sm max-h-48 overflow-y-auto"
                          onWheel={(e) => e.stopPropagation()}
                        >
                          {loadingCountries ? (
                            <div className="px-4 py-3 text-sm text-black/60">Loading...</div>
                          ) : (
                            countries.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setCountry(c.code);
                                  setCountryOpen(false);
                                  setDistrict('');
                                  setMunicipality('');
                                  setWardNo(1);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-black hover:bg-black hover:text-white transition-colors"
                              >
                                {c.name}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                    {formErrors.country && <p className="text-[10px] text-[#FE5733] font-semibold">{formErrors.country}</p>}
                  </div>

                  {/* District Dropdown (Nepal only) */}
                  {country === 'NP' && (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-black/60">District *</label>
                      <div className="relative" ref={districtRef}>
                        <button
                          type="button"
                          onClick={() => {
                            setDistrictOpen(!districtOpen);
                            setMunicipalityOpen(false);
                          }}
                          className="w-full h-10 bg-transparent border-b border-black/10 px-0 text-sm text-black outline-none flex items-center justify-between"
                        >
                          {districts.find(d => d.id === district)?.name || 'Select District'}
                          <ChevronRight className={`w-4 h-4 text-black transition-transform duration-200 ${districtOpen ? 'rotate-90' : ''}`} />
                        </button>
                        <div className={`absolute z-10 w-full left-0 top-full mt-1 transition-all duration-200 ease-in-out ${districtOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                          <div 
                            className="bg-white border border-black/10 shadow-sm max-h-48 overflow-y-auto"
                            onWheel={(e) => e.stopPropagation()}
                          >
                            {loadingDistricts ? (
                              <div className="px-4 py-3 text-sm text-black/60">Loading...</div>
                            ) : (
                              districts.map((d) => (
                                <button
                                  key={d.id}
                                  type="button"
                                  onClick={() => {
                                    setDistrict(d.id);
                                    setDistrictOpen(false);
                                    setMunicipality('');
                                    setWardNo(1);
                                  }}
                                  className="w-full px-4 py-3 text-left text-sm text-black hover:bg-black hover:text-white transition-colors"
                                >
                                  {d.name}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                      {formErrors.district && <p className="text-[10px] text-[#FE5733] font-semibold">{formErrors.district}</p>}
                    </div>
                  )}

                  {/* Municipality Dropdown (Nepal only) */}
                  {country === 'NP' && (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-black/60 tracking-wide">Municipality *</label>
                      <div className="relative" ref={municipalityRef}>
                        <button
                          type="button"
                          onClick={() => {
                            setMunicipalityOpen(!municipalityOpen);
                            setWardOpen(false);
                          }}
                          className="w-full h-10 bg-transparent border-b border-black/10 px-0 text-sm text-black outline-none flex items-center justify-between"
                        >
                          {municipalities.find(m => m.id === municipality)?.name || 'Select Municipality'}
                          <ChevronRight className={`w-4 h-4 text-black transition-transform duration-200 ${municipalityOpen ? 'rotate-90' : ''}`} />
                        </button>
                        <div className={`absolute z-10 w-full left-0 top-full mt-1 transition-all duration-200 ease-in-out ${municipalityOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                          <div 
                            className="bg-white border border-black/10 shadow-sm max-h-48 overflow-y-auto"
                            onWheel={(e) => e.stopPropagation()}
                          >
                            {loadingMunicipalities ? (
                              <div className="px-4 py-3 text-sm text-black/60">Loading...</div>
                            ) : (
                              municipalities.map((m) => (
                                <button
                                  key={m.id}
                                  type="button"
                                  onClick={() => {
                                    setMunicipality(m.id);
                                    setWardNo(1);
                                    setMunicipalityOpen(false);
                                  }}
                                  className="w-full px-4 py-3 text-left text-sm text-black hover:bg-black hover:text-white transition-colors"
                                >
                                  {m.name} ({m.type})
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                      {formErrors.municipality && <p className="text-[10px] text-[#FE5733] font-semibold">{formErrors.municipality}</p>}
                    </div>
                  )}

                  {/* Ward No. Custom Dropdown (Nepal only) */}
                  {country === 'NP' && (
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold text-black/60">Ward No. *</label>
                      <div className="relative" ref={wardRef}>
                        <button
                          type="button"
                          onClick={() => {
                            setWardOpen(!wardOpen);
                            setMunicipalityOpen(false);
                          }}
                          className="w-full h-10 bg-transparent border-b border-black/10 px-0 text-sm text-black outline-none flex items-center justify-between"
                        >
                          {wardNo ? `Ward No. ${wardNo}` : 'Select Ward No'}
                          <ChevronRight className={`w-4 h-4 text-black transition-transform duration-200 ${wardOpen ? 'rotate-90' : ''}`} />
                        </button>
                        <div className={`absolute z-10 w-full left-0 top-full mt-1 transition-all duration-200 ease-in-out ${wardOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                          <div 
                            className="bg-white border border-black/10 shadow-sm max-h-48 overflow-y-auto"
                            onWheel={(e) => e.stopPropagation()}
                          >
                            {Array.from({length: municipalities.find(m => m.id === municipality)?.wards || 1}, (_, i) => i + 1).map((ward) => (
                              <button
                                key={ward}
                                type="button"
                                onClick={() => {
                                  setWardNo(ward);
                                  setWardOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-black hover:bg-black hover:text-white transition-colors"
                              >
                                Ward No. {ward}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      {formErrors.wardNo && <p className="text-[10px] text-[#FE5733] font-semibold">{formErrors.wardNo}</p>}
                    </div>
                  )}

                  {/* Buyer Notes */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-[11px] font-semibold text-black/60">Special delivery instructions</label>
                    <textarea
                      placeholder="e.g. Please call before deliver..."
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-transparent border border-black/10 focus:border-black text-sm text-black outline-none transition-all duration-200 p-3"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-black/10 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="btn btn-primary h-11 px-5 text-sm tracking-[0.2em] flex items-center gap-2"
                  >
                    Next review <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 'review' && (
              <div className="bg-white p-3 shadow-sm animate-fade-in border border-black/10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/10">
                  <button 
                    onClick={handleBackStep}
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 hover:text-black flex items-center gap-2"
                    aria-label="Back to address step"
                  >
                    <ArrowLeft className="w-4 h-4" /> Edit
                  </button>
                  <h2 className="text-lg font-semibold text-black tracking-tight">Review Your Order</h2>
                </div>

                {/* Two-column layout for review */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {/* Left: Shipping Info */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-black flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Shipping Details
                    </h3>
                    <div className="bg-transparent border border-black/10 p-3 space-y-2 text-sm">
                      <div>
                        <p className="text-[11px] text-stone-500 mb-1">Full Name</p>
                        <p className="font-semibold text-[#121212]">{customerName}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-stone-500 mb-1">Phone</p>
                        <p className="font-semibold text-[#121212]">{customerPhone}</p>
                      </div>
                      {customerEmail && (
                        <div>
                          <p className="text-[11px] text-stone-500 mb-1">Email</p>
                          <p className="font-medium text-[#121212]">{customerEmail}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[11px] text-stone-500 mb-1">Address</p>
                        <p className="font-medium text-[#121212]">{shippingAddress}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-stone-500 mb-1">Country</p>
                        <p className="font-semibold text-[#121212]">{countries.find(c => c.code === country)?.name || country}</p>
                      </div>
                      {country === 'NP' && (
                        <>
                          <div>
                            <p className="text-[11px] text-stone-500 mb-1">District</p>
                            <p className="font-semibold text-[#121212]">{districts.find(d => d.id === district)?.name || district}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-stone-500 mb-1">Municipality</p>
                            <p className="font-semibold text-[#121212]">{municipalities.find(m => m.id === municipality)?.name || municipality}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-stone-500 mb-1">Ward No.</p>
                            <p className="font-semibold text-[#121212]">{wardNo}</p>
                          </div>
                        </>
                      )}
                      {notes && (
                        <div>
                          <p className="text-[11px] text-stone-500 mb-1">Notes</p>
                          <p className="font-medium text-[#121212] italic text-sm">{notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Order Summary */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-black flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" /> Order Summary
                    </h3>
                    <div className="bg-transparent border border-black/10 p-3 space-y-2 text-sm">
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-600">Subtotal</span>
                        <span className="font-semibold text-[#121212]">Rs {cartTotal.toLocaleString()}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-sm text-green-700">
                          <span>Discount ({appliedCoupon.code})</span>
                          <span className="font-semibold">-Rs {discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-600">Shipping</span>
                        <span className="font-semibold text-[#121212]">Rs {shippingFee.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-stone-300 pt-3 flex justify-between">
                        <span className="font-bold text-[#121212]">Total</span>
                        <span className="font-bold text-[#FE5733] text-lg">Rs {grandTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6 pt-6 border-t border-black/10">
                  <h3 className="text-xs font-semibold text-black mb-4">Order Items ({cartItems.length})</h3>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.variantId} className="flex gap-3 p-3 border border-black/10 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-20 object-cover rounded bg-white border border-stone-200 flex-none" />
                        <div className="flex-grow min-w-0">
                          <p className="font-semibold text-[#121212] truncate text-sm">{item.name}</p>
                          <p className="text-xs text-stone-500 mt-1">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="font-bold text-[#FE5733]">Rs {(item.unitPrice * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-4 border-t border-black/10 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="btn btn-primary h-10 px-4 text-sm flex items-center gap-2"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 'payment' && (
<div className="bg-white p-3 shadow-sm animate-fade-in border border-black/10 space-y-4">
                
                {/* Back button header */}
                <div className="flex items-center justify-between border-b border-black/10 pb-2">
                  <button 
                    onClick={handleBackStep}
                    className="text-xs font-semibold tracking-wide text-black/50 hover:text-black flex items-center gap-2"
                    aria-label="Back to review step"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <h2 className="text-lg font-semibold text-black flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-black" strokeWidth={1.5} /> Payment
                  </h2>
                </div>

                {/* Radio selections of methods */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {/* eSewa */}
                  <button
                    onClick={() => setPaymentMethod('esewa')}
                    className={`p-3 border transition-all relative flex flex-col justify-between min-h-[88px] cursor-pointer outline-hidden ${paymentMethod === 'esewa' ? 'border-green-600 bg-green-50 shadow-sm scale-[1.01]' : 'border-black/10 hover:border-black bg-white'}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-semibold text-[#121212]">eSewa</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'esewa' ? 'border-green-600 bg-green-600 text-white' : 'border-black/20'}`}>
                        {paymentMethod === 'esewa' && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </span>
                    </div>
                    {/* label */}
                    <div className="space-y-0.5">
                      <p className="text-sm text-black/60">Scan & pay with eSewa</p>
                    </div>
                  </button>

                  {/* Khalti */}
                  <button
                    onClick={() => setPaymentMethod('khalti')}
                    className={`p-3 border transition-all relative flex flex-col justify-between min-h-[88px] cursor-pointer outline-hidden ${paymentMethod === 'khalti' ? 'border-purple-600 bg-purple-50 shadow-sm scale-[1.01]' : 'border-black/10 hover:border-black bg-white'}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-semibold text-[#121212]">Khalti</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'khalti' ? 'border-purple-600 bg-purple-600 text-white' : 'border-black/20'}`}>
                        {paymentMethod === 'khalti' && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </span>
                    </div>
                    {/* label */}
                    <div className="space-y-0.5">
                      <p className="text-sm text-black/60">Scan & pay with Khalti</p>
                    </div>
                  </button>

                  {/* COD */}
                  <button
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-3 border transition-all relative flex flex-col justify-between min-h-[88px] cursor-pointer outline-hidden ${paymentMethod === 'cash_on_delivery' ? 'border-[#FE5733] bg-[#FE5733]/5 shadow-sm scale-[1.01]' : 'border-black/10 hover:border-black bg-white'}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-semibold text-[#121212]">C.O.D</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash_on_delivery' ? 'border-[#FE5733] bg-[#FE5733] text-white' : 'border-black/20'}`}>
                        {paymentMethod === 'cash_on_delivery' && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </span>
                    </div>
                    {/* label */}
                    <div className="space-y-0.5">
                      <p className="text-sm text-black/60">Pay Rs {grandTotal.toLocaleString()} on delivery</p>
                    </div>
                  </button>
                </div>

                {/* QR PANEL CONTENT */}
                {paymentMethod !== 'cash_on_delivery' && (
<div className="bg-white border border-black/10 p-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    
                    {/* QR Code Graphic Frame */}
                    <div className="md:col-span-5 flex flex-col items-center gap-3">
                      {qrLoading ? (
                        <div className="w-48 h-64 bg-white border border-stone-200 rounded-[4px] flex flex-col items-center justify-center text-xs text-stone-400">
                          <Clock className="w-8 h-8 text-stone-300 animate-spin mb-1" />
                          <span>Generating QR config...</span>
                        </div>
                      ) : qrConfig ? (
                        <>
                          <div className="bg-white p-3 border border-stone-200 rounded-[4px] shadow-sm relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={qrConfig.qr_image_url} 
                              alt={`${paymentMethod.toUpperCase()} Pay QR`} 
                              className="w-44 h-44 object-contain rounded-lg"
                            />
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleDownloadQR(qrConfig.qr_image_url, `StyleZone-${paymentMethod}-QR.png`)}
                            className="bg-white hover:bg-stone-100 hover:text-[#FE5733] text-stone-700 border border-stone-200 font-bold rounded-full text-[10px] uppercase tracking-wider h-8 px-4 flex items-center gap-1.3 transition-all cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" /> Download Code Image
                          </button>
                        </>
                      ) : (
                        <p className="text-xs text-stone-400">Config missing. Please retry.</p>
                      )}
                    </div>

                    {/* QR Payment walkthrough / steps */}
                    <div className="md:col-span-7 space-y-4">
                      {qrConfig && (
                        <div className="space-y-2 text-sm">
                          <p className="text-sm text-stone-400">Account merchant</p>
                          <p className="text-sm font-semibold text-[#121212]">{qrConfig.account_name}</p>
                          {qrConfig.account_id && <p className="text-sm text-stone-500">ID account: {qrConfig.account_id}</p>}
                          
                          <div className="border-t border-stone-200/60 pt-3 space-y-1.5 text-sm text-stone-600">
                            <p className="text-sm text-stone-400">Scan & pay instructions</p>
                            <p className="whitespace-pre-line leading-relaxed font-sans font-medium text-stone-500">{qrConfig.instructions}</p>
                          </div>
                        </div>
                      )}

                      {/* Transaction ID input field */}
                      <div className="space-y-1 pt-2 border-t border-stone-200/60">
                        <label className="block text-sm font-semibold text-stone-700">
                          Enter your {paymentMethod === 'esewa' ? 'eSewa' : 'Khalti'} Transaction ID *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 000ABC123456"
                          value={paymentTxnId}
                          onChange={(e) => setPaymentTxnId(e.target.value)}
                          className="w-full h-11 bg-white border border-stone-200 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 rounded-[4px] px-4 text-sm outline-none transition-all duration-200 ease-in-out"
                          required
                        />
                        <p className="text-[10px] text-stone-400 leading-relaxed font-medium">After paying exact Rs {grandTotal.toLocaleString()}, copy the Transaction ID from payment history details statement and paste it here.</p>
                        {formErrors.paymentTxnId && <p className="text-[10px] text-red-500 font-bold">{formErrors.paymentTxnId}</p>}
                      </div>
                    </div>

                  </div>
                )}

                {/* Cash on Delivery prompt block */}
                {paymentMethod === 'cash_on_delivery' && (
                  <div className="bg-stone-50 border border-stone-200 rounded-[4px] p-4 flex gap-4 items-start font-sans">
                    <BadgeHelp className="w-6 h-6 text-[#FE5733] flex-none mt-0.5" />
                    <div className="space-y-1.5 text-sm leading-relaxed text-stone-500">
                      <h4 className="text-sm font-semibold text-[#121212]">Cash on Delivery (COD) rules</h4>
                      <p>No upfront transaction IDs or payments are required. Your order will be compiled instantly with status &ldquo;Confirmed&rdquo;. Please pay <strong>Rs {grandTotal.toLocaleString()}</strong> in cash directly to our delivery executive when your parcel package is handed to you in {municipality}.</p>
                    </div>
                  </div>
                )}

                {/* Place Order CTA with error indicators */}
                <div className="pt-4 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
                  {formErrors.submit && (
                    <p className="text-xs text-red-500 font-semibold">{formErrors.submit}</p>
                  )}
                  <div className="w-full flex justify-end">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={orderSubmitting}
                      className="btn btn-primary h-11 px-5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {orderSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* RIGHT: ORDER SUMMARY - Show on all steps */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Promo Codes Application container */}
<div className="bg-white p-3 shadow-sm border border-black/10 space-y-3">
              <h3 className="text-sm font-semibold text-black">Promo code</h3>
              {appliedCoupon ? (
                <div className="bg-green-50 border border-green-200 p-2 rounded-[4px] flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-green-800 text-sm">Code: {appliedCoupon.code}</p>
                    <p className="text-xs text-green-500 mt-0.5">{appliedCoupon.description}</p>
                  </div>
                  <button 
                    onClick={() => setAppliedCoupon(null)}
                    className="text-sm font-semibold text-red-500 hover:underline cursor-pointer flex-none pl-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={couponCodeInput}
                    onChange={(e) => {
                      setCouponCodeInput(e.target.value);
                      setCouponError('');
                    }}
                    className="h-10 bg-transparent border border-black/10 text-black text-sm px-3 flex-1 focus:outline-none focus:border-black transition-all duration-200"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="btn btn-primary h-10 px-4 text-sm"
                  >
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && <p className="text-sm text-red-500 font-semibold">{couponError}</p>}
            </div>

            {/* Price computations and list items */}
            <div className="bg-white p-3 shadow-sm border border-black/10 space-y-3">
              <h3 className="text-sm font-semibold text-black pb-2 border-b border-black/10">Bag items</h3>
              
              {/* Items scroll */}
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {cartItems.map((item) => (
                  <div key={item.variantId} className="flex gap-2 text-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.name} className="w-8 h-10 object-cover rounded bg-stone-50 border border-stone-100 flex-none" />
                    <div className="flex-grow min-w-0 pr-1 justify-center py-0.5 space-y-0.5">
                      <p className="font-semibold text-[#121212] truncate text-xs">{item.name}</p>
                      <p className="text-[10px] text-stone-400 font-medium">Qty: {item.quantity} | Sz: {item.size} | {item.color}</p>
                    </div>
                    <span className="font-bold text-[#121212] flex-none text-right">Rs {(item.unitPrice * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Price Details totals calculations */}
              <div className="border-t border-black/10 pt-3 space-y-2 text-xs text-black/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#121212]">Rs {cartTotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-red-505">
                    <span>Discount applied ({appliedCoupon.code})</span>
                    <span>-Rs {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping rates ({municipality})</span>
                  <span className="text-[#121212] ">Rs {shippingFee.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-black/10 pt-4 flex justify-between text-sm text-black font-semibold">
                  <span>Total</span>
                  <span className="text-[#FE5733] text-lg font-semibold">Rs {grandTotal.toLocaleString()}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
