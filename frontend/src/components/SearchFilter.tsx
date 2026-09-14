import { useState } from "react";

interface Props {
  onSearch: (filters: any) => void;
}

const PROPERTY_TYPES = [
  { label: "All Types", value: "" },
  { label: "Apartment", value: "APARTMENT" },
  { label: "House", value: "HOUSE" },
  { label: "Flat", value: "FLAT" },
  { label: "Studio", value: "STUDIO" },
  { label: "Penthouse", value: "PENTHOUSE" },
  { label: "Duplex", value: "DUPLEX" },
];

const SearchFilter = ({ onSearch }: Props) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    property_type: "",
    family_bachelor: "",
    parking: "",
    lift: "",
    pet_friendly: "",
    sort: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeSelect = (typeValue: string) => {
    const updated = { ...filters, property_type: typeValue };
    setFilters(updated);
    triggerSearch(updated);
  };

  const triggerSearch = (currentFilters = filters) => {
    const searchFilters: any = {};
    Object.keys(currentFilters).forEach((key) => {
      const val = currentFilters[key as keyof typeof currentFilters];
      if (val !== "") {
        searchFilters[key] = val;
      }
    });
    onSearch(searchFilters);
  };

  const handleReset = () => {
    const resetState = {
      location: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      property_type: "",
      family_bachelor: "",
      parking: "",
      lift: "",
      pet_friendly: "",
      sort: "",
    };
    setFilters(resetState);
    onSearch({});
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value !== "" && key !== "sort"
  ).length;

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/30 mb-8 transition-all duration-300">
      
      {/* Top Header & Property Type Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              Filter Properties
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {activeFiltersCount} active
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">Find your ideal home by location, price, and specs</p>
          </div>
        </div>

        {/* Quick Property Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {PROPERTY_TYPES.map((type) => {
            const isSelected = filters.property_type === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleTypeSelect(type.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                    : "bg-[#0b1328] text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Filter Inputs (Balanced 4-Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-5">
        
        {/* Location */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            name="location"
            placeholder="Neighborhood, City..."
            value={filters.location}
            onChange={handleChange}
            className="w-full pl-10 pr-3.5 py-2.5 bg-[#0b1328] border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 hover:border-slate-700 transition-all duration-200"
          />
        </div>

        {/* Min Price */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-xs font-bold">
            ৳
          </div>
          <input
            name="minPrice"
            placeholder="Min Price (BDT)"
            type="number"
            value={filters.minPrice}
            onChange={handleChange}
            className="w-full pl-8 pr-3.5 py-2.5 bg-[#0b1328] border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 hover:border-slate-700 transition-all duration-200"
          />
        </div>

        {/* Max Price */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-xs font-bold">
            ৳
          </div>
          <input
            name="maxPrice"
            placeholder="Max Price (BDT)"
            type="number"
            value={filters.maxPrice}
            onChange={handleChange}
            className="w-full pl-8 pr-3.5 py-2.5 bg-[#0b1328] border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 hover:border-slate-700 transition-all duration-200"
          />
        </div>

        {/* Bedrooms */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            className="w-full pl-10 pr-8 py-2.5 bg-[#0b1328] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 hover:border-slate-700 transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="" className="bg-slate-900">Bedrooms (Any)</option>
            <option value="1" className="bg-slate-900">1 Bedroom</option>
            <option value="2" className="bg-slate-900">2 Bedrooms</option>
            <option value="3" className="bg-slate-900">3 Bedrooms</option>
            <option value="4" className="bg-slate-900">4+ Bedrooms</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

      </div>

      {/* Secondary Controls (Bathrooms, Sort, Advanced Toggle & Buttons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-3.5">
        
        {/* Bathrooms */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <select
            name="bathrooms"
            value={filters.bathrooms}
            onChange={handleChange}
            className="w-full pl-10 pr-8 py-2.5 bg-[#0b1328] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 hover:border-slate-700 transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="" className="bg-slate-900">Bathrooms (Any)</option>
            <option value="1" className="bg-slate-900">1 Bathroom</option>
            <option value="2" className="bg-slate-900">2 Bathrooms</option>
            <option value="3" className="bg-slate-900">3 Bathrooms</option>
            <option value="4" className="bg-slate-900">4+ Bathrooms</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Sort */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </div>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="w-full pl-10 pr-8 py-2.5 bg-[#0b1328] border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 hover:border-slate-700 transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="" className="bg-slate-900">Sort By (Default)</option>
            <option value="latest" className="bg-slate-900">✨ Newest First</option>
            <option value="oldest" className="bg-slate-900">⏳ Oldest First</option>
            <option value="price_asc" className="bg-slate-900">💰 Price: Low to High</option>
            <option value="price_desc" className="bg-slate-900">💰 Price: High to Low</option>
            <option value="area_asc" className="bg-slate-900">📐 Area: Small to Large</option>
            <option value="area_desc" className="bg-slate-900">📐 Area: Large to Small</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* More Filters Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            showAdvanced || filters.family_bachelor || filters.parking || filters.lift || filters.pet_friendly
              ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
              : "bg-[#0b1328] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span>{showAdvanced ? "Fewer Amenities" : "More Amenities"}</span>
        </button>

        {/* Search & Reset Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => triggerSearch()}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Reset all filters"
            className="p-2.5 bg-[#0b1328] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

      </div>

      {/* Collapsible Advanced Amenities Filter */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fadeIn">
          
          {/* Family / Bachelor */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tenant Policy</label>
            <select
              name="family_bachelor"
              value={filters.family_bachelor}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0b1328] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
            >
              <option value="" className="bg-slate-900">Any Tenant</option>
              <option value="FAMILY" className="bg-slate-900">Family Only</option>
              <option value="BACHELOR" className="bg-slate-900">Bachelor Friendly</option>
            </select>
          </div>

          {/* Parking */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Vehicle Parking</label>
            <select
              name="parking"
              value={filters.parking}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0b1328] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
            >
              <option value="" className="bg-slate-900">Any</option>
              <option value="true" className="bg-slate-900">Parking Required</option>
            </select>
          </div>

          {/* Lift */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Elevator / Lift</label>
            <select
              name="lift"
              value={filters.lift}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0b1328] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
            >
              <option value="" className="bg-slate-900">Any</option>
              <option value="true" className="bg-slate-900">Lift Required</option>
            </select>
          </div>

          {/* Pet Friendly */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Pet Friendly</label>
            <select
              name="pet_friendly"
              value={filters.pet_friendly}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0b1328] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
            >
              <option value="" className="bg-slate-900">Any</option>
              <option value="true" className="bg-slate-900">Pet Friendly Only</option>
            </select>
          </div>

        </div>
      )}

    </div>
  );
};

export default SearchFilter;