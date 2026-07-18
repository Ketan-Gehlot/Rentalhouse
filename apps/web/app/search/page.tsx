"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { api } from "../../lib/api";
import Link from "next/link";
import { MapPin, BedDouble, HomeIcon, Eye, Loader2, IndianRupee, Heart } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

export default function SearchPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken, userId } = useAuth();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties');
      setProperties(res.data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProperty = async (propertyId: string) => {
    try {
      const token = await getToken();
      if (!token || !userId) return toast.error("Please sign in to save properties");
      
      // Optimistic update
      setProperties(prev => prev.map(p => {
        if (p.id === propertyId) {
          const isCurrentlySaved = p.savedBy?.some((s: any) => s.userId === userId);
          return {
            ...p,
            savedBy: isCurrentlySaved 
              ? p.savedBy.filter((s: any) => s.userId !== userId) 
              : [...(p.savedBy || []), { userId }]
          };
        }
        return p;
      }));

      const res = await api.post(`/properties/${propertyId}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message);
    } catch (error) {
      console.error("Failed to save property:", error);
      toast.error("Failed to save property");
      // Revert on failure by re-fetching
      fetchProperties();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] font-inter">
      <Navbar />
      <main className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#0F172A]">Find a House</h1>
          <p className="mt-2 text-gray-500">Explore premium properties directly from verified owners.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#0052FF]" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700">No properties found</h3>
            <p className="text-gray-500 mt-2">Check back later for new listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div 
                key={property.id} 
                className="group flex flex-col rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  {property.media && property.media.length > 0 ? (
                    <img 
                      src={property.media[0].url} 
                      alt={property.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 left-4 rounded-full bg-blue-500/90 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">
                    Verified
                  </div>
                </div>

                <div className="flex flex-col flex-grow p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[16px] font-bold text-[#0F172A] line-clamp-1 group-hover:text-[#0052FF] transition-colors">
                      {property.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-[13px] mb-4">
                    <MapPin className="mr-1 h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{property.city}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="rounded-lg bg-[#f4f5f7] px-2.5 py-1 text-[12px] font-semibold text-gray-600 flex items-center">
                      <BedDouble className="mr-1.5 h-3.5 w-3.5" />
                      {property.bhkType}
                    </div>
                    <div className="rounded-lg bg-[#f4f5f7] px-2.5 py-1 text-[12px] font-semibold text-gray-600 flex items-center">
                      <HomeIcon className="mr-1.5 h-3.5 w-3.5" />
                      {property.propertyType.replace("_", " ")}
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-bold text-[#0F172A]">Listed by:</span>
                      <span className="line-clamp-1 max-w-[100px]">{property.owner.name}</span>
                      {property.owner.isSuperTrusted && (
                        <span className="ml-1 text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                          Super Trusted
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-black text-[#0052FF]">
                        ₹{property.rent.toLocaleString('en-IN')}<span className="text-sm font-medium text-gray-500">/mo</span>
                      </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleSaveProperty(property.id)}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                          property.savedBy?.some((s: any) => s.userId === userId)
                            ? "bg-red-50 text-red-500"
                            : "bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        }`}
                        title="Save Property"
                      >
                        <Heart className={`h-4 w-4 ${property.savedBy?.some((s: any) => s.userId === userId) ? "fill-red-500" : ""}`} />
                      </button>
                      <Link 
                        href={`/properties/${property.id}`}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-[#0052FF] hover:bg-[#0052FF] hover:text-white transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
