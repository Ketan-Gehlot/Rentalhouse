"use client";

import Navbar from "../../components/Navbar";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAF3E0] font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-[#0F172A] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4">
            <MessageSquare className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            We're here to help. Get in touch with our team for any support or inquiries.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-10 text-gray-600">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-[#0F172A]">Get in Touch</h2>
              <p className="text-gray-500">
                Whether you have a question about listings, need technical support, or want to partner with us, our team is ready to respond.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Mail className="h-6 w-6 text-[#0052FF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F172A]">Email Us</h3>
                    <p className="text-sm mt-1">For support and general queries:</p>
                    <a href="mailto:ketangehlot09@gmail.com" className="text-[#0052FF] hover:underline font-medium">ketangehlot09@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Phone className="h-6 w-6 text-[#0052FF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F172A]">Call Us</h3>
                    <p className="text-sm mt-1">Available Mon-Fri, 9am - 6pm</p>
                    <p className="text-[#0F172A] font-medium">+91 99999 99999</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <MapPin className="h-6 w-6 text-[#0052FF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F172A]">Office</h3>
                    <p className="text-sm mt-1">RentMate India Headquarters</p>
                    <p className="text-[#0F172A] font-medium mt-1">New Delhi, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-[#FAF3E0] p-6 sm:p-8 rounded-xl border border-[#E6DAB9]">
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">Send a Message</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! We'll get back to you soon."); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF]" placeholder="Your name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF]" placeholder="Your email address" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows={4} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF]" placeholder="How can we help?" required></textarea>
                </div>
                <button type="submit" className="w-full bg-[#0052FF] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
