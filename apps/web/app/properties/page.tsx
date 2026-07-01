"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";
import Navbar from "../../components/Navbar";
import {
  MapPin,
  IndianRupee,
  Search,
  Filter,
  Home,
  SlidersHorizontal,
  Heart,
  Crown
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [city, setCity] = useState(searchParams?.get("city") || "");
  const [propertyType, setPropertyType] = useState(searchParams?.get("propertyType") || "");
  const [minRent, setMinRent] = useState(searchParams?.get("minRent") || "");
  const [maxRent, setMaxRent] = useState(searchParams?.get("maxRent") || "");
  
  // Favorites state
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProperties();
    if (isSignedIn) {
      fetchSavedProperties();
    }
  }, [searchParams, isSignedIn]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (searchParams?.get("city")) query.append("city", searchParams.get("city")!);
      if (searchParams?.get("propertyType")) query.append("propertyType", searchParams.get("propertyType")!);
      if (searchParams?.get("minRent")) query.append("minRent", searchParams.get("minRent")!);
      if (searchParams?.get("maxRent")) query.append("maxRent", searchParams.get("maxRent")!);

      const res = await api.get(`/properties?${query.toString()}`);
      setProperties(res.data);
    } catch (error) {
      console.error("Failed to fetch properties", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedProperties = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      
      const res = await api.get("/users/saved", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const ids = new Set<string>();
      res.data.forEach((saved: any) => ids.add(saved.propertyId));
      setSavedIds(ids);
    } catch (error) {
      console.error("Failed to fetch saved properties", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (city) query.append("city", city);
    if (propertyType) query.append("propertyType", propertyType);
    if (minRent) query.append("minRent", minRent);
    if (maxRent) query.append("maxRent", maxRent);
    
    router.push(`/properties?${query.toString()}`);
  };

  const toggleSave = async (e: React.MouseEvent, propertyId: string) => {
    e.preventDefault(); // Prevent navigating to property details
    e.stopPropagation();
    
    if (!isSignedIn) {
      alert("Please sign in to save properties!");
      return;
    }

    try {
      const token = await getToken();
      const res = await api.post(`/properties/${propertyId}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSavedIds(prev => {
        const newSet = new Set(prev);
        if (res.data.isSaved) {
          newSet.add(propertyId);
        } else {
          newSet.delete(propertyId);
        }
        return newSet;
      });
    } catch (error) {
      console.error("Failed to toggle save", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] font-sans pb-20">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
              <SlidersHorizontal className="h-5 w-5 text-[#0052FF]" />
              <h2 className="text-lg font-bold text-[#0F172A]">Filters</h2>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="E.g. Bangalore"
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] outline-none bg-white"
                >
                  <option value="">Any Type</option>
                  <option value="FLAT">Flat / Apartment</option>
                  <option value="INDEPENDENT_HOUSE">Independent House</option>
                  <option value="PG">PG / Co-living</option>
                  <option value="VILLA">Villa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Budget (₹/mo)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={minRent}
                    onChange={(e) => setMinRent(e.target.value)}
                    placeholder="Min"
                    className="w-1/2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] outline-none"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={maxRent}
                    onChange={(e) => setMaxRent(e.target.value)}
                    placeholder="Max"
                    className="w-1/2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0052FF] hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" />
                Apply Filters
              </button>
            </form>
          </div>
        </aside>

        {/* Property Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Explore Properties
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                {isLoading ? "Searching..." : `Found ${properties.length} active listings`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0052FF] border-t-transparent"></div>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xl shadow-gray-200/40">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 mb-4">
                <Search className="h-10 w-10 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">No properties found</h3>
              <p className="text-gray-500 max-w-sm mb-6">
                We couldn't find any properties matching your current filters. Try broadening your search criteria.
              </p>
              <button 
                onClick={() => {
                  setCity("");
                  setPropertyType("");
                  setMinRent("");
                  setMaxRent("");
                  router.push('/properties');
                }}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link href={`/properties/${property.id}`} key={property.id} className="group flex flex-col rounded-3xl bg-white overflow-hidden border border-gray-100 shadow-lg shadow-gray-200/40 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1">
                  
                  {/* Image Section */}
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    {property.media?.[0]?.url ? (
                      <img 
                        src={property.media[0].url} 
                        alt={property.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Home className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0052FF] shadow-sm">
                      {property.propertyType}
                    </div>

                    <button 
                      onClick={(e) => toggleSave(e, property.id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
                    >
                      <Heart 
                        className={`h-5 w-5 transition-colors ${savedIds.has(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} 
                      />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-bold text-[#0F172A] text-[16px] line-clamp-1 leading-snug">
                        {property.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <MapPin className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{property.city}</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Monthly Rent</span>
                        <div className="flex items-center text-lg font-black text-[#0F172A]">
                          <IndianRupee className="h-4 w-4" />
                          {property.rent.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {property.owner?.isSuperTrusted && (
                          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100" title="Listed by Super Trusted Owner">
                            <Crown className="h-3 w-3 text-yellow-600 fill-yellow-500" />
                          </div>
                        )}
                        <span className="bg-[#0052FF]/10 text-[#0052FF] px-3 py-1.5 rounded-lg text-xs font-bold">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF3E0] flex justify-center items-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0052FF] border-t-transparent"></div></div>}>
      <ExploreContent />
    </Suspense>
  );
}
