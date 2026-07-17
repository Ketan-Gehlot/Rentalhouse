"use client";

import Navbar from "../../components/Navbar";
import { Info, Target, Users, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF3E0] font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-[#0F172A] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4">
            <Info className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">About RentMate</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Simplifying real estate in India with technology, transparency, and trust.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-10 space-y-10 text-gray-600 leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Target className="h-6 w-6 text-[#0052FF]" />
              Our Mission
            </h2>
            <p>
              Finding a home in India should not be a stressful, confusing, or hidden process. At RentMate, our mission is to eliminate the friction between property owners and tenants by providing a transparent, verified, and highly secure platform. We believe in direct connections, eliminating unnecessary middlemen, and ensuring trust at every step of the rental journey.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-[#0052FF]" />
              Who We Are
            </h2>
            <p>
              We are a team of passionate developers, real estate experts, and designers who experienced the pain of renting homes first-hand. RentMate was born out of a desire to build a platform that respects both the owner's property and the tenant's time. We leverage cutting-edge technology, AI verification, and seamless UI to make property renting a 21st-century experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-[#0052FF]" />
              Why Choose Us?
            </h2>
            <ul className="list-disc pl-5 space-y-3 mt-3">
              <li><strong>Zero Spam:</strong> Say goodbye to endless promotional calls. We only connect you when there's genuine interest.</li>
              <li><strong>Verified Listings:</strong> Every owner and property goes through our checks to ensure you are seeing real, available homes.</li>
              <li><strong>Direct Contact:</strong> Skip the brokers. Tenants and owners communicate directly to finalize terms that work for everyone.</li>
              <li><strong>Bank-Level Security:</strong> Your data is protected by the same encryption standards used by leading global banks.</li>
            </ul>
          </section>
          
        </div>
      </div>
    </div>
  );
}
