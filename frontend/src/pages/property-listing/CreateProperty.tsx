import { useState } from "react";
import { createProperty } from "../../services/property.service";
import { useNavigate } from "react-router-dom";


const CreateProperty = () => {
      const navigate = useNavigate();

  const [property, setProperty] = useState({
    title: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    location: "",
    latitude: "",
    longitude: "",
    property_type: "APARTMENT",
    furnished: false,
    family_bachelor: "ANY",
    parking: false,
    lift: false,
    pet_friendly: false,
    availability: true,
    amenities: "",
    nearby_facilities: "",
    // owner_id is set server-side from authenticated user
  });

  const [images, setImages] = useState<FileList | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setProperty({
      ...property,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    });
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
                // Client-side validation for required numeric fields
                const requiredNums = ["price", "bedrooms", "bathrooms", "area"];
                for (const f of requiredNums) {
                    const v = (property as any)[f];
                    if (v === "" || v === undefined || isNaN(Number(v))) {
                        alert(`Please provide a valid numeric value for ${f}`);
                        return;
                    }
                }

                const formData = new FormData();

            Object.entries(property).forEach(([key, value]) => {
                if (key === "owner_id") return; // never send owner_id from client
                formData.append(key, String(value));
            });

        if (images) {
        Array.from(images).forEach((image) => {
            formData.append("images", image);
        });
        }

        const data = await createProperty(formData);

        console.log(data);

        // alert("Property created successfully!");
        navigate("/properties");

    } catch (error: any) {
        console.log(error);

        if (error.response) {
        console.log(error.response.data);
        alert(error.response.data.message);
        } else {
        alert(error.message);
        }
    }
    };

  return (
<form
    onSubmit={handleSubmit}
    className="max-w-xl mx-auto px-3 sm:px-4 py-3 sm:py-4"
>
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 overflow-hidden">

        {/* Header - Ultra Compact */}
        <div className="px-4 py-2.5 border-b border-slate-700/50 bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700">
            <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-white tracking-tight">
                        Create Property
                    </h2>
                    <p className="text-[10px] text-cyan-100">Fill in the details</p>
                </div>
            </div>
        </div>

        {/* Body - Ultra Compact */}
        <div className="p-3 sm:p-4 space-y-2.5">

            {/* Basic Information - Ultra Compact */}
            <div className="space-y-2">
                <div className="space-y-0.5">
                    <label className="flex items-center gap-1 text-[9px] font-semibold text-cyan-400 uppercase tracking-wider">
                        Title <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <input
                            name="title"
                            placeholder="Enter title"
                            onChange={handleChange}
                            required
                            className="
                            w-full
                            pl-7 pr-2.5 py-1.5
                            bg-slate-900/50
                            border border-slate-700
                            rounded-lg
                            text-xs text-white
                            placeholder:text-slate-500
                            focus:outline-none
                            focus:ring-2
                            focus:ring-cyan-500/30
                            focus:border-cyan-500
                            transition-all
                            duration-200
                            hover:border-slate-600
                            "
                        />
                    </div>
                </div>

                <div className="space-y-0.5">
                    <label className="flex items-center gap-1 text-[9px] font-semibold text-cyan-400 uppercase tracking-wider">
                        Description <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute top-2 left-2.5 pointer-events-none">
                            <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                        </div>
                        <textarea
                            name="description"
                            placeholder="Describe property..."
                            onChange={handleChange}
                            rows={2}
                            required
                            className="
                            w-full
                            pl-7 pr-2.5 py-1.5
                            bg-slate-900/50
                            border border-slate-700
                            rounded-lg
                            text-xs text-white
                            placeholder:text-slate-500
                            focus:outline-none
                            focus:ring-2
                            focus:ring-cyan-500/30
                            focus:border-cyan-500
                            transition-all
                            duration-200
                            resize-none
                            hover:border-slate-600
                            "
                        />
                    </div>
                </div>
            </div>

            {/* Property Details Grid - Ultra Compact */}
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                    <label className="flex items-center gap-1 text-[9px] font-semibold text-cyan-400 uppercase tracking-wider">
                        Price <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cyan-400 font-semibold text-xs">$</span>
                        <input
                            name="price"
                            type="number"
                            placeholder="0"
                            onChange={handleChange}
                            required
                            className="
                            w-full
                            pl-6 pr-2.5 py-1.5
                            bg-slate-900/50
                            border border-slate-700
                            rounded-lg
                            text-xs text-white
                            placeholder:text-slate-500
                            focus:outline-none
                            focus:ring-2
                            focus:ring-cyan-500/30
                            focus:border-cyan-500
                            transition-all
                            duration-200
                            hover:border-slate-600
                            "
                        />
                    </div>
                </div>

                <div className="space-y-0.5">
                    <label className="flex items-center gap-1 text-[9px] font-semibold text-cyan-400 uppercase tracking-wider">
                        Area <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                            </svg>
                        </div>
                        <input
                            name="area"
                            type="number"
                            placeholder="sq ft"
                            onChange={handleChange}
                            required
                            className="
                            w-full
                            pl-7 pr-2.5 py-1.5
                            bg-slate-900/50
                            border border-slate-700
                            rounded-lg
                            text-xs text-white
                            placeholder:text-slate-500
                            focus:outline-none
                            focus:ring-2
                            focus:ring-cyan-500/30
                            focus:border-cyan-500
                            transition-all
                            duration-200
                            hover:border-slate-600
                            "
                        />
                    </div>
                </div>
            </div>

            {/* Location - Ultra Compact */}
            <div className="space-y-0.5">
                <label className="flex items-center gap-1 text-[9px] font-semibold text-cyan-400 uppercase tracking-wider">
                    Location <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <input
                        name="location"
                        placeholder="Enter location"
                        onChange={handleChange}
                        required
                        className="
                        w-full
                        pl-7 pr-2.5 py-1.5
                        bg-slate-900/50
                        border border-slate-700
                        rounded-lg
                        text-xs text-white
                        placeholder:text-slate-500
                        focus:outline-none
                        focus:ring-2
                        focus:ring-cyan-500/30
                        focus:border-cyan-500
                        transition-all
                        duration-200
                        hover:border-slate-600
                        "
                    />
                </div>
            </div>

            {/* Bedrooms & Bathrooms - Ultra Compact */}
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                    <label className="flex items-center gap-1 text-[9px] font-semibold text-cyan-400 uppercase tracking-wider">
                        Beds
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <input
                            name="bedrooms"
                            type="number"
                            placeholder="0"
                            onChange={handleChange}
                            required
                            className="
                            w-full
                            pl-7 pr-2.5 py-1.5
                            bg-slate-900/50
                            border border-slate-700
                            rounded-lg
                            text-xs text-white
                            placeholder:text-slate-500
                            focus:outline-none
                            focus:ring-2
                            focus:ring-cyan-500/30
                            focus:border-cyan-500
                            transition-all
                            duration-200
                            hover:border-slate-600
                            "
                        />
                    </div>
                </div>

                <div className="space-y-0.5">
                    <label className="flex items-center gap-1 text-[9px] font-semibold text-cyan-400 uppercase tracking-wider">
                        Baths
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <input
                            name="bathrooms"
                            type="number"
                            placeholder="0"
                            onChange={handleChange}
                            required
                            className="
                            w-full
                            pl-7 pr-2.5 py-1.5
                            bg-slate-900/50
                            border border-slate-700
                            rounded-lg
                            text-xs text-white
                            placeholder:text-slate-500
                            focus:outline-none
                            focus:ring-2
                            focus:ring-cyan-500/30
                            focus:border-cyan-500
                            transition-all
                            duration-200
                            hover:border-slate-600
                            "
                        />
                    </div>
                </div>
            </div>

            {/* Property Type - Ultra Compact */}
            <div className="space-y-0.5">
                <label className="flex items-center gap-1 text-[9px] font-semibold text-cyan-400 uppercase tracking-wider">
                    Type <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <select
                        name="property_type"
                        onChange={handleChange}
                        className="
                        w-full
                        pl-7 pr-2.5 py-1.5
                        bg-slate-900/50
                        border border-slate-700
                        rounded-lg
                        text-xs text-white
                        appearance-none
                        focus:outline-none
                        focus:ring-2
                        focus:ring-cyan-500/30
                        focus:border-cyan-500
                        transition-all
                        duration-200
                        cursor-pointer
                        hover:border-slate-600
                        "
                    >
                        <option value="APARTMENT" className="bg-slate-900">Apartment</option>
                        <option value="HOUSE" className="bg-slate-900">House</option>
                        <option value="FLAT" className="bg-slate-900">Flat</option>
                        <option value="STUDIO" className="bg-slate-900">Studio</option>
                        <option value="PENTHOUSE" className="bg-slate-900">Penthouse</option>
                        <option value="DUPLEX" className="bg-slate-900">Duplex</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                        <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Amenities & Nearby Facilities - Ultra Compact */}
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-0.5">
                    <label className="flex items-center gap-1 text-[9px] font-semibold text-cyan-400 uppercase tracking-wider">
                        Amenities
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <input
                            name="amenities"
                            placeholder="WiFi, AC"
                            onChange={handleChange}
                            className="
                            w-full
                            pl-7 pr-2.5 py-1.5
                            bg-slate-900/50
                            border border-slate-700
                            rounded-lg
                            text-xs text-white
                            placeholder:text-slate-500
                            focus:outline-none
                            focus:ring-2
                            focus:ring-cyan-500/30
                            focus:border-cyan-500
                            transition-all
                            duration-200
                            hover:border-slate-600
                            "
                        />
                    </div>
                </div>

                <div className="space-y-0.5">
                    <label className="flex items-center gap-1 text-[9px] font-semibold text-cyan-400 uppercase tracking-wider">
                        Nearby
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <input
                            name="nearby_facilities"
                            placeholder="School, Hospital"
                            onChange={handleChange}
                            className="
                            w-full
                            pl-7 pr-2.5 py-1.5
                            bg-slate-900/50
                            border border-slate-700
                            rounded-lg
                            text-xs text-white
                            placeholder:text-slate-500
                            focus:outline-none
                            focus:ring-2
                            focus:ring-cyan-500/30
                            focus:border-cyan-500
                            transition-all
                            duration-200
                            hover:border-slate-600
                            "
                        />
                    </div>
                </div>
            </div>

            {/* Image Upload - Ultra Compact */}
            <div className="space-y-0.5">
                <label className="flex items-center gap-1 text-[9px] font-semibold text-cyan-400 uppercase tracking-wider">
                    Images
                </label>
                <div className="flex items-center justify-center w-full">
                    <label className="
                    flex flex-col items-center justify-center
                    w-full
                    h-20
                    border-2 border-dashed border-slate-700
                    rounded-lg
                    cursor-pointer
                    bg-slate-900/30
                    hover:bg-slate-900/50
                    hover:border-cyan-500/50
                    transition-all
                    duration-200
                    group
                    ">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors duration-200 flex items-center justify-center mb-1">
                                <svg className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-[10px] font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-200">
                                <span className="text-cyan-400 font-semibold">Upload</span>
                            </p>
                            <p className="text-[8px] text-slate-500">PNG, JPG (Max 5MB)</p>
                        </div>
                        <input
                            type="file"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* Submit Button - Ultra Compact */}
            <button
                type="submit"
                className="
                w-full
                px-4 py-2
                bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700
                text-white
                text-xs
                font-semibold
                rounded-lg
                hover:from-cyan-600 hover:via-cyan-700 hover:to-cyan-800
                hover:shadow-lg hover:shadow-cyan-500/25
                transition-all
                duration-200
                flex items-center justify-center gap-1.5
                group
                "
            >
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Property</span>
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </button>

        </div>
    </div>
</form>
  );
};

export default CreateProperty;