"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { api } from "../../lib/api";
import Link from "next/link";
import { MapPin, BedDouble, HomeIcon, Eye, Loader2, IndianRupee, Heart } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SavedPropertiesPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
      return;
    }

    if (isSignedIn) {
      fetchSavedProperties();
    }
  }, [isLoaded, isSignedIn]);

  const fetchSavedProperties = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await api.get('/users/saved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // The backend returns an array of SavedProperty objects, where each has a `property` field
      const properties = res.data.map((item: any) => item.property);
      setSavedProperties(properties);
    } catch (error) {
      console.error("Failed to fetch saved properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF3E0] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0052FF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3E0] font-inter">
      <Navbar />
      <main className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8 flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          <div>
            <h1 className="text-3xl font-black text-[#0F172A]">Saved Properties</h1>
            <p className="mt-2 text-gray-500">Your favorite listings, saved for later.</p>
          </div>
        </div>

        {savedProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700">No saved properties yet</h3>
            <p className="text-gray-500 mt-2">Click the heart icon on any property to save it here.</p>
            <Link href="/search" className="inline-block mt-6 px-6 py-2 bg-[#0052FF] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">
              Explore Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
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
                  <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  </button>
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
                      {property.propertyType?.replace("_", " ") || 'Home'}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-[#0052FF] font-black text-lg">
                      <IndianRupee className="h-4 w-4 mr-0.5" />
                      {property.rent?.toLocaleString('en-IN')}
                      <span className="text-gray-400 text-[12px] font-medium ml-1">/mo</span>
                    </div>
                    <Link 
                      href={`/properties/${property.id}`}
                      className="text-[13px] font-bold text-[#0F172A] hover:text-[#0052FF] transition-colors flex items-center"
                    >
                      View Details
                      <Eye className="ml-1.5 h-4 w-4" />
                    </Link>
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
