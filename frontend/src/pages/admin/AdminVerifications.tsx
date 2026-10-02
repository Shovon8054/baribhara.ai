import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getAdminVerifications,
  getAdminVerificationDetail,
  reviewAdminVerification,
  AdminVerificationItem,
  VerificationStatus,
} from "../../services/verification.service";
import VerificationBadge from "../../components/VerificationBadge";
import api from "../../api/axios";

// ─────────────────────────────────────────────────────────────────
// Status filter tabs
// ─────────────────────────────────────────────────────────────────
const STATUS_TABS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Manual Review", value: "MANUAL_REVIEW" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Rejected", value: "REJECTED" },
];

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
const fmtDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { dateStyle: "medium" }) : "—";

const statusColors: Record<VerificationStatus, string> = {
  PENDING: "bg-amber-500/15 border-amber-500/40 text-amber-400",
  VERIFIED: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
  REJECTED: "bg-rose-500/15 border-rose-500/40 text-rose-400",
  MANUAL_REVIEW: "bg-purple-500/15 border-purple-500/40 text-purple-400",
};

// suppress unused warning
void statusColors;

// ─────────────────────────────────────────────────────────────────
// PDF Viewer — fetches via authenticated backend proxy → blob URL
// The admin's browser never touches Cloudinary directly.
// ─────────────────────────────────────────────────────────────────
const PdfViewer = ({ verificationId }: { verificationId: string }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevBlobUrl = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setBlobUrl(null);

    api
      .get(`/admin/verifications/${verificationId}/document`, {
        responseType: "blob",
      })
      .then((res) => {
        if (cancelled) return;
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        prevBlobUrl.current = url;
        setBlobUrl(url);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.message || "Failed to load NID document.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      if (prevBlobUrl.current) {
        URL.revokeObjectURL(prevBlobUrl.current);
        prevBlobUrl.current = null;
      }
    };
  }, [verificationId]);

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            NID Document PDF
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Secure authenticated document</p>
        </div>
        {blobUrl && (
          <button
            type="button"
            onClick={() => window.open(blobUrl, "_blank")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 transition-colors"
          >
            Open in New Tab
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="w-full h-[450px] rounded-xl bg-slate-950 border border-slate-700/80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Loading document…</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="w-full rounded-xl bg-rose-500/10 border border-rose-500/30 p-6 text-center">
          <p className="text-sm text-rose-400 font-medium">{error}</p>
          <p className="text-xs text-slate-400 mt-1">
            The document may have been removed or is unavailable.
          </p>
        </div>
      )}

      {/* PDF iframe */}
      {blobUrl && !loading && (
        <div className="w-full rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-inner">
          <iframe
            src={blobUrl}
            title="NID Document PDF Preview"
            className="w-full h-[500px] sm:h-[600px] rounded-lg bg-slate-950"
          />
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Detail/Review Modal
// ─────────────────────────────────────────────────────────────────
interface DetailModalProps {
  item: AdminVerificationItem;
  onClose: () => void;
  onDecision: (id: string, status: "VERIFIED" | "REJECTED", reason?: string) => Promise<void>;
  processing: boolean;
}

const DetailModal = ({ item, onClose, onDecision, processing }: DetailModalProps) => {
  const [reason, setReason] = useState("");
  const [pendingAction, setPendingAction] = useState<"VERIFIED" | "REJECTED" | null>(null);

  const handleDecision = async (action: "VERIFIED" | "REJECTED") => {
    setPendingAction(action);
    await onDecision(item.id, action, reason.trim() || undefined);
    setPendingAction(null);
  };

  const ai = item.ai_extraction as any;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Verification Review
              <VerificationBadge status={item.status} size="xs" showLabel />
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Submitted by {item.full_name || item.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Submitted details vs Gemini Extraction grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Submitted */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Submitted Information
              </h3>
              <div className="space-y-2.5 text-sm">
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider">Name on Document</p>
                  <p className="text-white font-medium">{item.document_name || "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider">Date of Birth</p>
                  <p className="text-white font-medium">{fmtDate(item.date_of_birth)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider">Father's Name</p>
                  <p className="text-white font-medium">{item.father_name || "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider">Mother's Name</p>
                  <p className="text-white font-medium">{item.mother_name || "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider">User Email / Phone</p>
                  <p className="text-white font-medium">
                    {item.email} {item.phone ? `(${item.phone})` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Extraction */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Gemini AI OCR Extracted
              </h3>
              {ai ? (
                <div className="space-y-2.5 text-sm">
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase tracking-wider">Extracted Name</p>
                    <p className="text-white font-medium">{ai.name || ai.document_name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase tracking-wider">Extracted Date of Birth</p>
                    <p className="text-white font-medium">{ai.date_of_birth || ai.dateOfBirth || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase tracking-wider">Extracted Father's Name</p>
                    <p className="text-white font-medium">{ai.father_name || ai.fatherName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase tracking-wider">Extracted Mother's Name</p>
                    <p className="text-white font-medium">{ai.mother_name || ai.motherName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase tracking-wider">Extracted NID Number / Readable</p>
                    <p className="text-white font-medium">
                      {ai.nid_number || ai.nidNumber || "—"}{" "}
                      <span className="text-xs text-slate-400">
                        ({ai.document_readable ?? ai.documentReadable ? "Readable" : "Unclear"})
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-6 text-center">
                  No automated OCR extraction recorded for this attempt.
                </div>
              )}
            </div>
          </div>

          {/* Rejection / Review reason */}
          {(item.rejection_reason || item.review_reason) && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {item.rejection_reason ? "Rejection Reason" : "Review Reason"}
              </h3>
              <p className="text-sm text-slate-300">{item.rejection_reason || item.review_reason}</p>
            </div>
          )}

          {/* NID Document viewer — authenticated backend proxy */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <PdfViewer verificationId={item.id} />
          </div>

          {/* Admin decision */}
          {(item.status === "PENDING" || item.status === "MANUAL_REVIEW") && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Reason (optional for approval, required for rejection)
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide a reason for your decision..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/60 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60 resize-none transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleDecision("VERIFIED")}
                  disabled={processing}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200 flex items-center gap-2"
                >
                  {pendingAction === "VERIFIED" && processing ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  Approve
                </button>
                <button
                  onClick={() => handleDecision("REJECTED")}
                  disabled={processing}
                  className="px-5 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 text-sm font-semibold hover:bg-rose-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  {pendingAction === "REJECTED" && processing ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────
const AdminVerifications = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<AdminVerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<AdminVerificationItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────
  const fetchItems = async (status?: string) => {
    try {
      setLoading(true);
      const data = await getAdminVerifications(status || undefined);
      setItems(data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load verifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(activeTab);
  }, [activeTab]);

  // ── Open detail ────────────────────────────────────────────
  const openDetail = async (item: AdminVerificationItem) => {
    try {
      setDetailLoading(true);
      const detail = await getAdminVerificationDetail(item.id);
      setSelectedItem(detail);
    } catch {
      setSelectedItem(item);
    } finally {
      setDetailLoading(false);
    }
  };

  // ── Review decision ────────────────────────────────────────
  const handleDecision = async (
    id: string,
    status: "VERIFIED" | "REJECTED",
    reason?: string
  ) => {
    try {
      setProcessing(true);
      await reviewAdminVerification(id, { status, reason });
      toast.success(`Verification ${status === "VERIFIED" ? "approved" : "rejected"} successfully.`);
      setSelectedItem(null);
      await fetchItems(activeTab);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to process decision.");
    } finally {
      setProcessing(false);
    }
  };

  // ── Filtered items ─────────────────────────────────────────
  const filtered = items.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.full_name?.toLowerCase().includes(term) ||
      item.email?.toLowerCase().includes(term) ||
      item.document_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 pb-16">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed top-0 left-1/4 w-[500px] h-[350px] bg-cyan-500/8 rounded-full blur-[120px] -z-10" />
      <div className="pointer-events-none fixed top-40 right-10 w-[450px] h-[350px] bg-purple-600/8 rounded-full blur-[140px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Identity Verifications</h1>
              <p className="text-xs text-slate-400 mt-0.5">Review and manage user identity submissions</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60 transition-all"
            />
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.value
                  ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/10"
                  : "bg-slate-800/50 border border-slate-700/40 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500" />

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
                <p className="text-xs text-slate-400">Loading verifications...</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-3">
                <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-white">No verifications found</p>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab ? `No ${activeTab.replace("_", " ").toLowerCase()} submissions.` : "No submissions yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800/80">
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">User</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Name on Doc</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Submitted</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`border-b border-slate-800/40 hover:bg-slate-800/30 transition-colors ${
                        idx % 2 === 0 ? "bg-slate-900/20" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-white">{item.full_name || "—"}</p>
                          <p className="text-xs text-slate-400">{item.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{item.document_name || "—"}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">{fmtDate(item.created_at)}</td>
                      <td className="px-6 py-4">
                        <VerificationBadge status={item.status} size="sm" showLabel />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openDetail(item)}
                          disabled={detailLoading}
                          className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs font-semibold hover:bg-cyan-500/15 hover:text-cyan-300 hover:border-cyan-500/40 transition-all duration-200 disabled:opacity-50"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary row */}
        {!loading && filtered.length > 0 && (
          <p className="mt-4 text-xs text-slate-500 text-center">
            Showing {filtered.length} of {items.length} submissions
          </p>
        )}
      </div>

      {/* Detail modal */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDecision={handleDecision}
          processing={processing}
        />
      )}
    </div>
  );
};

export default AdminVerifications;
