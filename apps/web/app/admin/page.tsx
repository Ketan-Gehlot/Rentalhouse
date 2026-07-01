"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import Navbar from "../../components/Navbar";
import {
  Users,
  ShieldCheck,
  Crown,
  Loader2,
  CheckCircle,
  Building,
  AlertCircle
} from "lucide-react";

export default function AdminDashboardPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'USERS' | 'SUPER_TRUSTED' | 'PROPERTIES'>('USERS');
  const [users, setUsers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
      return;
    }

    if (isSignedIn) {
      fetchAdminData();
    }
  }, [isLoaded, isSignedIn]);

  const fetchAdminData = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const [usersRes, propsRes] = await Promise.all([
        api.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/admin/properties", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setUsers(usersRes.data);
      setProperties(propsRes.data);
    } catch (err: any) {
      console.error("Failed to fetch admin data:", err);
      if (err.response?.status === 403) {
        setError("Access Denied: You do not have Admin privileges.");
      } else {
        setError("Failed to load admin dashboard.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const approveSuperTrusted = async (userId: string) => {
    try {
      const token = await getToken();
      await api.patch(`/admin/users/${userId}/super-trusted`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, isSuperTrusted: true, superTrustedStatus: 'APPROVED' } 
          : u
      ));
      alert("Super Trusted status granted!");
    } catch (error) {
      console.error("Failed to approve super trusted:", error);
      alert("Failed to grant status.");
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF3E0] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0052FF]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF3E0] font-inter">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-32 px-4 text-center">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center shadow-sm border border-red-100 max-w-md">
            <AlertCircle className="h-12 w-12 mb-4" />
            <h2 className="text-xl font-bold mb-2">Unauthorized Access</h2>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const superTrustedRequests = users.filter(u => u.superTrustedStatus === 'PENDING');

  return (
    <div className="min-h-screen bg-[#FAF3E0] pb-20 font-inter">
      <Navbar />

      <main className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A] flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-[#0052FF]" /> Admin Control Panel
          </h1>
          <p className="mt-2 text-[15px] text-gray-500">
            Monitor and manage all platform activity.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('USERS')}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'USERS' ? 'border-[#0052FF] text-[#0052FF] bg-blue-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <Users className="h-4 w-4" /> All Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('SUPER_TRUSTED')}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 relative ${activeTab === 'SUPER_TRUSTED' ? 'border-yellow-500 text-yellow-700 bg-yellow-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <Crown className="h-4 w-4" /> Super Trusted Queue 
              {superTrustedRequests.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full absolute top-2 right-4 sm:right-auto sm:ml-2 sm:relative sm:top-auto sm:right-auto">
                  {superTrustedRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('PROPERTIES')}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'PROPERTIES' ? 'border-[#0052FF] text-[#0052FF] bg-blue-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              <Building className="h-4 w-4" /> Properties ({properties.length})
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'USERS' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700 rounded-t-xl">
                    <tr>
                      <th className="px-6 py-3 rounded-tl-lg">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Verification</th>
                      <th className="px-6 py-3 rounded-tr-lg">Super Trusted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#0F172A]">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.verification?.status === 'APPROVED' ? (
                            <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5"/> Verified</span>
                          ) : (
                            <span className="text-gray-400">Pending/None</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {user.isSuperTrusted ? (
                            <span className="text-yellow-600 font-bold flex items-center gap-1"><Crown className="h-3.5 w-3.5"/> Approved</span>
                          ) : user.superTrustedStatus === 'PENDING' ? (
                            <span className="text-yellow-600 font-bold bg-yellow-100 px-2 py-1 rounded text-xs">Requested</span>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'SUPER_TRUSTED' && (
              <div>
                {superTrustedRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Crown className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-700">All caught up!</h3>
                    <p className="text-gray-500 text-sm mt-1">No pending Super Trusted requests right now.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {superTrustedRequests.map(user => (
                      <div key={user.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-5 relative overflow-hidden shadow-sm">
                        <Crown className="absolute -right-4 -top-4 h-24 w-24 text-yellow-500/10" />
                        <h3 className="font-bold text-[#0F172A] text-lg">{user.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                        <p className="text-xs text-yellow-800 font-medium mt-3 mb-5">
                          Requested after a meeting. Review and approve to grant the badge.
                        </p>
                        <button
                          onClick={() => approveSuperTrusted(user.id)}
                          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <Crown className="h-4 w-4" /> Grant Super Trusted
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'PROPERTIES' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700 rounded-t-xl">
                    <tr>
                      <th className="px-6 py-3 rounded-tl-lg">Title</th>
                      <th className="px-6 py-3">City</th>
                      <th className="px-6 py-3">Rent</th>
                      <th className="px-6 py-3">Owner</th>
                      <th className="px-6 py-3 rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((prop) => (
                      <tr key={prop.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#0F172A] max-w-[200px] truncate">{prop.title}</td>
                        <td className="px-6 py-4">{prop.city}</td>
                        <td className="px-6 py-4 font-bold">₹{prop.rent.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4">{prop.owner.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">
                            {prop.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
