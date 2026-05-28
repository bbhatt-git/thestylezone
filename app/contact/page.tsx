'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      <Navbar />

      <main className="flex-grow py-12 px-6 md:px-10">
        <div className="max-w-[1560px] mx-auto">
          
          {/* Header */}
          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.3em] text-[#FE5733] uppercase mb-2 font-mono">THE STYLE ZONE • CONTACT</p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#121212] font-display">
              Get in <span className="text-[#FE5733]">Touch.</span>
            </h1>
            <p className="text-sm opacity-60 max-w-xl mt-2 leading-relaxed">
              Reach out for sizing consultations, offline order pickups, bulk corporate solutions, or immediate WhatsApp support coordinate details.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Info blocks */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Box 1 Address */}
              <div className="bg-white p-6 border border-[#121212]/5 rounded-[4px] flex items-start gap-4 shadow-sm">
                <MapPin className="text-[#FE5733] w-6 h-6 shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212]">Showroom Address</h4>
                  <p className="text-xs text-[#121212]/70 leading-relaxed font-sans">
                    The Style Zone Boutique,<br />
                    Gali No. 2, Bhimdatta-4,<br />
                    Mahendranagar, Kanchanpur,<br />
                    Nepal
                  </p>
                </div>
              </div>

              {/* Box 2 Contacts */}
              <div className="bg-white p-6 border border-[#121212]/5 rounded-[4px] flex items-start gap-4 shadow-sm">
                <Phone className="text-[#FE5733] w-6 h-6 shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212]">Phone Contacts</h4>
                  <p className="text-xs text-[#121212]/70 font-mono">
                    Official Mobile: +977 984-8123456<br />
                    WhatsApp/Viber: +977 981-2345678<br />
                    Direct Desk Support: +977 99-520123
                  </p>
                </div>
              </div>

              {/* Box 3 Email */}
              <div className="bg-white p-6 border border-[#121212]/5 rounded-[4px] flex items-start gap-4 shadow-sm">
                <Mail className="text-[#FE5733] w-6 h-6 shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212]">Digital Support</h4>
                  <p className="text-xs text-[#121212]/70 leading-relaxed font-mono">
                    Support: info@thestylezone.com.np<br />
                    Exchanges: exchange@thestylezone.com.np
                  </p>
                </div>
              </div>

              {/* Box 4 Hours */}
              <div className="bg-white p-6 border border-[#121212]/5 rounded-[4px] flex items-start gap-4 shadow-sm">
                <Clock className="text-[#FE5733] w-6 h-6 shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212]">Showroom Timing</h4>
                  <p className="text-xs text-[#121212]/70 leading-relaxed font-sans">
                    Sunday to Friday: <strong className="text-[#121212]">10:00 AM - 8:30 PM</strong><br />
                    Saturday: <strong className="text-[#FE5733] font-mono">CLOSED (Offline holiday)</strong>
                  </p>
                </div>
              </div>

            </div>

            {/* Middle Interactive Form Column */}
            <div className="lg:col-span-5 bg-white p-6 md:p-8 border border-[#121212]/5 rounded-[4px] shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-[#121212] uppercase tracking-tight flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#FE5733]" /> Message Showroom
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#121212]/50 block">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bhupesh Bhatt" 
                    className="w-full text-xs h-10 border border-[#121212]/10 focus:border-[#FE5733] bg-[#F5F5F0]/20 rounded-[4px] px-3 font-bold text-[#121212] placeholder:text-[#121212]/30" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#121212]/50 block">Your Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. bhupesh@example.com" 
                    className="w-full text-xs h-10 border border-[#121212]/10 focus:border-[#FE5733] bg-[#F5F5F0]/20 rounded-[4px] px-3 font-bold text-[#121212] placeholder:text-[#121212]/30" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#121212]/50 block">Message Details</label>
                  <textarea 
                    required 
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Let us know what apparel collections, colors, or sizing questions you have..." 
                    className="w-full text-xs border border-[#121212]/10 focus:border-[#FE5733] bg-[#F5F5F0]/20 rounded-[4px] p-3 font-bold text-[#121212] placeholder:text-[#121212]/30 outline-none" 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full h-12 bg-[#FE5733] hover:bg-[#121212] text-white rounded-[4px] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>

              </form>

              {status === 'success' && (
                <div className="bg-[#121212] text-white text-xs font-bold uppercase tracking-widest p-4 rounded-[4px] flex items-center gap-3 border-l-4 border-green-500 animate-slide-in">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  Your report has been submitted to Mahendranagar admins! We will reply via email.
                </div>
              )}

            </div>

            {/* Right Visual Map Column */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Map Layout Mock placeholder (elegant SVG styled) */}
              <div className="bg-white p-6 border border-[#121212]/5 rounded-[4px] shadow-sm text-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212] text-left mb-4">Location Map</h4>
                
                <div className="aspect-square bg-[#F5F5F0]/80 rounded-[4px] overflow-hidden flex flex-col justify-center items-center relative border border-[#121212]/10 p-4">
                  
                  {/* Visual Roads */}
                  <div className="absolute w-[3px] h-full bg-[#121212]/15 left-1/4"></div>
                  <div className="absolute w-[3px] h-full bg-[#121212]/15 left-3/4"></div>
                  <div className="absolute h-[3px] w-full bg-[#121212]/15 top-1/3"></div>
                  <div className="absolute h-[3px] w-full bg-[#121212]/15 top-2/3"></div>
                  
                  {/* Road Names */}
                  <span className="absolute text-[8px] font-mono font-bold text-[#121212]/30 uppercase tracking-widest left-2 top-2">Gali No. 2</span>
                  <span className="absolute text-[8px] font-mono font-bold text-[#121212]/30 uppercase tracking-widest right-2 bottom-2">Madan Chowk Main Rd</span>
                  
                  {/* Flag point */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-6 h-6 bg-[#FE5733] border-2 border-white rounded-full flex items-center justify-center text-white scale-125 shadow-md animate-bounce">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <span className="mt-3 bg-[#121212] text-[#F5F5F0] text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-[2px] shadow-sm border border-[#F5F5F0]/10">
                      The Style Zone
                    </span>
                  </div>

                  {/* Distance meter */}
                  <div className="absolute bottom-4 left-4 bg-white/90 border border-[#121212]/10 px-2 py-1 rounded-[2px] text-[8px] font-mono font-bold text-[#121212]">
                    Scale: 1 : 250m
                  </div>
                </div>

                <p className="text-[10px] font-sans text-[#121212]/50 mt-4 leading-relaxed text-left">
                  Showroom is situated precisely at the intersection of Gali No. 2, Bhimdatta-4, only a 3-minute walking distance from the iconic Madan Chowk pivot.
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
