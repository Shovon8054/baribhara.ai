import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPropertyDetails } from "../../services/propertyDetails.service";
import { PropertyDetails } from "../../types/property";
import { addToFavorites } from "../../services/favorite.service";
import Review from "../../components/Review";

import toast from "react-hot-toast";

const ViewProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  // Visit Request States
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [visitNotes, setVisitNotes] = useState("");
  const currentUserId = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null") as { id?: string } | null;
      return user?.id;
    } catch {
      return undefined;
    }
  })();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetchProperty();
  }, [id]);


  const fetchProperty = async () => {
    try {
      if (!id) return;
      const data = await getPropertyDetails(id);
      setProperty(data);
      if (data.images && data.images.length > 0) {
        setSelectedImage(`http://localhost:8081${data.images[0]}`);
      }
    } catch (err) {
      console.error("Error fetching property:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVisitRequest = async () => {
    if (!visitDate || !visitTime) return;

    try {
      // Your API call here
      console.log("Visit Request:", {
        propertyId: id,
        date: visitDate,
        time: visitTime,
        notes: visitNotes,
      });

      // Show success message
      alert("Visit request submitted successfully!");
      setIsVisitModalOpen(false);
      setVisitDate("");
      setVisitTime("");
      setVisitNotes("");
    } catch (error) {
      console.error("Error submitting visit request:", error);
      alert("Failed to submit visit request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-white">Property Not Found</h2>
          <p className="text-slate-400 mt-2">The property you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/properties')}
            className="mt-4 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  //   ======================== Add to Favorites Handler =========================
  const handleFavorite = async () => {
    if (!property) return;

    try {
      const res = await addToFavorites(property.id);

      toast.success(res.message);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add favorite"
      );
    }
  };

  const isOwner = property.owner_id === currentUserId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="
    group 
    mb-6 
    flex items-center gap-2.5 
    px-4 py-2.5 
    bg-slate-800/50 
    backdrop-blur-sm 
    border border-slate-700/50 
    rounded-xl 
    text-sm font-medium 
    text-slate-300 
    hover:bg-slate-700/50 
    hover:border-cyan-500/30 
    hover:text-white 
    hover:shadow-lg 
    hover:shadow-cyan-500/5 
    transition-all 
    duration-300 
    w-fit
    "
        >
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-cyan-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="relative">
            Back
            <span className="absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-cyan-400/0 via-cyan-400/0 to-cyan-400/0 group-hover:via-cyan-400/50 transition-all duration-300"></span>
          </span>
        </button>

        {/* Main Image with Gallery */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 group">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt={property.title}
              className="w-full h-[400px] sm:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-[400px] sm:h-[500px] flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-slate-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-500">No Image Available</p>
              </div>
            </div>
          )}

          {/* Image Gallery Thumbnails */}
          {property.images && property.images.length > 0 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto px-4 max-w-full pb-1">
              {property.images.map((img, index) => (
                <button
                  key={img || index}
                  onClick={() => setSelectedImage(`http://localhost:8081${img}`)}
                  className={`flex-shrink-0 w-16 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === `http://localhost:8081${img}`
                      ? 'border-cyan-400 shadow-lg shadow-cyan-500/40 scale-105'
                      : 'border-transparent hover:border-slate-400 hover:scale-105'
                    }`}
                >
                  <img
                    src={`http://localhost:8081${img}`}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Availability Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold shadow-lg shadow-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Available
            </span>
          </div>
        </div>

        {/* Property Details Header */}
        <div className="mt-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                {property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.location}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {property.property_type || "N/A"}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-right">
                <p className="text-3xl sm:text-4xl font-bold text-cyan-400">
                  ৳ {property.price?.toLocaleString() || property.price}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Monthly Rent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <span className="text-xl">🛏</span>
              <div>
                <p className="text-lg font-semibold text-white">{property.bedrooms || 0}</p>
                <p className="text-xs text-slate-400">Bedrooms</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <span className="text-xl">🚿</span>
              <div>
                <p className="text-lg font-semibold text-white">{property.bathrooms || 0}</p>
                <p className="text-xs text-slate-400">Bathrooms</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <span className="text-xl">📐</span>
              <div>
                <p className="text-lg font-semibold text-white">{property.area || 0}</p>
                <p className="text-xs text-slate-400">Square Feet</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <span className="text-xl">👨‍👩‍👧</span>
              <div>
                <p className="text-lg font-semibold text-white">{property.family_bachelor || "N/A"}</p>
                <p className="text-xs text-slate-400">Tenant Type</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Description
          </h2>
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
            <p className="text-sm text-slate-300 leading-relaxed">
              {property.description || "No description available."}
            </p>
          </div>
        </div>

        {/* Amenities & Nearby */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((item, index) => (
                  <span
                    key={item || index}
                    className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium rounded-full hover:bg-cyan-500/20 transition-colors duration-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {property.nearby_facilities && property.nearby_facilities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Nearby Facilities
              </h2>
              <div className="flex flex-wrap gap-2">
                {property.nearby_facilities.map((item, index) => (
                  <span
                    key={item || index}
                    className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full hover:bg-emerald-500/20 transition-colors duration-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Owner Information */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Owner Information
          </h2>
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-cyan-500/20">
                  {property.full_name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Name</p>
                  <p className="text-sm font-medium text-white">{property.full_name || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-white">{property.email || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isOwner && <div className="flex flex-wrap gap-3 mt-8">

          {/* add to fac button========================================================= */}
          <button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-sm font-medium hover:from-cyan-600 hover:to-indigo-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center gap-2"
            onClick={() => { handleFavorite() }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Add to Favorites
          </button>

          {/* visit req button======================================================================= */}
          {/* <button
        onClick={() => setIsVisitModalOpen(true)}
        className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:border-cyan-500/50 hover:text-white transition-all duration-300 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Visit Request
      </button> */}

          {/* =====================================chat with owner button===================================== */}
          <button
            className="px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all duration-300 flex items-center gap-2"
            onClick={() => {/* Chat logic */ }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat With Owner
          </button>
        </div>}

        {/* =============================Ratings & Reviews section=========================== */}
        <div className="mt-10">
          <Review />
        </div>

        {/* =========================================Visit Request Modal ===================================*/}
        {!isOwner && isVisitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 max-w-md w-full p-6 shadow-2xl animate-slideUp">

              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-white">Schedule a Visit</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Choose your preferred date and time</p>
                </div>
                <button
                  onClick={() => setIsVisitModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-5">
                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                    Select Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-200"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Time Selector - 4 Slots */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                    Select Time
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setVisitTime(time)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${visitTime === time
                            ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/25'
                            : 'bg-slate-900/50 border border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-white'
                          }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all duration-200 resize-none"
                    placeholder="Any specific requirements or questions..."
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                  />
                </div>

                {/* ====================Submit Button */}
                <button
                  onClick={handleVisitRequest}
                  disabled={!visitDate || !visitTime}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-sm font-medium rounded-xl hover:from-cyan-600 hover:to-indigo-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                >
                  Submit Visit Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CSS Animations */}
        <style>{`
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      .animate-slideUp {
        animation: slideUp 0.3s ease-out;
      }
      .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
      }
    `}</style>
      </div>
    </div>
  );
};

export default ViewProperty;
