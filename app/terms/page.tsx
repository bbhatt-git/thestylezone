import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, AlertTriangle, Package, RefreshCw, CreditCard, Shield } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | The Style Zone',
  description: 'Understand the terms, guidelines, and conditions for ordering from The Style Zone online.',
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      <Navbar />

      <main className="flex-grow py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 border border-[#FE5733]/30 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#FE5733] rounded-full" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#FE5733] font-mono">
                Legal Information
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-[#121212] font-display mb-4">
              Terms of <span className="text-[#FE5733]">Service</span>
            </h1>
            <p className="text-sm md:text-base text-stone-500 max-w-2xl mx-auto leading-relaxed">
              Please read these terms carefully before using The Style Zone website and making purchases.
            </p>
            <p className="text-xs text-stone-400 font-mono mt-4">Last Updated: May 29, 2026</p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
            
            {/* Section 1: Order Placement */}
            <div className="p-8 md:p-10 border-b border-stone-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#121212] flex items-center justify-center text-white flex-shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#121212] mb-2">1. Order Placement & Acceptance</h2>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    By placing an order through The Style Zone, you confirm that you are at least 18 years old or have parental consent to make purchases. All orders are subject to product availability and our acceptance of your order.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Payment */}
            <div className="p-8 md:p-10 border-b border-stone-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#FE5733] flex items-center justify-center text-white flex-shrink-0">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#121212] mb-2">2. Pricing & Payment Methods</h2>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    All prices are listed in Nepalese Rupees (Rs) and include applicable taxes. We accept eSewa, Khalti, and Cash on Delivery for payments within Nepal.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-stone-600">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Secure payment processing through trusted gateways</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-stone-600">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Price protection against unauthorized charges</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-stone-600">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Cash on Delivery available for Kanchanpur district</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: Returns & Refunds */}
            <div className="p-8 md:p-10 border-b border-stone-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#121212] flex items-center justify-center text-white flex-shrink-0">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#121212] mb-2">3. Returns & Refunds Policy</h2>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    We offer a 15-day return window for unworn, unwashed items in original packaging with tags attached.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-stone-50 p-4 rounded-lg">
                      <h3 className="text-sm font-bold text-[#121212] mb-2">Returnable Items</h3>
                      <p className="text-xs text-stone-600">Clothing, footwear, and accessories in original condition</p>
                    </div>
                    <div className="bg-stone-50 p-4 rounded-lg">
                      <h3 className="text-sm font-bold text-[#121212] mb-2">Non-Returnable</h3>
                      <p className="text-xs text-stone-600">Sale items, intimate apparel, and customized products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Shipping */}
            <div className="p-8 md:p-10 border-b border-stone-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#FE5733] flex items-center justify-center text-white flex-shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#121212] mb-2">4. Shipping & Delivery</h2>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    Free shipping within Kanchanpur district. Standard delivery timelines apply for other regions based on courier service availability.
                  </p>
                  <div className="bg-[#FE5733]/10 border border-[#FE5733]/20 p-4 rounded-lg">
                    <p className="text-sm font-bold text-[#121212] mb-1">Free Delivery Zones:</p>
                    <p className="text-xs text-stone-600">Bhimdatta Municipality and surrounding areas in Kanchanpur</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Limitations */}
            <div className="p-8 md:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-stone-800 flex items-center justify-center text-white flex-shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#121212] mb-2">5. Limitations & Liability</h2>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    The Style Zone shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Product images are representative and actual colors may vary slightly.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <p className="text-xs text-stone-400 font-mono">
              This agreement is governed by the laws of Nepal. For questions, contact our support team.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
