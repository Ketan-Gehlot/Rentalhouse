"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";
import {
  ShieldCheck,
  UploadCloud,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  User,
  Mail,
  Calendar,
  Crown,
  Camera,
  Phone,
  Settings,
  Heart,
} from "lucide-react";
import { useAuth, useUser, SignOutButton } from "@clerk/nextjs";

export default function ProfilePage() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [verification, setVerification] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isRequestingTrusted, setIsRequestingTrusted] = useState(false);
  const [faceFile, setFaceFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [savedProperties, setSavedProperties] = useState<any[]>([]);

  useEffect(() => {
    if (isLoaded) {
      fetchProfile();
    }
  }, [isLoaded]);

  const fetchProfile = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const [profileRes, savedRes] = await Promise.all([
        api.get("/users/profile", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/users/saved", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setDbUser(profileRes.data);
      setVerification(profileRes.data.verification);
      setSavedProperties(savedRes.data);
    } catch (error) {
      console.error("Failed to fetch profile data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKycUpload = async () => {
    if (!faceFile) {
      alert("Please select a face image to upload.");
      return;
    }
    
    setIsUploading(true);
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      
      const formData = new FormData();
      formData.append("file", faceFile);
      formData.append("upload_preset", uploadPreset!);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      
      const data = await uploadRes.json();
      if (!data.secure_url) throw new Error("Upload failed");

      const token = await getToken();
      await api.post(
        "/users/kyc",
        { faceUrl: data.secure_url, fullName: fullName.trim() },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setFaceFile(null);
      await fetchProfile();
    } catch (error) {
      console.error("KYC upload failed", error);
      alert("Failed to submit face verification");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRequestSuperTrusted = async () => {
    setIsRequestingTrusted(true);
    try {
      const token = await getToken();
      await api.post(
        "/users/super-trusted/request",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchProfile();
    } catch (error) {
      console.error("Request failed", error);
      alert("Failed to request Super Trusted status");
    } finally {
      setIsRequestingTrusted(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF3E0]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0052FF] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF3E0] pb-20">
      {/* Simple Navbar */}
      <nav className="sticky top-0 z-50 bg-[#FAF3E0] border-b border-gray-200/50">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <span className="text-[16px] font-extrabold tracking-tight text-[#0F172A]">
              RentMate
            </span>
          </Link>
          <SignOutButton redirectUrl="/">
            <button className="flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-red-600 transition-colors">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </SignOutButton>
        </div>
      </nav>

      <main className="mx-auto mt-10 max-w-3xl px-6">
        <h1 className="text-3xl font-bold text-[#0F172A]">My Profile</h1>
        <p className="mt-2 text-gray-500">
          Manage your account settings and verification.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* Profile Details Card */}
          <div className="md:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                  <User className="h-8 w-8 text-[#0052FF]" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {user?.fullName || "User"}
                </h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <span>
                    {user?.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    Email
                  </span>
                  <span className="text-[15px] font-medium text-[#0F172A]">
                    {user?.primaryEmailAddress?.emailAddress || "Not provided"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    Member Since
                  </span>
                  <span className="text-[15px] font-medium text-[#0F172A]">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* KYC Status Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-gray-700" />
                <h3 className="font-bold text-[#0F172A]">Face Verification</h3>
              </div>

            {/* Status Views */}
            {!verification ? (
              <div className="flex-1 flex flex-col justify-center">
                <div className="rounded-xl bg-orange-50 p-3 mb-4 border border-orange-100">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-orange-800 leading-relaxed">
                      Upload a clear photo of your face to get verified instantly.
                    </p>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Enter your real full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mb-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-[#0052FF] focus:ring-4 focus:ring-[#0052FF]/10"
                />

                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFaceFile(e.target.files ? e.target.files[0] : null)}
                  className="mb-3 text-xs w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                <button
                  onClick={handleKycUpload}
                  disabled={isUploading || !faceFile || !fullName.trim()}
                  className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {isUploading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Camera className="h-4 w-4" />
                      Verify My Face
                    </>
                  )}
                </button>
              </div>
            ) : verification.status === "PENDING" ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-3">
                  <Clock className="h-6 w-6 text-[#0052FF]" />
                </div>
                <h4 className="font-bold text-[#0F172A]">In Review</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
                  Your documents have been submitted and are currently being
                  reviewed by our team.
                </p>
              </div>
            ) : verification.status === "APPROVED" ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 mb-3">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                </div>
                <h4 className="font-bold text-[#0F172A]">100% Verified</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
                  Your identity has been successfully verified.
                </p>
              </div>
            ) : null}
            </div>

            {/* Super Trusted Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] p-6 shadow-sm border border-yellow-200 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Crown className="h-24 w-24 text-yellow-600" />
              </div>
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <Crown className="h-5 w-5 text-yellow-600" />
                <h3 className="font-bold text-yellow-900">Super Trusted</h3>
              </div>
              
              {dbUser?.superTrustedStatus === "NONE" ? (
                <div className="flex-1 flex flex-col relative z-10">
                  <p className="text-xs text-yellow-800 mb-4 leading-relaxed font-medium">
                    Stand out with the Super Trusted badge! Arrange a quick video meeting with our admin to get certified.
                  </p>
                  <button 
                    onClick={handleRequestSuperTrusted}
                    disabled={isRequestingTrusted}
                    className="mt-auto w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isRequestingTrusted ? "Requesting..." : "Arrange a Meeting"}
                  </button>
                </div>
              ) : dbUser?.superTrustedStatus === "PENDING" ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4 relative z-10">
                  <Clock className="h-8 w-8 text-yellow-600 mb-2" />
                  <h4 className="font-bold text-yellow-900 text-sm">Meeting Requested</h4>
                  <p className="text-xs text-yellow-800 mt-1">Our admin will contact you shortly to schedule the verification call.</p>
                </div>
              ) : dbUser?.superTrustedStatus === "APPROVED" ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4 relative z-10">
                  <Crown className="h-10 w-10 text-yellow-500 mb-2 filter drop-shadow-md" />
                  <h4 className="font-black text-yellow-900 text-lg uppercase tracking-wider">Super Trusted</h4>
                  <p className="text-xs text-yellow-800 font-bold mt-1">You hold the highest trust tier!</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Saved Properties Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">Saved Properties</h2>
          {savedProperties.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center border border-gray-100 shadow-sm flex flex-col items-center">
              <Heart className="h-10 w-10 text-gray-200 mb-3" />
              <p className="text-gray-500 font-medium">You haven't saved any properties yet.</p>
              <Link href="/properties" className="mt-4 rounded-xl bg-gray-100 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
                Explore Properties
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {savedProperties.map((saved) => (
                <Link href={`/properties/${saved.property.id}`} key={saved.id} className="flex gap-4 rounded-2xl bg-white p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="h-24 w-24 shrink-0 rounded-xl bg-gray-100 overflow-hidden relative">
                    {saved.property.media?.[0]?.url && (
                      <img src={saved.property.media[0].url} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    )}
                    <div className="absolute top-1.5 right-1.5 rounded-full bg-white/90 p-1 shadow-sm">
                      <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center py-1">
                    <h4 className="font-bold text-[#0F172A] text-sm line-clamp-1">{saved.property.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{saved.property.city}</p>
                    <p className="text-sm font-black text-[#0052FF] mt-2">₹{saved.property.rent.toLocaleString('en-IN')}<span className="text-[10px] text-gray-400 font-normal">/mo</span></p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
