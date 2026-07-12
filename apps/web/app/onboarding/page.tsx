"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { api } from "../../lib/api";
import { Home as HomeIcon, Building2, Check, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"TENANT" | "OWNER" | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  // Check if user already has a role — if so, skip onboarding
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const checkExistingRole = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setIsCheckingRole(false);
          return;
        }
        const res = await api.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userRole = res.data?.role;
        // If user already has a role (TENANT, OWNER, ADMIN), skip onboarding
        if (userRole && userRole !== "USER") {
          router.push("/");
          return;
        }
      } catch {
        // User doesn't exist yet in DB — that's fine, show onboarding
      }
      setIsCheckingRole(false);
    };

    checkExistingRole();
  }, [isLoaded, isSignedIn]);

  const handleRoleSelection = async (role: "TENANT" | "OWNER") => {
    if (isSubmitting) return;
    setSelectedRole(role);
    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token found");

      await api.patch(
        "/users/role",
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Successfully updated role, redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Failed to update role", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
      setSelectedRole(null);
    }
  };

  if (!isLoaded || isCheckingRole) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F172A]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3B82F6] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#0F172A] md:flex-row" style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}>
      
      {/* Center Label (Desktop) */}
      <div className="pointer-events-none absolute left-1/2 top-10 z-20 hidden -translate-x-1/2 md:block">
        <div className="rounded-full border border-white/20 bg-white/10 px-8 py-3 text-center shadow-2xl backdrop-blur-xl">
          <h1 className="text-[13px] font-bold uppercase tracking-[0.2em] text-white">
            Select Your Journey
          </h1>
        </div>
      </div>

      {/* Tenant Side */}
      <div 
        onClick={() => handleRoleSelection("TENANT")}
        className={`group relative flex flex-1 cursor-pointer flex-col overflow-hidden transition-all duration-700 ease-in-out md:hover:flex-[1.2] ${isSubmitting && selectedRole !== "TENANT" ? "opacity-30 grayscale" : ""} ${selectedRole === "TENANT" ? "md:flex-[1.5]" : ""}`}
      >
        {/* Background Image */}
        <img 
          src="/tenant.png" 
          alt="Modern Apartment Interior" 
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 group-hover:opacity-80" />
        
        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-end p-8 pb-16 md:p-16 md:pb-24">
          <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-2 ${selectedRole === "TENANT" ? "bg-[#3B82F6] border-[#3B82F6]" : ""}`}>
            {selectedRole === "TENANT" ? <Check className="h-8 w-8 text-white" /> : <HomeIcon className="h-8 w-8 text-white" />}
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            I am looking <br/> for a house
          </h2>
          <p className="mt-4 max-w-md text-lg text-gray-300 transition-all duration-500 group-hover:text-white md:text-xl">
            Browse premium verified listings, schedule visits, and find your perfect home without any brokerage.
          </p>
          
          {/* Action Hint */}
          <div className="mt-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#3B82F6] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span>Continue as Tenant</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Center Divider (Mobile) */}
      <div className="relative z-20 flex h-2 w-full items-center justify-center bg-black md:hidden">
        <div className="absolute rounded-full border border-white/20 bg-[#0F172A] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl">
          OR
        </div>
      </div>

      {/* Owner Side */}
      <div 
        onClick={() => handleRoleSelection("OWNER")}
        className={`group relative flex flex-1 cursor-pointer flex-col overflow-hidden transition-all duration-700 ease-in-out md:hover:flex-[1.2] ${isSubmitting && selectedRole !== "OWNER" ? "opacity-30 grayscale" : ""} ${selectedRole === "OWNER" ? "md:flex-[1.5]" : ""}`}
      >
        {/* Background Image */}
        <img 
          src="/owner.png" 
          alt="Modern House Exterior" 
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/50 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
        
        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-end p-8 pb-16 md:p-16 md:pb-24">
          <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-2 ${selectedRole === "OWNER" ? "bg-emerald-500 border-emerald-500" : ""}`}>
            {selectedRole === "OWNER" ? <Check className="h-8 w-8 text-white" /> : <Building2 className="h-8 w-8 text-white" />}
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            I want to list <br/> a property
          </h2>
          <p className="mt-4 max-w-md text-lg text-gray-300 transition-all duration-500 group-hover:text-white md:text-xl">
            List your properties, find reliable verified tenants, and manage your rentals completely digitally.
          </p>
          
          {/* Action Hint */}
          <div className="mt-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span>Continue as Owner</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Global Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-[#0F172A]/90 p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3B82F6] border-t-transparent"></div>
            <p className="text-sm font-medium tracking-wide text-white">
              Personalizing your experience...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
