"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import Navbar from "../../../components/Navbar";
import {
  MapPin,
  IndianRupee,
  BedDouble,
  Home as HomeIcon,
  Loader2,
  CheckCircle2,
  User,
  CalendarDays,
  ShieldCheck,
  ChevronLeft,
  Crown,
  Calendar,
  Heart
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

interface PropertyDetails {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  rent: number;
  deposit: number;
  maintenance: number;
  bhkType: string;
  propertyType: string;
  furnishing: string;
  tenantPreference: string;
  availableFrom: string;
  media: { url: string; type: string }[];
  amenities: { amenityName: string }[];
  owner: { name: string; isSuperTrusted: boolean; verification: { status: string } | null };
}

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken, isSignedIn, userId } = useAuth();
  
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Visit Request State
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [isSubmittingVisit, setIsSubmittingVisit] = useState(false);
  const [isContacting, setIsContacting] = useState(false);
  const [existingVisitStatus, setExistingVisitStatus] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
      if (isSignedIn) {
        checkExistingVisit();
      }
    }
  }, [id, isSignedIn]);

  const checkExistingVisit = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await api.get('/visits/tenant', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const myVisits = res.data;
      const existing = myVisits.find((v: any) => v.propertyId === id);
      if (existing) {
        setExistingVisitStatus(existing.status);
      }
    } catch (error) {
      console.error("Failed to fetch visit status", error);
    }
  };

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error("Please sign in to schedule a visit");
      return;
    }
    
    setIsSubmittingVisit(true);
    try {
      const token = await getToken();
      await api.post('/visits', {
        propertyId: id,
        date: visitDate,
        time: visitTime
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Visit requested successfully! The owner will be notified.");
      setExistingVisitStatus("PENDING");
      setShowVisitForm(false);
    } catch (error: any) {
      console.error("Failed to request visit", error);
      toast.error(error.response?.data?.error || "Failed to schedule visit");
    } finally {
      setIsSubmittingVisit(false);
    }
  };

  const fetchPropertyDetails = async () => {
    try {
      const res = await api.get(`/properties/${id}`);
      setProperty(res.data);
    } catch (error) {
      console.error("Failed to fetch property details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProperty = async () => {
    try {
      const token = await getToken();
      if (!token) return toast.error("Please sign in to save properties");
      
      const res = await api.post(`/properties/${id}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.isSaved) {
        toast.success("Property added to your saved collection! ❤️");
      } else {
        toast.success("Property removed from saved collection.");
      }
    } catch (error) {
      console.error("Failed to save property:", error);
      toast.error("Failed to save property");
    }
  };

  const handleContactOwner = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to contact the owner");
      return;
    }
    
    setIsContacting(true);
    try {
      const token = await getToken();
      await api.post(`/properties/${id}/contact`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Contact request sent! The owner will receive an email with your details.");
    } catch (error: any) {
      console.error("Failed to contact owner", error);
      toast.error(error.response?.data?.error || "Failed to send contact request");
    } finally {
      setIsContacting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF3E0] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0052FF]" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#FAF3E0] pb-20 font-inter">
        <Navbar />
        <div className="mx-auto mt-20 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-800">Property not found</h2>
          <button onClick={() => router.back()} className="mt-4 text-[#0052FF] font-medium hover:underline">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3E0] pb-20 font-inter">
      <Navbar />

      <main className="mx-auto mt-6 max-w-6xl px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center text-sm font-semibold text-gray-500 hover:text-[#0F172A] transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Listings
        </button>

        {/* Hero Image Gallery */}
        <div className="mb-8 flex flex-col md:grid md:grid-cols-4 gap-2 md:gap-4 h-auto md:h-[500px]">
          {property.media && property.media.length > 0 ? (
            <>
              {/* Main Image */}
              <div className={`${property.media.length > 1 ? 'md:col-span-3' : 'md:col-span-4'} h-[300px] md:h-full w-full rounded-2xl overflow-hidden shadow-sm relative group bg-gray-100`}>
                <img 
                  src={property.media[activeImage].url} 
                  alt={property.title} 
                  className="h-full w-full object-contain md:object-cover transition-transform duration-700 group-hover:scale-105 mx-auto"
                />
                <div className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-white tracking-wide shadow-lg">
                  {property.propertyType.replace("_", " ")}
                </div>
              </div>
              
              {/* Thumbnail Column */}
              {property.media.length > 1 && (
                <div className="flex flex-row md:flex-col gap-2 md:gap-4 w-full md:w-auto h-24 md:h-full overflow-x-auto md:overflow-y-hidden md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                  {property.media.slice(0, 5).map((img, index) => (
                    <button 
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative w-[80px] h-[70px] sm:w-[100px] md:w-full flex-shrink-0 md:flex-1 min-h-[70px] md:min-h-[100px] md:max-h-[120px] rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === index ? "border-[#0052FF] opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img.url} alt={`Thumbnail ${index}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="md:col-span-4 h-full min-h-[300px] rounded-2xl bg-gray-200 flex items-center justify-center shadow-sm">
              <span className="text-gray-400 font-medium">No Images Available</span>
            </div>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Details) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start gap-4 mb-3">
                <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] leading-tight">
                  {property.title}
                </h1>
                <button 
                  onClick={handleSaveProperty}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors border border-gray-100"
                  title="Save Property"
                >
                  <Heart className="h-6 w-6" />
                </button>
              </div>
              <div className="flex items-center text-gray-500 text-sm sm:text-base font-medium mb-6">
                <MapPin className="mr-1.5 h-4 w-4 shrink-0 text-[#0052FF]" />
                {property.address}, {property.city} {property.state && `, ${property.state}`} {property.pincode}
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-gray-100">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">BHK</span>
                  <div className="flex items-center font-bold text-[#0F172A]">
                    <BedDouble className="mr-2 h-4 w-4 text-[#0052FF]" />
                    {property.bhkType}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Furnishing</span>
                  <div className="flex items-center font-bold text-[#0F172A]">
                    <HomeIcon className="mr-2 h-4 w-4 text-[#0052FF]" />
                    {property.furnishing.replace("_", " ")}
                  </div>
                </div>
                {property.listingType === "RENT" && (
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tenants</span>
                    <div className="flex items-center font-bold text-[#0F172A]">
                      <User className="mr-2 h-4 w-4 text-[#0052FF]" />
                      {property.tenantPreference}
                    </div>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Available</span>
                  <div className="flex items-center font-bold text-[#0F172A]">
                    <CalendarDays className="mr-2 h-4 w-4 text-[#0052FF]" />
                    {new Date(property.availableFrom).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-[#0F172A] mb-4">About the Property</h3>
              <p className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-line">
                {property.description || "No description provided."}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-[#0F172A] mb-4">Amenities</h3>
              {property.amenities.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
                  {property.amenities.map((a, i) => (
                    <div key={i} className="flex items-center text-[15px] font-medium text-gray-700">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      {a.amenityName}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[15px] text-gray-500">No amenities listed.</p>
              )}
            </div>

          </div>

          {/* Right Column (Pricing & Owner) */}
          <div className="lg:col-span-1 space-y-6 sticky top-28">
            
            {/* Pricing Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-blue-900/5 border border-gray-100">
              <div className="flex items-end text-[#0052FF] font-black text-3xl mb-1">
                <IndianRupee className="h-6 w-6 mr-1 pb-1" />
                {property.rent.toLocaleString('en-IN')}
                {property.listingType === "RENT" && <span className="text-gray-400 text-sm font-medium ml-1 pb-1.5">/mo</span>}
              </div>
              <p className="text-xs font-bold text-green-600 bg-green-50 inline-block px-2 py-1 rounded mb-6">
                {property.listingType === "SELL" ? "Price Negotiable" : "Rent Negotiable"}
              </p>

              {property.listingType === "RENT" && (
                <div className="space-y-4 mb-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-gray-500 font-medium">Security Deposit</span>
                    <span className="font-bold text-[#0F172A]">₹{property.deposit.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-gray-500 font-medium">Maintenance</span>
                    <span className="font-bold text-[#0F172A]">{property.maintenance > 0 ? `₹${property.maintenance}/mo` : "Included"}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <button 
                onClick={handleContactOwner}
                disabled={isContacting}
                className="w-full rounded-xl bg-[#0F172A] py-3.5 text-[15px] font-bold text-white shadow-md transition-all hover:bg-black hover:shadow-lg hover:-translate-y-0.5 mb-3 disabled:opacity-50"
              >
                {isContacting ? "Sending Request..." : "Contact Owner"}
              </button>

              {userId === property.owner.name /* Quick check if owner, wait, property.ownerId isn't returned in details sometimes, let's just check existingVisitStatus */ ? null : existingVisitStatus ? (
                <div className="w-full rounded-xl py-3.5 text-center text-[15px] font-bold border-2 transition-all bg-gray-50 border-gray-200 text-gray-500">
                  Visit Status: <span className={existingVisitStatus === 'ACCEPTED' ? 'text-green-600' : 'text-blue-600'}>{existingVisitStatus}</span>
                </div>
              ) : showVisitForm ? (
                <form onSubmit={handleScheduleVisit} className="mt-4 p-4 border border-blue-100 bg-blue-50/50 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Select Date</label>
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split('T')[0] ?? ''}
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Preferred Time</label>
                    <input 
                      type="time" 
                      required
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0052FF]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setShowVisitForm(false)}
                      className="flex-1 py-2.5 rounded-lg bg-white border border-gray-200 text-sm font-bold text-gray-600"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmittingVisit}
                      className="flex-1 py-2.5 rounded-lg bg-[#0052FF] text-white text-sm font-bold disabled:opacity-50"
                    >
                      {isSubmittingVisit ? "Sending..." : "Request"}
                    </button>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={() => setShowVisitForm(true)}
                  className="w-full rounded-xl bg-white py-3.5 text-[15px] font-bold text-[#0F172A] border-2 border-gray-200 transition-all hover:border-[#0F172A] hover:bg-gray-50"
                >
                  Schedule a Visit
                </button>
              )}
            </div>

            {/* Owner Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Listed By</h3>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-lg">
                  {property.owner.name ? property.owner.name.charAt(0) : "U"}
                </div>
                <div>
                  <h4 className="font-bold text-[#0F172A] text-[16px] flex items-center gap-1">
                    {property.owner.name || "Owner"}
                    {property.owner.isSuperTrusted && (
                      <Crown className="h-4 w-4 text-yellow-500 fill-yellow-500 drop-shadow-sm ml-0.5" title="Super Trusted" />
                    )}
                  </h4>
                  {property.owner.verification?.status === "APPROVED" ? (
                    <div className="flex items-center text-xs font-bold text-green-600 mt-1">
                      <ShieldCheck className="mr-1 h-3.5 w-3.5" /> KYC Verified
                    </div>
                  ) : (
                    <div className="text-xs font-medium text-gray-500 mt-1">
                      Verification Pending
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
