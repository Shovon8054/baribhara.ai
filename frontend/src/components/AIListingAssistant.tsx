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
    <section className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <span aria-hidden="true">✦</span> AI listing assistant
          </p>
          <p className="mt-1 text-xs text-slate-400">Uses the details in this form to draft your title and description.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void generate("title")}
            disabled={loadingAction !== null}
            className="rounded-lg border border-cyan-500/30 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingAction === "title" ? "Generating…" : "Generate title"}
          </button>
          <button
            type="button"
            onClick={() => void generate("description")}
            disabled={loadingAction !== null}
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 px-3 py-2 text-xs font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-600 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingAction === "description" ? "Generating…" : "Generate description"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AIListingAssistant;
