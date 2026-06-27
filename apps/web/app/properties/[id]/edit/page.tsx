"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { api } from "../../../../lib/api";
import Navbar from "../../../../components/Navbar";
import {
  ChevronLeft,
  Loader2,
  CheckCircle,
} from "lucide-react";

const PROPERTY_TYPES = ["FLAT", "INDEPENDENT_HOUSE", "VILLA", "PG", "ROOM"];
const BHK_TYPES = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"];
const FURNISHING_TYPES = ["FULLY_FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"];

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "FLAT",
    bhkType: "2 BHK",
    address: "",
    city: "",
    state: "",
    pincode: "",
    rent: "",
    deposit: "",
    maintenance: "",
    furnishing: "SEMI_FURNISHED",
    availableFrom: "",
    tenantPreference: "ANY",
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (id && isSignedIn) {
      fetchProperty();
    }
  }, [id, isLoaded, isSignedIn]);

  const fetchProperty = async () => {
    try {
      const res = await api.get(`/properties/${id}`);
      const p = res.data;
      setFormData({
        title: p.title || "",
        description: p.description || "",
        propertyType: p.propertyType || "FLAT",
        bhkType: p.bhkType || "2 BHK",
        address: p.address || "",
        city: p.city || "",
        state: p.state || "",
        pincode: p.pincode || "",
        rent: p.rent ? p.rent.toString() : "",
        deposit: p.deposit ? p.deposit.toString() : "",
        maintenance: p.maintenance ? p.maintenance.toString() : "",
        furnishing: p.furnishing || "SEMI_FURNISHED",
        availableFrom: p.availableFrom ? new Date(p.availableFrom).toISOString().split("T")[0] : "",
        tenantPreference: p.tenantPreference || "ANY",
      });
    } catch (error) {
      console.error("Failed to fetch property:", error);
      alert("Error loading property");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      await api.put(`/properties/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Property updated successfully!");
      router.push("/properties/manage");
    } catch (error) {
      console.error("Failed to update property:", error);
      alert("Failed to update property.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF3E0] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0052FF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3E0] pb-20 font-inter">
      <Navbar />

      <main className="mx-auto mt-10 max-w-3xl px-4 sm:px-6">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center text-sm font-semibold text-gray-500 hover:text-[#0F172A] transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
            Edit Listing
          </h1>
          <p className="mt-2 text-[15px] text-gray-500">
            Update your property details.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl shadow-gray-200/40 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Property Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Rent (₹)</label>
                <input
                  type="number"
                  name="rent"
                  value={formData.rent}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Deposit (₹)</label>
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] bg-white"
                >
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">BHK Type</label>
                <select
                  name="bhkType"
                  value={formData.bhkType}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] bg-white"
                >
                  {BHK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px]"
                />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-[#0052FF] px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
            
          </form>
        </div>
      </main>
    </div>
  );
}
