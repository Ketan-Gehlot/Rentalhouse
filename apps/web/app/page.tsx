"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  MapPin,
  Shield,
  CheckCircle,
  Home as HomeIcon,
  Users,
  Zap,
  Check,
  Heart,
  Maximize2,
  ArrowRight,
  PlusCircle,
  Building2,
  Key
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";

export default function Home() {
  const { userId, getToken, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [searchCity, setSearchCity] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);

  useEffect(() => {
    if (isLoaded && userId) {
      fetchRole();
    }
    fetchFeaturedProperties();
  }, [isLoaded, userId]);

  const fetchFeaturedProperties = async () => {
    try {
      setIsLoadingFeatured(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/properties`);
      if (res.ok) {
        const data = await res.json();
        setFeaturedProperties(data.slice(0, 9));
      }
    } catch (e) {
      console.error("Failed to fetch featured properties", e);
    } finally {
      setIsLoadingFeatured(false);
    }
  };

  const fetchRole = async () => {
    try {
      const token = await getToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRole(data.role);
      }
    } catch (e) {
      console.error("Failed to fetch profile", e);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      router.push(`/properties?city=${encodeURIComponent(searchCity.trim())}`);
    } else {
      router.push('/properties');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0]" style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}>
      {/* ====== NAVIGATION ====== */}
      <Navbar />

      {/* ====== HERO SECTION ====== */}
      <section className="relative overflow-hidden bg-[#FAF3E0]">
        {/* Subtle background gradient on left side */}
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-emerald-50/60 via-blue-50/40 to-transparent blur-3xl" />
        
        <div className="relative mx-auto w-full px-4 sm:px-6 md:px-10 pb-20 pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-12 xl:gap-12">
            {/* Left Content */}
            <div className="lg:col-span-5 xl:col-span-5 xl:pl-4">
              {role === "OWNER" ? (
                // OWNER HERO
                <>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#f1f3f5] px-3.5 py-1.5">
                    <Shield className="h-3.5 w-3.5 text-[#0052FF]" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-600">
                      For Property Owners
                    </span>
                  </div>

                  <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] xl:text-[52px] font-bold leading-[1.1] tracking-tight text-[#0F172A]">
                    Rent Your Space
                    <br />
                    with Confidence
                  </h1>

                  <p className="mt-6 max-w-[460px] text-[15px] leading-[1.7] text-gray-500">
                    List your property, find verified tenants, and manage your rentals with zero hassle. Join thousands of owners earning securely on RentMate.
                  </p>

                  <div className="mt-10 flex items-center gap-4">
                    <Link href="/list-property" className="flex h-14 items-center gap-2 rounded-xl bg-[#0F172A] px-8 font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg">
                      <PlusCircle className="h-5 w-5" />
                      List a Property
                    </Link>
                    <Link href="/properties/manage" className="flex h-14 items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50">
                      <Building2 className="h-5 w-5" />
                      Manage Listings
                    </Link>
                  </div>
                  
                  <div className="mt-8 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-[12px] font-bold text-gray-600">Verified Tenants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-[12px] font-bold text-gray-600">Free Listing</span>
                    </div>
                  </div>
                </>
              ) : (
                // TENANT OR UNAUTHENTICATED HERO
                <>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#f1f3f5] px-3.5 py-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-[#0052FF]" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-600">
                      Verified Premium Homes
                    </span>
                  </div>

                  <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] xl:text-[52px] font-bold leading-[1.1] tracking-tight text-[#0F172A]">
                    Find Your Perfect
                    <br />
                    Space in India
                  </h1>

                  <p className="mt-6 max-w-[460px] text-[15px] leading-[1.7] text-gray-500">
                    Discover premium living spaces with direct owners, zero brokerage, and 100% verified listings. Your next home is just a search away.
                  </p>

                  {/* Search Form Box */}
                  <div className="mt-12 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="rounded-3xl bg-white/70 backdrop-blur-xl p-2 sm:p-3 shadow-2xl shadow-[#0052FF]/10 ring-1 ring-white/50">
                      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 sm:py-4 shadow-sm ring-1 ring-gray-100 transition-shadow focus-within:ring-2 focus-within:ring-[#0052FF]/20">
                          <MapPin className="h-5 w-5 text-[#0052FF]" />
                          <input
                            type="text"
                            value={searchCity}
                            onChange={(e) => setSearchCity(e.target.value)}
                            placeholder="Search by city (e.g. Bangalore, Mumbai)..."
                            className="w-full bg-transparent text-[15px] sm:text-[17px] text-gray-800 placeholder:text-gray-400 focus:outline-none"
                          />
                        </div>
                        <button type="submit" className="w-full sm:w-auto shrink-0 rounded-2xl bg-[#0052FF] px-8 py-3 sm:py-4 text-[15px] sm:text-[17px] font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-500/40">
                          <Search className="h-5 w-5 sm:hidden" />
                          <span className="hidden sm:inline">Search</span>
                        </button>
                      </form>
                    </div>
                  </div>

                  {!userId && (
                    <div className="mt-8 flex items-center gap-4">
                      <span className="text-sm text-gray-500 font-medium">Are you a property owner?</span>
                      <Link href="/sign-up" className="text-sm font-semibold text-[#0052FF] hover:underline">
                        List your property here
                      </Link>
                    </div>
                  )}

                  <div className="mt-8 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-[12px] font-bold text-gray-600">10k+ Properties</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#0052FF]" />
                      <span className="text-[12px] font-bold text-gray-600">Zero Brokerage</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Image */}
            <div className="relative lg:col-span-7 xl:col-span-7">
              <div className="overflow-hidden rounded-[32px] shadow-2xl shadow-gray-200/50">
                <img
                  src="/hero-property.png"
                  alt="Premium living space"
                  className="h-[300px] sm:h-[400px] lg:h-[520px] xl:h-[580px] w-full object-cover"
                />
              </div>

              {/* Overlay Card */}
              <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-2xl bg-white/85 px-6 py-4 shadow-xl backdrop-blur-md">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0052FF]">
                  {role === "OWNER" ? <Key className="h-5 w-5 text-white" /> : <Shield className="h-5 w-5 text-white" />}
                </div>
                <div className="min-w-max">
                  <p className="text-[14px] font-bold text-[#0F172A]">
                    {role === "OWNER" ? "Find Reliable Tenants" : "100% Verified Owners"}
                  </p>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    {role === "OWNER" ? "Zero brokerage, completely secure." : "Connect directly, skip the middleman."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== A BETTER WAY TO RENT ====== */}
      <section className="relative overflow-hidden border-t border-[#E6DAB9]/60 bg-[#FAF3E0] py-24">
        {/* Subtle dot pattern background */}
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.2 }} />
        <div className="relative mx-auto w-full px-2">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="text-[28px] font-bold tracking-tight text-[#0F172A]">
              A Better Way to Rent
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[14px] text-gray-500">
              We&apos;ve redesigned the rental experience to be transparent, fast,
              and entirely digital.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
            {/* Card 1 - Direct Owners Only */}
            <div className="group rounded-2xl border border-gray-100 bg-[#f8f9fb] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-gray-100">
                <Users className="h-5 w-5 text-[#0F172A]" />
              </div>
              <h3 className="mb-2 text-[15px] font-semibold text-[#0F172A]">
                Direct Owners Only
              </h3>
              <p className="text-[13px] leading-relaxed text-gray-500">
                Say goodbye to hefty brokerage fees. We connect you directly
                with verified property owners.
              </p>
            </div>

            {/* Card 2 - 100% Verified Listings */}
            <div className="group rounded-2xl border border-gray-100 bg-[#f8f9fb] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-gray-100">
                <Shield className="h-5 w-5 text-[#0F172A]" />
              </div>
              <h3 className="mb-2 text-[15px] font-semibold text-[#0F172A]">
                100% Verified Listings
              </h3>
              <p className="text-[13px] leading-relaxed text-gray-500">
                Every property is physically visited and verified by our team
                before it goes live on the platform.
              </p>
            </div>

            {/* Card 3 - Instant Digital Agreements */}
            <div className="group rounded-2xl border border-gray-100 bg-[#f8f9fb] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-gray-100">
                <Zap className="h-5 w-5 text-[#0F172A]" />
              </div>
              <h3 className="mb-2 text-[15px] font-semibold text-[#0F172A]">
                Instant Digital Agreements
              </h3>
              <p className="text-[13px] leading-relaxed text-gray-500">
                Sign your lease digitally and move in faster. Seamless, legally
                binding, and completely paperless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== PREMIUM SPACES ====== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF3E0] to-[#EFE3C8] py-24">
        <div className="pointer-events-none absolute -left-40 top-1/2 h-[600px] w-[600px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-indigo-100/40 blur-3xl" />
        <div className="relative mx-auto w-full px-2">
          {/* Section Header */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-[26px] font-bold tracking-tight text-[#0F172A]">
                Premium Spaces
              </h2>
              <p className="mt-1 text-[13px] text-gray-500">
                Handpicked properties ready for move-in.
              </p>
            </div>
            <Link
              href="/properties"
              className="hidden items-center gap-1 text-[13px] font-medium text-[#3B82F6] transition-colors hover:text-[#2563EB] md:flex"
            >
              View all properties
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Property Cards Grid */}
          <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
            {isLoadingFeatured ? (
              <div className="col-span-3 py-10 text-center text-gray-500">
                Loading featured properties...
              </div>
            ) : featuredProperties.length === 0 ? (
              <div className="col-span-3 py-10 text-center text-gray-500">
                No properties available yet. Check back soon!
              </div>
            ) : (
              featuredProperties.map((property) => (
                <div key={property.id} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative">
                    <Image
                      src={property.media?.[0]?.url || "/property-1.png"}
                      alt={property.title}
                      width={400}
                      height={280}
                      className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Top Badges */}
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[#0F172A] shadow-sm backdrop-blur-sm">
                        ✨ Featured
                      </span>
                    </div>
                    <button className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md">
                      <Heart className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                    {/* Bottom Badges on Image */}
                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                      {property.bhkType && (
                        <span className="rounded bg-[#0F172A]/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                          {property.bhkType}
                        </span>
                      )}
                      {property.furnishing && (
                        <span className="rounded bg-[#0F172A]/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                          {property.furnishing.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[14px] font-semibold text-[#0F172A] truncate pr-2">
                        {property.title}
                      </h3>
                      <div>
                        <span className="text-[15px] font-bold text-[#0F172A]">₹{property.rent?.toLocaleString('en-IN')}</span>
                        <span className="text-[11px] text-gray-400">/mo</span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span className="text-[11px] truncate">{property.city}, {property.state}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Maximize2 className="h-3 w-3" />
                        <span>{property.propertyType?.replace('_', ' ')}</span>
                      </div>
                      <Link
                        href={`/properties/${property.id}`}
                        className="rounded-lg border border-[#3B82F6]/20 bg-blue-50/50 px-3 py-1 text-[11px] font-medium text-[#3B82F6] transition-colors hover:bg-blue-50"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-[#E6DAB9] bg-[#FAF3E0] py-16">
        <div className="mx-auto w-full px-2">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center">
                <span className="text-[15px] font-bold text-[#0F172A]">
                  RentMate
                </span>
              </Link>
              <p className="mt-2.5 text-[11px] leading-relaxed text-gray-500">
                Simplifying real estate in India with technology, transparency,
                and trust.
              </p>
              <p className="mt-3 text-[10px] text-gray-400">
                © 2024 RentMate India. Premium Living Spaces.
              </p>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-3 text-[13px] font-semibold text-[#0F172A]">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-[12px] text-gray-500 transition-colors hover:text-[#0F172A]"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/partners"
                    className="text-[12px] text-gray-500 transition-colors hover:text-[#0F172A]"
                  >
                    Verified Partners
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-[12px] text-gray-500 transition-colors hover:text-[#0F172A]"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-3 text-[13px] font-semibold text-[#0F172A]">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-[12px] text-gray-500 transition-colors hover:text-[#0F172A]"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-[12px] text-gray-500 transition-colors hover:text-[#0F172A]"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get the App */}
            <div>
              <h4 className="mb-3 text-[13px] font-semibold text-[#0F172A]">
                Get the App
              </h4>
              <div className="flex gap-2.5">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#0F172A]" fill="currentColor">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.97 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                  </svg>
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#0F172A]" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
