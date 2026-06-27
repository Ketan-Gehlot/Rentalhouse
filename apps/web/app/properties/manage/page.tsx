"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import Navbar from "../../../components/Navbar";
import {
  MapPin,
  IndianRupee,
  BedDouble,
  Home as HomeIcon,
  Plus,
  Loader2,
  Trash2,
  Edit,
  Eye
} from "lucide-react";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  rent: number;
  bhkType: string;
  propertyType: string;
  media: { url: string; type: string }[];
  status: string;
}

export default function ManageListingsPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (isSignedIn) {
      fetchListings();
    }
  }, [isLoaded, isSignedIn]);

  const fetchListings = async () => {
    try {
      const token = await getToken();
      const res = await api.get("/properties/user/my-listings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(res.data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    
    try {
      const token = await getToken();
      // await api.delete(`/properties/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      alert("Delete functionality pending backend integration.");
      // setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete property:", error);
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
    <div className="min-h-screen bg-[#FAF3E0] pb-20 font-inter">
      <Navbar />

      <main className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
              Manage Listings
            </h1>
            <p className="mt-2 text-[15px] text-gray-500">
              View and manage all your listed properties on RentMate.
            </p>
          </div>
          
          <Link
            href="/list-property"
            className="flex items-center gap-2 rounded-xl bg-[#0F172A] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-black hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Add New Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f5f7] mb-4">
              <HomeIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]">No properties listed yet</h3>
            <p className="mt-2 text-[15px] text-gray-500 max-w-sm mx-auto mb-6">
              You haven't listed any properties for rent. Start earning by listing your space today!
            </p>
            <Link
              href="/list-property"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0052FF] px-8 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
            >
              List Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div 
                key={property.id} 
                className="group flex flex-col rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
              >
                {/* Image Section */}
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
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 rounded-full bg-green-500/90 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">
                    Active
                  </div>
                  
                  {/* Action Overlay */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link 
                      href={`/properties/${property.id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-600 shadow-sm hover:text-blue-600 hover:bg-white transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button 
                      onClick={() => deleteProperty(property.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-600 shadow-sm hover:text-red-600 hover:bg-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
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

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-[#0052FF] font-black text-lg">
                      <IndianRupee className="h-4 w-4 mr-0.5" />
                      {property.rent.toLocaleString('en-IN')}
                      <span className="text-gray-400 text-[12px] font-medium ml-1">/mo</span>
                    </div>
                    <Link 
                      href={`/properties/${property.id}`}
                      className="text-[13px] font-bold text-gray-500 hover:text-[#0F172A] transition-colors flex items-center"
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
