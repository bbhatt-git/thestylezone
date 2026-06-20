import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service | The Style Zone',
  description: 'Understand the terms, guidelines, and conditions for ordering from The Style Zone online.',
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
      <Navbar />

      <main className="flex-grow">
        
        {/* Hero Section - Black background */}
        <section className="bg-black text-white py-24 px-6 md:px-10">
          <div className="max-w-[1560px] mx-auto">
            <p className="text-xs font-bold tracking-[0.3em] text-[#FE5733] uppercase mb-4">
              THE STYLE ZONE • LEGAL
            </p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display leading-none mb-6">
              Terms of <span className="text-[#FE5733]">Service.</span>
            </h1>
            <p className="text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
              Please read these terms carefully before using The Style Zone website and making purchases.
            </p>
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest">Last Updated: May 29, 2026</p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="bg-white py-24 px-6 md:px-10">
          <div className="max-w-[1560px] mx-auto">
            
            {/* Content Sections */}
            <div className="space-y-8">
              
              {/* Section 1 */}
              <div className="bg-[#F9F9F9] rounded-xl p-8 md:p-12 animate-on-scroll">
                <h2 className="text-xl font-black uppercase tracking-tight font-display text-black mb-4">1. Order Placement & Acceptance</h2>
                <p className="text-sm text-black/70 leading-relaxed">
                  By placing an order through The Style Zone, you confirm that you are at least 18 years old or have parental consent to make purchases. All orders are subject to product availability and our acceptance of your order.
                </p>
              </div>

              {/* Section 2 */}
              <div className="bg-[#F9F9F9] rounded-xl p-8 md:p-12 animate-on-scroll">
                <h2 className="text-xl font-black uppercase tracking-tight font-display text-black mb-4">2. Pricing & Payment Methods</h2>
                <p className="text-sm text-black/70 leading-relaxed mb-4">
                  All prices are listed in Nepalese Rupees (Rs) and include applicable taxes. We accept eSewa, Khalti, and Cash on Delivery for payments within Nepal.
                </p>
                <ul className="space-y-2 text-sm text-black/60">
                  <li>Secure payment processing through trusted gateways</li>
                  <li>Price protection against unauthorized charges</li>
                  <li>Cash on Delivery available for Kanchanpur district</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="bg-[#F9F9F9] rounded-xl p-8 md:p-12 animate-on-scroll">
                <h2 className="text-xl font-black uppercase tracking-tight font-display text-black mb-4">3. Returns & Refunds Policy</h2>
                <p className="text-sm text-black/70 leading-relaxed mb-4">
                  We offer a 15-day return window for unworn, unwashed items in original packaging with tags attached.
                </p>
                <p className="text-sm text-black/70">
                  <span className="font-black text-black">Returnable Items:</span> Clothing, footwear, and accessories in original condition
                </p>
                <p className="text-sm text-black/70 mt-2">
                  <span className="font-black text-black">Non-Returnable:</span> Sale items, intimate apparel, and customized products
                </p>
              </div>

              {/* Section 4 */}
              <div className="bg-[#F9F9F9] rounded-xl p-8 md:p-12 animate-on-scroll">
                <h2 className="text-xl font-black uppercase tracking-tight font-display text-black mb-4">4. Shipping & Delivery</h2>
                <p className="text-sm text-black/70 leading-relaxed mb-4">
                  We offer a flat-rate shipping fee across our delivery zones. Standard delivery timelines apply based on courier service availability.
                </p>
                <p className="text-sm text-black/60">
                  <span className="font-black text-black">Delivery Zones:</span> Kanchanpur and surrounding areas (Nationwide delivery coming soon)
                </p>
              </div>

              {/* Section 5 */}
              <div className="bg-[#F9F9F9] rounded-xl p-8 md:p-12 animate-on-scroll">
                <h2 className="text-xl font-black uppercase tracking-tight font-display text-black mb-4">5. Limitations & Liability</h2>
                <p className="text-sm text-black/70 leading-relaxed">
                  The Style Zone shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Product images are representative and actual colors may vary slightly.
                </p>
              </div>

            </div>

            {/* Footer Info */}
            <div className="mt-16 pt-12 border-t-2 border-black animate-on-scroll">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <p className="text-sm text-black/70 mb-1">This agreement is governed by the laws of Nepal.</p>
                  <p className="text-xs text-black/40 uppercase tracking-widest">For questions, contact our support team.</p>
                </div>
                <a 
                  href="/contact" 
                  className="bg-[#FE5733] hover:bg-black text-white px-8 py-4 shrink-0 transition-colors uppercase tracking-widest text-xs font-bold rounded-sm"
                >
                  Contact Support
                </a>
              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
