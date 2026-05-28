import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HelpCircle, Check, Scale, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | The Style Zone',
  description: 'Understand the terms, guidelines, and conditions for ordering from The Style Zone online.',
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F3]">
      <Navbar />

      <main className="flex-grow py-12 md:py-20 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-[4px] p-8 md:p-12 border border-stone-200 shadow-sm space-y-8">
            
            {/* Header portion */}
            <div className="border-b border-stone-200 pb-8 space-y-3.5">
              <div className="flex items-center gap-1.5 text-[#E11D48] bg-[#E11D48]/10 px-3 py-1 rounded-full w-fit">
                <Scale className="w-4 h-4 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wider">Governing Agreement</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-[#121212] tracking-tight">TERMS OF SERVICE</h1>
              <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Last Updated: May 26, 2026</p>
            </div>

            {/* Core Terms layout */}
            <div className="space-y-8 text-sm text-stone-600 leading-relaxed font-sans">
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-[4px] bg-stone-100 flex items-center justify-center text-[#121212] shrink-0 mt-1">
                  <BookOpen className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-base font-extrabold text-[#121212] uppercase tracking-tight">1. General Purchasing</h2>
                  <p>
                    By placing an order within The Style Zone, you confirm that you are of legal age or have parental clearance to process credit, debit, or local digital wallet checkouts. All product listings are subject to real-time available stock which is continuously mapped locally.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-[4px] bg-stone-100 flex items-center justify-center text-[#121212] shrink-0 mt-1">
                  <Check className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-base font-extrabold text-[#121212] uppercase tracking-tight">2. Prices, Duties, and Taxes</h2>
                  <p>
                    All listed retail rates are in <strong>Nepalese Rupees (Rs)</strong> and include relevant local retail taxes. We reserve the right to run seasonal markdowns, discount codes, or modify pricing lists at our absolute discretion.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-[4px] bg-stone-100 flex items-center justify-center text-[#121212] shrink-0 mt-1">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-base font-extrabold text-[#121212] uppercase tracking-tight">3. Returns & Refunds Policy</h2>
                  <p>
                    We offer a 15-day return option for unworn, unwashed clothing, and footwear in their pristine original tag packing. Returns must be authorized through our support portal or direct flagship branch. Return transport costs are covered by the buyer unless a defective item was dispatched.
                  </p>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <h3 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-2">Legal Compliance</h3>
                <p className="text-xs text-stone-500 font-medium">
                  This service is operated and governed under the local commercial regulatory laws of Nepal. If you have any further doubts regarding our retail liabilities or digital shop provisions, feel free to contact us via support channel.
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
