import { useState } from "react";

interface Props {
  onSearch: (filters: any) => void;
}

const SearchFilter = ({ onSearch }: Props) => {
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    // Filter out empty values
    const searchFilters: any = {};
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof typeof filters] !== "") {
        searchFilters[key] = filters[key as keyof typeof filters];
      }
    });
    onSearch(searchFilters);
  };

  const handleReset = () => {
    setFilters({
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
    onSearch({});
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5 sm:p-6 hover:border-cyan-500/30 transition-all duration-300">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h2 className="text-sm font-semibold text-white tracking-tight">
          Filter Properties
        </h2>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">

        {/* Location */}
        <input
          name="location"
          placeholder="Location"
          value={filters.location}
          className="
          w-full
          px-4 py-2.5
          bg-slate-900/50
          border border-slate-700
          rounded-lg
          text-sm text-white
          placeholder:text-slate-500
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-500/30
          focus:border-cyan-500
          transition-all
          duration-200
          hover:border-slate-600
          "
          onChange={handleChange}
        />

        {/* Min Price */}
        <input
          name="minPrice"
          placeholder="Min Price"
          type="number"
          value={filters.minPrice}
          className="
          w-full
          px-4 py-2.5
          bg-slate-900/50
          border border-slate-700
          rounded-lg
          text-sm text-white
          placeholder:text-slate-500
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-500/30
          focus:border-cyan-500
          transition-all
          duration-200
          hover:border-slate-600
          "
          onChange={handleChange}
        />

        {/* Max Price */}
        <input
          name="maxPrice"
          placeholder="Max Price"
          type="number"
          value={filters.maxPrice}
          className="
          w-full
          px-4 py-2.5
          bg-slate-900/50
          border border-slate-700
          rounded-lg
          text-sm text-white
          placeholder:text-slate-500
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-500/30
          focus:border-cyan-500
          transition-all
          duration-200
          hover:border-slate-600
          "
          onChange={handleChange}
        />

        {/* Bedrooms */}
        <input
          name="bedrooms"
          placeholder="Bedrooms"
          type="number"
          value={filters.bedrooms}
          className="
          w-full
          px-4 py-2.5
          bg-slate-900/50
          border border-slate-700
          rounded-lg
          text-sm text-white
          placeholder:text-slate-500
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-500/30
          focus:border-cyan-500
          transition-all
          duration-200
          hover:border-slate-600
          "
          onChange={handleChange}
        />

        {/* Bathrooms */}
        <input
          name="bathrooms"
          placeholder="Bathrooms"
          type="number"
          value={filters.bathrooms}
          className="
          w-full
          px-4 py-2.5
          bg-slate-900/50
          border border-slate-700
          rounded-lg
          text-sm text-white
          placeholder:text-slate-500
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-500/30
          focus:border-cyan-500
          transition-all
          duration-200
          hover:border-slate-600
          "
          onChange={handleChange}
        />

        {/* Property Type */}
        <select
          name="property_type"
          value={filters.property_type}
          className="
          w-full
          px-4 py-2.5
          bg-slate-900/50
          border border-slate-700
          rounded-lg
          text-sm text-white
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
          onChange={handleChange}
        >
          <option value="" className="bg-slate-900">Property Type</option>
          <option value="APARTMENT" className="bg-slate-900">🏢 Apartment</option>
          <option value="HOUSE" className="bg-slate-900">🏠 House</option>
          <option value="FLAT" className="bg-slate-900">🏢 Flat</option>
          <option value="STUDIO" className="bg-slate-900">🏢 Studio</option>
          <option value="PENTHOUSE" className="bg-slate-900">🏢 Penthouse</option>
          <option value="DUPLEX" className="bg-slate-900">🏢 Duplex</option>
        </select>

        {/* Tenant Type */}
        {/* <select
          name="family_bachelor"
          value={filters.family_bachelor}
          className="
          w-full
          px-4 py-2.5
          bg-slate-900/50
          border border-slate-700
          rounded-lg
          text-sm text-white
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
          onChange={handleChange}
        >
          <option value="" className="bg-slate-900">Tenant Type</option>
          <option value="FAMILY" className="bg-slate-900">👨‍👩‍👧‍👦 Family</option>
          <option value="BACHELOR" className="bg-slate-900">👤 Bachelor</option>
          <option value="ANY" className="bg-slate-900">🔄 Any</option>
        </select> */}

        {/* Parking */}
        {/* <select
          name="parking"
          value={filters.parking}
          className="
          w-full
          px-4 py-2.5
          bg-slate-900/50
          border border-slate-700
          rounded-lg
          text-sm text-white
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
          onChange={handleChange}
        >
          <option value="" className="bg-slate-900">Parking</option>
          <option value="true" className="bg-slate-900">✅ Yes</option>
          <option value="false" className="bg-slate-900">❌ No</option>
        </select> */}

        {/* Lift */}
        {/* <select
          name="lift"
          value={filters.lift}
          className="
          w-full
          px-4 py-2.5
          bg-slate-900/50
          border border-slate-700
          rounded-lg
          text-sm text-white
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
          onChange={handleChange}
        >
          <option value="" className="bg-slate-900">Lift</option>
          <option value="true" className="bg-slate-900">✅ Yes</option>
          <option value="false" className="bg-slate-900">❌ No</option>
        </select> */}

        {/* Pet Friendly */}
        {/* <select
          name="pet_friendly"
          value={filters.pet_friendly}
          className="
          w-full
          px-4 py-2.5
          bg-slate-900/50
          border border-slate-700
          rounded-lg
          text-sm text-white
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
          onChange={handleChange}
        >
          <option value="" className="bg-slate-900">Pet Friendly</option>
          <option value="true" className="bg-slate-900">🐾 Yes</option>
          <option value="false" className="bg-slate-900">🚫 No</option>
        </select> */}

        {/* Sort */}
        <select
          name="sort"
          value={filters.sort}
          className="
          w-full
          px-4 py-2.5
          bg-slate-900/50
          border border-slate-700
          rounded-lg
          text-sm text-white
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
          onChange={handleChange}
        >
          <option value="" className="bg-slate-900">Sort</option>
          <option value="latest" className="bg-slate-900">📅 Latest</option>
          <option value="oldest" className="bg-slate-900">📅 Oldest</option>
          <option value="price_asc" className="bg-slate-900">💰 Price Low → High</option>
          <option value="price_desc" className="bg-slate-900">💰 Price High → Low</option>
          <option value="area_asc" className="bg-slate-900">📐 Area Small → Large</option>
          <option value="area_desc" className="bg-slate-900">📐 Area Large → Small</option>
        </select>

      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={handleSearch}
          className="
          px-6 py-2.5
          bg-gradient-to-r from-cyan-500 to-cyan-600
          text-white
          text-sm
          font-medium
          rounded-lg
          hover:from-cyan-600 hover:to-cyan-700
          shadow-lg shadow-cyan-500/25
          hover:shadow-cyan-500/40
          transition-all
          duration-300
          flex items-center gap-2
          "
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </button>

        <button
          onClick={handleReset}
          className="
          px-6 py-2.5
          bg-slate-700/50
          text-slate-300
          text-sm
          font-medium
          rounded-lg
          hover:bg-slate-700
          hover:text-white
          border border-slate-600
          transition-all
          duration-300
          flex items-center gap-2
          "
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
      </div>

    </div>
  );
};

export default SearchFilter;