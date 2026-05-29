import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Eye, Lock, Cookie, Database, UserCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | The Style Zone',
  description: 'Learn how we collect, store, and safeguard your personal information when using our website.',
};

export default function PrivacyPage() {
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
                Privacy & Security
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-[#121212] font-display mb-4">
              Privacy <span className="text-[#FE5733]">Policy</span>
            </h1>
            <p className="text-sm md:text-base text-stone-500 max-w-2xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
            <p className="text-xs text-stone-400 font-mono mt-4">Last Updated: May 29, 2026</p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
            
            {/* Section 1: Data Collection */}
            <div className="p-8 md:p-10 border-b border-stone-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#121212] flex items-center justify-center text-white flex-shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#121212] mb-2">1. Information We Collect</h2>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    We collect information you provide directly, including name, email, phone number, shipping address, and payment details when you place an order.
                  </p>
                  <div className="bg-stone-50 p-4 rounded-lg">
                    <h3 className="text-sm font-bold text-[#121212] mb-2">Technical Information</h3>
                    <p className="text-xs text-stone-600">IP address, device type, browser information, and session data for analytics and security purposes.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Data Security */}
            <div className="p-8 md:p-10 border-b border-stone-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#FE5733] flex items-center justify-center text-white flex-shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#121212] mb-2">2. Data Security Measures</h2>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, or disclosure.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-stone-600">
                      <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>SSL/TLS encryption for all data transmissions</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-stone-600">
                      <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Secure payment gateways (never store raw card data)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-stone-600">
                      <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Regular security audits and updates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: Data Usage */}
            <div className="p-8 md:p-10 border-b border-stone-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#121212] flex items-center justify-center text-white flex-shrink-0">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#121212] mb-2">3. How We Use Your Information</h2>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    Your information is used to process orders, improve our services, and communicate with you about your purchases.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-stone-50 p-4 rounded-lg">
                      <h3 className="text-sm font-bold text-[#121212] mb-1">Order Processing</h3>
                      <p className="text-xs text-stone-600">Payment processing, shipping, and customer service</p>
                    </div>
                    <div className="bg-stone-50 p-4 rounded-lg">
                      <h3 className="text-sm font-bold text-[#121212] mb-1">Communication</h3>
                      <p className="text-xs text-stone-600">Order updates, promotions (with consent), and support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Cookies */}
            <div className="p-8 md:p-10 border-b border-stone-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#FE5733] flex items-center justify-center text-white flex-shrink-0">
                  <Cookie className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#121212] mb-2">4. Cookies & Tracking</h2>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    We use cookies to maintain your shopping cart, remember preferences, and analyze site traffic to improve user experience.
                  </p>
                  <div className="bg-[#FE5733]/10 border border-[#FE5733]/20 p-4 rounded-lg">
                    <p className="text-sm font-bold text-[#121212] mb-1">Essential Cookies:</p>
                    <p className="text-xs text-stone-600">Required for basic site functionality including checkout and cart management</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Your Rights */}
            <div className="p-8 md:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-stone-800 flex items-center justify-center text-white flex-shrink-0">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#121212] mb-2">5. Your Privacy Rights</h2>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    You have the right to access, correct, or delete your personal information. Contact us to exercise these rights or opt-out of marketing communications.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-xs text-stone-400 font-mono mb-4">
              Questions about your privacy? Contact our privacy team.
            </p>
            <a href="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-[#121212] hover:text-[#FE5733] underline">
              Contact Us
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
