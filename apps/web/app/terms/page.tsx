"use client";

import Navbar from "../../components/Navbar";
import { FileCheck, ShieldAlert, Scale, AlertCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF3E0] font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-[#0F172A] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4">
            <FileCheck className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Please read these terms carefully before using RentMate India.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-10 space-y-8 text-gray-600 leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Scale className="h-6 w-6 text-[#0052FF]" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using RentMate, you accept and agree to be bound by the terms and provisions of this agreement. In addition, when using RentMate's services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-[#0052FF]" />
              2. User Responsibilities & Conduct
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Accuracy of Information:</strong> Property owners must ensure all property details, photos, and availability status are accurate and up-to-date. Tenants must provide truthful KYC and contact details.</li>
              <li><strong>Lawful Use:</strong> You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.</li>
              <li><strong>Prohibited Actions:</strong> Spamming, uploading fraudulent listings, scraping data, or attempting to bypass our security features will result in an immediate permanent ban.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-[#0052FF]" />
              3. Liability & Disclaimers
            </h2>
            <p className="mb-3">
              RentMate acts purely as a technological facilitator connecting prospective tenants with property owners. 
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>We do not act as a real estate agent or broker.</li>
              <li>We are not a party to any rental agreements or transactions made between users.</li>
              <li>While we strive to verify users, we make no guarantees regarding the condition of properties, the character of tenants, or the financial outcomes of any agreements.</li>
              <li>RentMate shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4">4. Account Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account and your access to the platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>
          
        </div>
      </div>
    </div>
  );
}
