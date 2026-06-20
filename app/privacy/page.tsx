import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | The Style Zone',
  description: 'Learn how we collect, store, and safeguard your personal information when using our website.',
};

export default function PrivacyPage() {
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
              Privacy <span className="text-[#FE5733]">Policy.</span>
            </h1>
            <p className="text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
              Your privacy matters. We&apos;re committed to protecting your personal information and being transparent about how we use it.
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
                <h2 className="text-xl font-black uppercase tracking-tight font-display text-black mb-4">1. Information We Collect</h2>
                <p className="text-sm text-black/70 leading-relaxed mb-4">
                  We collect information you provide directly when you interact with our services, including your name, email address, phone number, shipping address, and payment details.
                </p>
                <p className="text-sm text-black/60">
                  <span className="font-black text-black">Technical Data:</span> IP address, device type, browser information, and session data for analytics and security purposes.
                </p>
              </div>

              {/* Section 2 */}
              <div className="bg-[#F9F9F9] rounded-xl p-8 md:p-12 animate-on-scroll">
                <h2 className="text-xl font-black uppercase tracking-tight font-display text-black mb-4">2. Data Security</h2>
                <p className="text-sm text-black/70 leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, or disclosure.
                </p>
                <ul className="space-y-2 text-sm text-black/60">
                  <li>SSL/TLS encryption for all data transmissions</li>
                  <li>Secure payment gateways (no raw card data storage)</li>
                  <li>Regular security audits and system updates</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="bg-[#F9F9F9] rounded-xl p-8 md:p-12 animate-on-scroll">
                <h2 className="text-xl font-black uppercase tracking-tight font-display text-black mb-4">3. How We Use Your Information</h2>
                <p className="text-sm text-black/70 leading-relaxed mb-4">
                  Your information helps us process orders, improve our services, and provide relevant communication about your purchases.
                </p>
                <p className="text-sm text-black/70">
                  <span className="font-black text-black">Order Processing:</span> Payment, shipping, and customer service
                </p>
                <p className="text-sm text-black/70 mt-2">
                  <span className="font-black text-black">Communication:</span> Order updates and support (with consent)
                </p>
              </div>

              {/* Section 4 */}
              <div className="bg-[#F9F9F9] rounded-xl p-8 md:p-12 animate-on-scroll">
                <h2 className="text-xl font-black uppercase tracking-tight font-display text-black mb-4">4. Cookies & Tracking</h2>
                <p className="text-sm text-black/70 leading-relaxed mb-4">
                  We use cookies to maintain your shopping cart, remember preferences, and analyze site traffic to improve your experience.
                </p>
                <p className="text-sm text-black/60">
                  <span className="font-black text-black">Essential Cookies:</span> Required for basic functionality including checkout and cart management.
                </p>
              </div>

              {/* Section 5 */}
              <div className="bg-[#F9F9F9] rounded-xl p-8 md:p-12 animate-on-scroll">
                <h2 className="text-xl font-black uppercase tracking-tight font-display text-black mb-4">5. Your Privacy Rights</h2>
                <p className="text-sm text-black/70 leading-relaxed">
                  You have the right to access, correct, or delete your personal information. Contact us to exercise these rights or opt-out of marketing communications.
                </p>
              </div>

            </div>

            {/* Contact Section */}
            <div className="mt-16 pt-12 border-t-2 border-black animate-on-scroll">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <p className="text-sm text-black/70 mb-1">Have questions about your privacy?</p>
                  <p className="text-xs text-black/40 uppercase tracking-widest">Our team is here to help.</p>
                </div>
                <a 
                  href="/contact" 
                  className="bg-[#FE5733] hover:bg-black text-white px-8 py-4 shrink-0 transition-colors uppercase tracking-widest text-xs font-bold rounded-sm"
                >
                  Contact Us
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
