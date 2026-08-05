import { useState } from "react";
import axios from "axios";
import api from "../api/axios";

interface ListingDetails {
  propertyType: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  price: string;
  parking: boolean;
  lift: boolean;
}

interface AIListingAssistantProps {
  propertyInfo: ListingDetails;
  onApplyTitle: (title: string) => void;
  onApplyDescription: (description: string) => void;
}

const AIListingAssistant = ({
  propertyInfo,
  onApplyTitle,
  onApplyDescription,
}: AIListingAssistantProps) => {
  const [loadingAction, setLoadingAction] = useState<"title" | "description" | null>(null);

  const generate = async (action: "title" | "description") => {
    try {
      setLoadingAction(action);
      const response = await api.post("/ai/listing", { action, data: propertyInfo });
      const result = response.data.result as string;

      if (action === "title") onApplyTitle(result);
      else onApplyDescription(result);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "AI request failed. Please try again."
        : "AI request failed. Please try again.";
      alert(message);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
<section className="relative rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 sm:p-5 overflow-hidden transition-all duration-300 hover:border-cyan-500/40 hover:bg-cyan-500/10">
  
  {/* Ambient Glow */}
  <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
  
  <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    
    {/* Left Content */}
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <div>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          AI Listing Assistant
        </p>
        <p className="mt-1 text-xs text-slate-400 max-w-md">
          Uses the details in this form to draft your title and description instantly.
        </p>
      </div>
    </div>
    
    {/* Right Buttons */}
    <div className="flex flex-wrap gap-2 ml-11 sm:ml-0">
      <button
        type="button"
        onClick={() => void generate("title")}
        disabled={loadingAction !== null}
        className="
        group
        relative
        overflow-hidden
        rounded-lg
        border border-cyan-500/30
        px-4 py-2
        text-xs font-medium
        text-cyan-300
        transition-all
        duration-300
        hover:bg-cyan-500/10
        hover:border-cyan-500/50
        hover:text-cyan-200
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:hover:bg-transparent
        disabled:hover:border-cyan-500/30
        disabled:hover:text-cyan-300
        "
      >
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"></span>
        {loadingAction === "title" ? (
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Title
          </span>
        )}
      </button>
      
      <button
        type="button"
        onClick={() => void generate("description")}
        disabled={loadingAction !== null}
        className="
        group
        relative
        overflow-hidden
        rounded-lg
        bg-gradient-to-r from-cyan-500 to-indigo-500
        px-4 py-2
        text-xs font-medium
        text-white
        shadow-lg shadow-cyan-500/20
        hover:from-cyan-600 hover:to-indigo-600
        hover:shadow-cyan-500/30
        transition-all
        duration-300
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:hover:from-cyan-500
        disabled:hover:to-indigo-500
        disabled:hover:shadow-cyan-500/20
        "
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
        {loadingAction === "description" ? (
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Description
          </span>
        )}
      </button>
    </div>
    
  </div>
</section>
  );
};

export default AIListingAssistant;
