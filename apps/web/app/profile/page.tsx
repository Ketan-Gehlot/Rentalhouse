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
} from "lucide-react";
import { useAuth, useUser, SignOutButton } from "@clerk/nextjs";

export default function ProfilePage() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [verification, setVerification] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      fetchProfile();
    }
  }, [isLoaded]);

  const fetchProfile = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const res = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVerification(res.data.verification);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKycUpload = async () => {
    setIsUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const token = await getToken();
      await api.post(
        "/users/kyc",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchProfile();
    } catch (error) {
      console.error("KYC upload failed", error);
      alert("Failed to submit KYC documents");
    } finally {
      setIsUploading(false);
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

          {/* KYC Status Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-gray-700" />
              <h3 className="font-bold text-[#0F172A]">Verification Status</h3>
            </div>

            {/* Status Views */}
            {!verification ? (
              <div className="flex-1 flex flex-col justify-center">
                <div className="rounded-xl bg-orange-50 p-3 mb-4 border border-orange-100">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-orange-800 leading-relaxed">
                      Your profile is unverified. Upload your KYC documents to
                      get the &quot;100% Verified&quot; badge on your listings.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleKycUpload}
                  disabled={isUploading}
                  className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {isUploading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      Upload KYC (Mock)
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
        </div>
      </main>
    </div>
  );
}
