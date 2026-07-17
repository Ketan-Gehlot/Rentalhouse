"use client";

import Navbar from "../../components/Navbar";
import Link from "next/link";
import { Shield, FileText, Lock, Users, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF3E0] font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-[#0F172A] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Last updated: July 2026 • Compliant with the Digital Personal Data Protection (DPDP) Act, 2023
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-10 space-y-8 text-gray-600 leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-[#0052FF]" />
              1. Introduction
            </h2>
            <p>
              Welcome to <strong>RentMate India</strong> ("we", "our", "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy informs you about how we look after your personal data when you visit our website, list a property, or use our rental services, and tells you about your privacy rights and how the law protects you.
            </p>
            <p className="mt-2">
              This policy is designed to comply with the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> of India and other applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-[#0052FF]" />
              2. The Data We Collect About You
            </h2>
            <p className="mb-3">Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Identity Data:</strong> First name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> Email address and telephone numbers.</li>
              <li><strong>KYC Data (For Verification):</strong> Government-issued identifiers such as Aadhaar or PAN card details. <em>(Note: We strictly use this solely for verifying trust and safety between tenants and owners.)</em></li>
              <li><strong>Location Data:</strong> Your city, state, pincode, and exact property locations if you are an owner.</li>
              <li><strong>Technical Data:</strong> Internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website and services (e.g., properties saved, visit requests made).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-[#0052FF]" />
              3. How We Use Your Personal Data
            </h2>
            <p className="mb-3">We will only use your personal data for the purpose for which we collected it, which includes the following:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To register you as a new user and manage your account.</li>
              <li>To provide our rental matching services (connecting tenants with verified owners).</li>
              <li>To verify your identity (KYC) to maintain a secure and trustworthy platform for all users.</li>
              <li>To process and deliver your requests (e.g., scheduling property visits).</li>
              <li>To manage our relationship with you, which will include notifying you about changes to our terms or privacy policy.</li>
              <li>To administer and protect our business and this website (including troubleshooting, data analysis, testing, and system maintenance).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4">4. Consent and Withdrawal</h2>
            <p>
              By using RentMate, you consent to the collection and use of your personal data as described in this policy. As per the DPDP Act, you have the right to withdraw your consent at any time. If you withdraw your consent, we may not be able to provide certain products or services to you. To withdraw consent, please contact our Grievance Officer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4">5. Disclosures of Your Personal Data</h2>
            <p className="mb-3">We may have to share your personal data with the parties set out below for the purposes set out in Section 3:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Platform Users:</strong> If you are a tenant requesting a visit, your basic contact details are shared with the property owner. If you are an owner, your property details and basic contact information are visible to prospective tenants.</li>
              <li><strong>Service Providers:</strong> IT and system administration services (e.g., AWS for hosting, Cloudinary for image storage, Clerk for secure authentication).</li>
              <li><strong>Legal Authorities:</strong> To whom we are legally required to disclose information under Indian law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4">6. Data Security</h2>
            <p>
              We have put in place appropriate technical and organizational security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4">7. Your Legal Rights (DPDP Act, 2023)</h2>
            <p className="mb-3">Under certain circumstances, you have rights under the Digital Personal Data Protection Act in relation to your personal data:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Right to Access:</strong> Request access to your personal data and information about how it is being processed.</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate or out-of-date personal data.</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data when it is no longer necessary for the purpose for which it was collected, or if you withdraw your consent.</li>
              <li><strong>Right to Grievance Redressal:</strong> The right to have your grievances resolved by our Grievance Officer.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Mail className="h-6 w-6 text-[#0052FF]" />
              8. Grievance Officer
            </h2>
            <p>
              In accordance with the DPDP Act, the name and contact details of the Grievance Officer are provided below. If you have any complaints or concerns regarding the processing of your personal data, you may contact:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="font-semibold text-[#0F172A]">Grievance Officer, RentMate India</p>
              <p>Email: <a href="mailto:ketangehlot09@gmail.com" className="text-[#0052FF] hover:underline">ketangehlot09@gmail.com</a></p>
              <p>Working Hours: 9:00 AM to 6:00 PM (Monday to Friday)</p>
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
}
