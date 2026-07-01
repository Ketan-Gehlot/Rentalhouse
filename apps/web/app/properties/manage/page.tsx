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
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
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

interface VisitRequest {
  id: string;
  tenant: { name: string; email: string; phone: string };
  property: { title: string; city: string; media: { url: string }[] };
  date: string;
  time: string;
  status: string;
  createdAt: string;
}

export default function ManageListingsPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'LISTINGS' | 'VISITS'>('LISTINGS');
  const [properties, setProperties] = useState<Property[]>([]);
  const [visitRequests, setVisitRequests] = useState<VisitRequest[]>([]);
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
      const [propsRes, visitsRes] = await Promise.all([
        api.get("/properties/user/my-listings", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/visits/owner/all", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setProperties(propsRes.data);
      setVisitRequests(visitsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVisitStatus = async (id: string, status: string) => {
    try {
      const token = await getToken();
      await api.patch(`/visits/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setVisitRequests(prev => 
        prev.map(v => v.id === id ? { ...v, status } : v)
      );
    } catch (error) {
      console.error("Failed to update visit status:", error);
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

          <div className="flex gap-4 border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('LISTINGS')}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'LISTINGS' ? 'border-[#0052FF] text-[#0052FF]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              My Properties ({properties.length})
            </button>
            <button
              onClick={() => setActiveTab('VISITS')}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'VISITS' ? 'border-[#0052FF] text-[#0052FF]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Visit Requests ({visitRequests.length})
            </button>
          </div>

          {activeTab === 'LISTINGS' ? (
            properties.length === 0 ? (
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
            )
          ) : (
            visitRequests.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f5f7] mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">No visit requests</h3>
                <p className="mt-2 text-[15px] text-gray-500 max-w-sm mx-auto mb-6">
                  You don't have any incoming visit requests from tenants yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {visitRequests.map((visit) => (
                  <div key={visit.id} className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row gap-5">
                    <div className="h-24 w-24 shrink-0 rounded-xl bg-gray-100 overflow-hidden relative hidden sm:block">
                      {visit.property.media?.[0]?.url && (
                        <img src={visit.property.media[0].url} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-[#0F172A] text-sm">{visit.tenant.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Wants to visit {visit.property.title}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          visit.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          visit.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                          visit.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {visit.status}
                        </span>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-4 text-sm font-medium text-[#0F172A]">
                        <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(visit.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
                          <Clock className="h-4 w-4 mr-2" />
                          {visit.time}
                        </div>
                      </div>

                      {visit.status === 'PENDING' && (
                        <div className="mt-5 flex gap-3">
                          <button 
                            onClick={() => handleUpdateVisitStatus(visit.id, 'ACCEPTED')}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-bold transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" /> Accept
                          </button>
                          <button 
                            onClick={() => handleUpdateVisitStatus(visit.id, 'REJECTED')}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg text-sm font-bold transition-colors"
                          >
                            <XCircle className="h-4 w-4" /> Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
      </main>
    </div>
  );
}
