import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Eye, Lock, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | The Style Zone',
  description: 'Learn how we collect, store, and safeguard your personal information when using our website.',
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F3]">
      <Navbar />

      <main className="flex-grow py-12 md:py-20 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-[4px] p-8 md:p-12 border border-stone-200 shadow-sm space-y-8">
            
            {/* Header portion */}
            <div className="border-b border-stone-200 pb-8 space-y-3.5">
              <div className="flex items-center gap-1.5 text-[#E11D48] bg-[#E11D48]/10 px-3 py-1 rounded-full w-fit">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wider">Trusted & Secure</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-[#121212] tracking-tight">PRIVACY POLICY</h1>
              <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Last Modified: May 26, 2026</p>
            </div>

            {/* Core informational structure */}
            <div className="space-y-8 text-sm text-stone-600 leading-relaxed font-sans">
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-[4px] bg-stone-100 flex items-center justify-center text-[#121212] shrink-0 mt-1">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-base font-extrabold text-[#121212] uppercase tracking-tight">1. Information We Collect</h2>
                  <p>
                    When you purchase footwear, clothing, or other fashion accessories from our online store, we collect personal details you share with us such as your name, email address, physical shipping address, phone number, and payment information.
                  </p>
                  <p className="text-xs text-stone-500 font-medium bg-stone-50 rounded-[4px] p-3 border border-stone-200">
                    <strong>Technical Logs:</strong> Your IP address, device specs, browser types, and cookie session states are automatically collected to optimize product feeds and category views.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-[4px] bg-stone-100 flex items-center justify-center text-[#121212] shrink-0 mt-1">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-base font-extrabold text-[#121212] uppercase tracking-tight">2. How We Secure Your Data</h2>
                  <p>
                    Safeguarding your fashion database entries is our extreme priority. We utilize industry-standard Transport Layer Security (TLS/SSL) encryptions across our pages. Credit card processing is securely routed through authorized payment Gateways, meaning we never store raw billing keys on our servers.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-[4px] bg-stone-100 flex items-center justify-center text-[#121212] shrink-0 mt-1">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-base font-extrabold text-[#121212] uppercase tracking-tight">3. Use of Cookies</h2>
                  <p>
                    To keep track of shopping bags (your wardrobe cart), liked outfits in wishlists, and session analytics, we use small local cookies. You can switch off cookies in browser setups, but certain checkout processes may stop saving your choices correctly.
                  </p>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <h3 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-2">Consent and Updates</h3>
                <p className="text-xs text-stone-500 font-medium">
                  By using The Style Zone store or purchasing products, you automatically agree to our data handling procedures outlined above. We may review and upgrade this privacy framework periodically, so please keep check on modifications.
                </p>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
