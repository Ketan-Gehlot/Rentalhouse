"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { api } from "../../lib/api";
import Navbar from "../../components/Navbar";
import {
  Home,
  MapPin,
  IndianRupee,
  Camera,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Image as ImageIcon,
  X,
} from "lucide-react";

const STEPS = [
  { id: 1, name: "Basic Info", icon: Home },
  { id: 2, name: "Location", icon: MapPin },
  { id: 3, name: "Pricing", icon: IndianRupee },
  { id: 4, name: "Photos", icon: Camera },
];

const PROPERTY_TYPES = ["FLAT", "INDEPENDENT_HOUSE", "VILLA", "PG", "ROOM"];
const BHK_TYPES = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"];
const FURNISHING_TYPES = ["FULLY_FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"];
const AMENITIES_LIST = [
  "Parking",
  "Lift",
  "Power Backup",
  "Security",
  "Gym",
  "Swimming Pool",
  "Club House",
  "Park",
];

export default function ListPropertyPage() {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "FLAT",
    bhkType: "2 BHK",
    address: "",
    city: "",
    pincode: "",
    rent: "",
    deposit: "",
    maintenance: "0",
    furnishing: "SEMI_FURNISHED",
    availableFrom: new Date().toISOString().split("T")[0],
    tenantPreference: "ANY",
  });
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 5)); // Limit to 5 images
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async (): Promise<string[]> => {
    const urls: string[] = [];
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration is missing in .env.local");
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        // Simulate progress for UI
        setUploadProgress(((i + 0.5) / files.length) * 100);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        
        if (data.secure_url) {
          urls.push(data.secure_url);
          setUploadProgress(((i + 1) / files.length) * 100);
        } else {
          throw new Error("Failed to upload image");
        }
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
      }
    }
    return urls;
  };

  const handleNextStep = () => {
    setErrorMsg("");
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        setErrorMsg("Please fill all the required fields: Property Title is required.");
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.city.trim() || !formData.address.trim() || !formData.pincode.trim()) {
        setErrorMsg("Please fill all the required fields: City, Address, and Pincode are required.");
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.rent || !formData.deposit) {
        setErrorMsg("Please fill all the required fields: Rent and Deposit are required.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(STEPS.length, prev + 1));
  };

  const handleSubmit = async () => {
    if (!isSignedIn) {
      alert("Please login first");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const token = await getToken();
      
      // 1. Upload Images to Cloudinary
      const mediaUrls = await uploadImagesToCloudinary();

      // 2. Submit Data
      const payload = {
        ...formData,
        amenities: selectedAmenities,
        media: mediaUrls,
      };

      await api.post("/properties", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      router.push("/properties/manage");
    } catch (error) {
      console.error("Error creating property:", error);
      alert("Failed to list property. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Ensure user is logged in
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
    return null;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                Property Title <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Spacious 2 BHK near Metro Station"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF] bg-white"
                >
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>{type.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">BHK Type</label>
                <select
                  name="bhkType"
                  value={formData.bhkType}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF] bg-white"
                >
                  {BHK_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your property, its surroundings, and key features..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                City <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g. Bangalore"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                Full Address <span className="text-red-500 ml-0.5">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                placeholder="e.g. Flat 101, Sunshine Apartments, HSR Layout Sector 2"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                Pincode <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="e.g. 560102"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Expected Rent (₹/mo) <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="rent"
                    value={formData.rent}
                    onChange={handleInputChange}
                    placeholder="25000"
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-[15px] focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Security Deposit (₹) <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="deposit"
                    value={formData.deposit}
                    onChange={handleInputChange}
                    placeholder="100000"
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-[15px] focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Maintenance (₹/mo)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="maintenance"
                    value={formData.maintenance}
                    onChange={handleInputChange}
                    placeholder="2000"
                    className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-[15px] focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Furnishing</label>
                <select
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] focus:border-[#0052FF] focus:outline-none focus:ring-1 focus:ring-[#0052FF] bg-white"
                >
                  {FURNISHING_TYPES.map(type => (
                    <option key={type} value={type}>{type.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-3">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_LIST.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      selectedAmenities.includes(amenity)
                        ? "bg-[#0052FF] text-white border border-[#0052FF] shadow-sm shadow-blue-500/20"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-[#f8f9fb] p-8 text-center transition-colors hover:border-[#0052FF] hover:bg-[#f0f4ff]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm mb-4">
                <ImageIcon className="h-6 w-6 text-[#0052FF]" />
              </div>
              <h3 className="text-[15px] font-semibold text-[#0F172A]">Upload Property Photos</h3>
              <p className="mt-1 text-[13px] text-gray-500 mb-4">
                Upload up to 5 high-quality images. The first image will be the cover.
              </p>
              
              <label className="cursor-pointer inline-flex items-center justify-center rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-[#0F172A] shadow-sm border border-gray-200 hover:bg-gray-50">
                <span>Browse Files</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[10px] font-bold text-center py-1">
                        COVER
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isSubmitting && (
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#0F172A]">Uploading...</span>
                  <span className="text-sm font-bold text-[#0052FF]">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-[#0052FF] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] pb-20 font-inter">
      <Navbar />

      <main className="mx-auto mt-10 max-w-3xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A]">
            List Your Property
          </h1>
          <p className="mt-2 text-[15px] text-gray-500">
            Get your property in front of thousands of verified tenants.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-10 flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -z-10 h-[2px] w-full -translate-y-1/2 bg-gray-200"></div>
          <div 
            className="absolute left-0 top-1/2 -z-10 h-[2px] -translate-y-1/2 bg-[#0052FF] transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          ></div>
          
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div 
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    isActive 
                      ? "border-[#0052FF] bg-white text-[#0052FF] shadow-md" 
                      : isCompleted
                        ? "border-[#0052FF] bg-[#0052FF] text-white"
                        : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                  isActive || isCompleted ? "text-[#0F172A]" : "text-gray-400"
                }`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl shadow-gray-200/40 border border-gray-100">
          
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start text-red-700">
              <span className="font-bold mr-2">Error:</span>
              <p className="text-sm">{errorMsg}</p>
            </div>
          )}

          {renderStepContent()}

          <div className="mt-10 flex items-center justify-between pt-6 border-t border-gray-100">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1 || isSubmitting}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0F172A] disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            
            {currentStep < STEPS.length ? (
              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 rounded-xl bg-[#0052FF] px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || files.length === 0}
                className="flex items-center gap-2 rounded-xl bg-[#0F172A] px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-black hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Publish Listing
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
