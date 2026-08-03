import { useState } from "react";
import { createProperty } from "../../services/property.service";

const CreateProperty = () => {
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

        alert("Property created successfully!");

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
    className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8"
>
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-white">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                    Create New Property
                </h2>
            </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5">

            {/* Basic Information */}
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Property Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="title"
                        placeholder="Enter property title"
                        onChange={handleChange}
                        required
                        className="
                        w-full
                        px-4 py-2.5
                        bg-slate-50
                        border border-slate-200
                        rounded-lg
                        text-sm text-slate-800
                        placeholder:text-slate-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500/20
                        focus:border-blue-500
                        transition-all
                        duration-200
                        "
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        placeholder="Describe your property in detail..."
                        onChange={handleChange}
                        rows="4"
                        required
                        className="
                        w-full
                        px-4 py-2.5
                        bg-slate-50
                        border border-slate-200
                        rounded-lg
                        text-sm text-slate-800
                        placeholder:text-slate-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500/20
                        focus:border-blue-500
                        transition-all
                        duration-200
                        resize-none
                        "
                    />
                </div>
            </div>

            {/* Property Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
                        <input
                            name="price"
                            type="number"
                            placeholder="0"
                            onChange={handleChange}
                            required
                            className="
                            w-full
                            pl-7 pr-4 py-2.5
                            bg-slate-50
                            border border-slate-200
                            rounded-lg
                            text-sm text-slate-800
                            placeholder:text-slate-400
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500/20
                            focus:border-blue-500
                            transition-all
                            duration-200
                            "
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Area (sq ft) <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="area"
                        type="number"
                        placeholder="0"
                        onChange={handleChange}
                        required
                        className="
                        w-full
                        px-4 py-2.5
                        bg-slate-50
                        border border-slate-200
                        rounded-lg
                        text-sm text-slate-800
                        placeholder:text-slate-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500/20
                        focus:border-blue-500
                        transition-all
                        duration-200
                        "
                    />
                </div>
            </div>

            {/* Location (full width) */}
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Location <span className="text-red-500">*</span>
                </label>
                <input
                    name="location"
                    placeholder="Enter location"
                    onChange={handleChange}
                    required
                    className="
                    w-full
                    px-4 py-2.5
                    bg-slate-50
                    border border-slate-200
                    rounded-lg
                    text-sm text-slate-800
                    placeholder:text-slate-400
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500/20
                    focus:border-blue-500
                    transition-all
                    duration-200
                    "
                />
            </div>
            

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Bedrooms
                    </label>
                    <input
                        name="bedrooms"
                        type="number"
                        placeholder="0"
                        onChange={handleChange}
                        required
                        className="
                        w-full
                        px-4 py-2.5
                        bg-slate-50
                        border border-slate-200
                        rounded-lg
                        text-sm text-slate-800
                        placeholder:text-slate-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500/20
                        focus:border-blue-500
                        transition-all
                        duration-200
                        "
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Bathrooms
                    </label>
                    <input
                        name="bathrooms"
                        type="number"
                        placeholder="0"
                        onChange={handleChange}
                        required
                        className="
                        w-full
                        px-4 py-2.5
                        bg-slate-50
                        border border-slate-200
                        rounded-lg
                        text-sm text-slate-800
                        placeholder:text-slate-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500/20
                        focus:border-blue-500
                        transition-all
                        duration-200
                        "
                    />
                </div>
            </div>

            {/* Property Type */}
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Property Type <span className="text-red-500">*</span>
                </label>
                <select
                    name="property_type"
                    onChange={handleChange}
                    className="
                    w-full
                    px-4 py-2.5
                    bg-slate-50
                    border border-slate-200
                    rounded-lg
                    text-sm text-slate-800
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500/20
                    focus:border-blue-500
                    transition-all
                    duration-200
                    cursor-pointer
                    "
                >
                    <option value="APARTMENT">Apartment</option>
                    <option value="HOUSE">House</option>
                    <option value="FLAT">Flat</option>
                    <option value="STUDIO">Studio</option>
                    <option value="PENTHOUSE">Penthouse</option>
                    <option value="DUPLEX">Duplex</option>
                </select>
            </div>

            {/* Amenities & Nearby Facilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Amenities
                    </label>
                    <input
                        name="amenities"
                        placeholder="WiFi, AC, Generator"
                        onChange={handleChange}
                        className="
                        w-full
                        px-4 py-2.5
                        bg-slate-50
                        border border-slate-200
                        rounded-lg
                        text-sm text-slate-800
                        placeholder:text-slate-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500/20
                        focus:border-blue-500
                        transition-all
                        duration-200
                        "
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Nearby Facilities
                    </label>
                    <input
                        name="nearby_facilities"
                        placeholder="School, Hospital, Market"
                        onChange={handleChange}
                        className="
                        w-full
                        px-4 py-2.5
                        bg-slate-50
                        border border-slate-200
                        rounded-lg
                        text-sm text-slate-800
                        placeholder:text-slate-400
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500/20
                        focus:border-blue-500
                        transition-all
                        duration-200
                        "
                    />
                </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Property Images
                </label>
                <div className="flex items-center justify-center w-full">
                    <label className="
                    flex flex-col items-center justify-center
                    w-full
                    h-32
                    border-2 border-dashed border-slate-200
                    rounded-lg
                    cursor-pointer
                    bg-slate-50
                    hover:bg-slate-100
                    hover:border-blue-400
                    transition-all
                    duration-200
                    group
                    ">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-3 text-slate-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors duration-200">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                PNG, JPG, JPEG (Max 5MB each)
                            </p>
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

            {/* Submit Button */}
            <button
                type="submit"
                className="
                w-full
                px-6 py-3
                bg-gradient-to-r from-blue-600 to-indigo-600
                text-white
                text-sm
                font-medium
                rounded-lg
                hover:from-blue-700 hover:to-indigo-700
                hover:shadow-md
                transition-all
                duration-200
                flex items-center justify-center gap-2
                "
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Property
            </button>

        </div>
    </div>
</form>
  );
};

export default CreateProperty;