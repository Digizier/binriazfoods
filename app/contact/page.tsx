"use client";

import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Clock } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF55]">
          Customer Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0B3826]">
          Contact Bin Riaz Foods
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Have an inquiry regarding wholesale bulk spices, custom wedding hampers, or order status? We are here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#E5E1D6] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0B3826] pb-3 border-b border-[#E5E1D6]">
              Direct Contact Details
            </h2>

            <div className="flex items-start space-x-3 text-xs text-gray-700">
              <div className="p-2.5 rounded-xl bg-[#FAF6EC] text-[#0B3826] shrink-0">
                <MapPin className="w-5 h-5 text-[#D4AF55]" />
              </div>
              <div>
                <p className="font-bold text-[#0B3826]">Head Office & Dispatch Center:</p>
                <p className="mt-0.5 leading-relaxed">
                  Main Khushab Road, Opposite Qureshi Arcade, Sargodha, Punjab, Pakistan
                </p>
                <a
                  href="https://maps.google.com/?q=Main+Khushab+Road+Opposite+Qureshi+Arcade+Sargodha"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-[11px] font-bold text-[#D4AF55] hover:underline mt-1"
                >
                  View on Google Maps &rarr;
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-gray-700">
              <div className="p-2.5 rounded-xl bg-[#FAF6EC] text-[#0B3826] shrink-0">
                <Phone className="w-5 h-5 text-[#D4AF55]" />
              </div>
              <div>
                <p className="font-bold text-[#0B3826]">Helpline Numbers:</p>
                <p className="font-mono mt-0.5">0345 6001913 / 0321 6001913</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-gray-700">
              <div className="p-2.5 rounded-xl bg-[#FAF6EC] text-[#0B3826] shrink-0">
                <Mail className="w-5 h-5 text-[#D4AF55]" />
              </div>
              <div>
                <p className="font-bold text-[#0B3826]">Official Email:</p>
                <p className="mt-0.5">binriazgroup@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-gray-700">
              <div className="p-2.5 rounded-xl bg-[#FAF6EC] text-[#0B3826] shrink-0">
                <Clock className="w-5 h-5 text-[#D4AF55]" />
              </div>
              <div>
                <p className="font-bold text-[#0B3826]">Order Dispatch Hours:</p>
                <p className="mt-0.5">Mon &ndash; Sat: 9:00 AM &ndash; 7:00 PM</p>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Action */}
          <div className="bg-[#0B3826] text-white rounded-3xl p-6 border border-[#D4AF55]/40 shadow-md space-y-3">
            <h3 className="font-bold text-sm text-[#D4AF55]">Instant WhatsApp Assistance</h3>
            <p className="text-xs text-white/80 leading-relaxed">
              Prefer quick messaging? Connect directly with our customer support manager on WhatsApp.
            </p>
            <a
              href="https://wa.me/923456001913?text=Salam%20Bin%20Riaz%20Foods"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-95 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open WhatsApp Chat</span>
            </a>
          </div>
        </div>

        {/* Contact Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E1D6] shadow-xs">
          <h2 className="text-lg font-bold text-[#0B3826] pb-3 border-b border-[#E5E1D6]">
            Send an Inquiry
          </h2>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#0B3826]">Message Received!</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Thank you for reaching out, {name}. A member of our team will call or message you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-[#0B3826] hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Muhammad Ali"
                    className="w-full px-4 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:border-[#D4AF55]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full px-4 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:border-[#D4AF55]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Your Message or Inquiry</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the products or custom gift boxes you are interested in..."
                  className="w-full px-4 py-2.5 bg-[#FAF6EC] border border-[#E5E1D6] rounded-xl text-xs text-gray-800 focus:outline-hidden focus:border-[#D4AF55]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0B3826] hover:bg-[#18583A] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
