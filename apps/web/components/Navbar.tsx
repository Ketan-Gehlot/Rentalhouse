"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF3E0]">
      <div className="mx-auto flex h-16 sm:h-20 w-full items-center px-4 sm:px-6 md:px-10">
        {/* Left: Logo */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center">
            <span className="text-[16px] font-extrabold tracking-tight text-[#0F172A]">
              RentMate
            </span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex flex-1 justify-center px-4">
          <div className="hidden w-full max-w-lg items-center gap-2 rounded-full bg-[#f4f5f7] px-4 py-2.5 lg:flex transition-all hover:bg-gray-100 focus-within:bg-white focus-within:shadow-sm focus-within:ring-1 focus-within:ring-gray-200">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search City, Locality or Landmark"
              className="w-full bg-transparent text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Right: Nav Links + Buttons */}
        <div className="flex shrink-0 items-center justify-end gap-4 sm:gap-6 xl:gap-8">
          <div className="hidden items-center gap-6 xl:gap-8 md:flex">
            <Link
              href="/"
              className="relative text-[14px] font-bold text-[#0052FF]"
            >
              Home
              <span className="absolute -bottom-8 left-0 h-[3px] w-full rounded-t-full bg-[#0052FF]"></span>
            </Link>
            <Link
              href="/list-property"
              className="text-[14px] font-medium text-gray-500 transition-colors hover:text-[#0F172A]"
            >
              List Property
            </Link>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 xl:gap-5">
            {isLoaded && isSignedIn ? (
              <>
                <Link
                  href="/profile"
                  className="text-[13px] sm:text-[14px] font-medium text-gray-600 transition-colors hover:text-[#0F172A] mr-2"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : isLoaded ? (
              <>
                <Link
                  href="/sign-in"
                  className="text-[13px] sm:text-[14px] font-medium text-gray-600 transition-colors hover:text-[#0F172A]"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-full bg-[#0052FF] px-4 sm:px-6 py-2 sm:py-2.5 text-[13px] sm:text-[14px] font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
                >
                  Rent Out
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
