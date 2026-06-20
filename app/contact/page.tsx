'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('success');
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => {
      setStatus('idle');
    }, 4000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
      <Navbar />

      <main className="flex-grow">
        
        {/* Hero Section - Black background */}
        <section className="bg-black text-white py-24 px-6 md:px-10">
          <div className="max-w-[1560px] mx-auto">
            <p className="text-xs font-bold tracking-[0.3em] text-[#FE5733] uppercase mb-4">
              THE STYLE ZONE • SUPPORT
            </p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display leading-none mb-6">
              Get in <span className="text-[#FE5733]">Touch.</span>
            </h1>
            <p className="text-sm md:text-base text-white/60 max-w-2xl leading-relaxed">
              Visit our boutique in Mahendranagar or reach out online. We&apos;re here to help you find your perfect style.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="bg-white py-24 px-6 md:px-10">
          <div className="max-w-[1560px] mx-auto">
            
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
              
              {/* Contact Info Card */}
              <div className="bg-[#F9F9F9] rounded-xl p-8 md:p-12 animate-on-scroll">
                <h3 className="text-xl font-black uppercase tracking-tight font-display text-black mb-8">
                  Contact Information
                </h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-black mb-1">Address</h4>
                      <p className="text-sm text-black/70 leading-relaxed">
                        The Style Zone<br />
                        Street No. 2, Bhimdatta-4<br />
                        Mahendranagar, Kanchanpur, Nepal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-black mb-1">Phone</h4>
                      <p className="text-sm text-black/70">+977 984-8123456</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-black mb-1">Email</h4>
                      <p className="text-sm text-black/70">contact@thestylezone.com.np</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-black mb-1">Hours</h4>
                      <p className="text-sm text-black/70 leading-relaxed">
                        Sunday - Friday: 10:00 AM - 8:30 PM<br />
                        Saturday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form Card */}
              <div className="bg-[#F9F9F9] rounded-xl p-8 md:p-12 animate-on-scroll">
                <h3 className="text-xl font-black uppercase tracking-tight font-display text-black mb-8">
                  Send us a message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 block">Name</label>
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name" 
                      className="w-full text-sm h-12 bg-white rounded-xl px-4 font-medium text-black placeholder:text-stone-400 outline-none border border-transparent focus:border-black transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 block">Email</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com" 
                      className="w-full text-sm h-12 bg-white rounded-xl px-4 font-medium text-black placeholder:text-stone-400 outline-none border border-transparent focus:border-black transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 block">Message</label>
                    <textarea 
                      required 
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?" 
                      className="w-full text-sm bg-white rounded-xl px-4 py-3 font-medium text-black placeholder:text-stone-400 outline-none border border-transparent focus:border-black resize-none transition-all duration-200"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full h-12 bg-[#FE5733] hover:bg-black text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Send className="w-4 h-4" /> Send Message
                  </button>

                </form>

                {status === 'success' && (
                  <div className="mt-5 bg-black text-white text-xs font-black uppercase tracking-widest p-4 rounded-xl flex items-center gap-3 border-l-4 border-[#FE5733]">
                    <CheckCircle className="w-5 h-5 text-[#FE5733] shrink-0" />
                    Message sent successfully! We&apos;ll get back to you soon.
                  </div>
                )}

              </div>

            </div>

            {/* Map Section */}
            <div className="bg-[#F9F9F9] rounded-xl overflow-hidden animate-on-scroll">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.1234567890123!2d80.12345678901234!3d28.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDAnNDQuNCJOIDgwwrA3JzI0LjQiIkU!5e0!3m2!1sen!2snp!4v1234567890123"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full pointer-events-auto"
              />
            </div>
            <div className="text-center mt-6">
              <a 
                href="https://maps.app.goo.gl/wnT364rpT3dJE1gu7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-black/60 hover:text-[#FE5733] font-black uppercase tracking-widest transition-colors inline-flex items-center gap-2"
              >
                Open in Google Maps <Send className="w-3 h-3" />
              </a>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
