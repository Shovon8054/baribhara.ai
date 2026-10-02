import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  getVerificationStatus,
  submitVerification,
  VerificationRecord,
  VerificationStatus,
} from "../services/verification.service";
import VerificationBadge from "./VerificationBadge";

const MAX_PDF_MB = 5;

// ─────────────────────────────────────────────────────────────────
// Status display config
// ─────────────────────────────────────────────────────────────────
const statusConfig: Record<
  VerificationStatus,
  { title: string; description: string; color: string; bg: string; border: string; icon: JSX.Element }
> = {
  VERIFIED: {
    title: "Identity Verified",
    description: "Your identity has been successfully verified. A verification badge is now visible on your profile and properties.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  PENDING: {
    title: "Verification Pending",
    description: "Your identity documents have been submitted and are currently under review. This typically takes 1–2 business days.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  REJECTED: {
    title: "Verification Rejected",
    description: "Your verification was unsuccessful. Please review the reason below and resubmit with correct information.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  MANUAL_REVIEW: {
    title: "Under Manual Review",
    description: "Our team is manually reviewing your documents. You will be notified once a decision has been made.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
};

// ─────────────────────────────────────────────────────────────────
// Form field
// ─────────────────────────────────────────────────────────────────
interface FieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}

const Field = ({ id, label, type = "text", value, onChange, placeholder, required }: FieldProps) => (
  <div>
    <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
      {label} {required && <span className="text-rose-400">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60 transition-all duration-200"
    />
  </div>
);

// ─────────────────────────────────────────────────────────────────
// Main Panel
// ─────────────────────────────────────────────────────────────────
interface VerificationPanelProps {
  /** Called when status changes so parent can refresh is_verified flag */
  onStatusChange?: (status: VerificationStatus) => void;
}

const VerificationPanel = ({ onStatusChange }: VerificationPanelProps) => {
  const [statusLoading, setStatusLoading] = useState(true);
  const [verification, setVerification] = useState<VerificationRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [docName, setDocName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [dob, setDob] = useState("");
  const [nidFile, setNidFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load status ─────────────────────────────────────────────
  const loadStatus = async () => {
    try {
      setStatusLoading(true);
      const data = await getVerificationStatus();
      setVerification(data?.verification ?? null);
      if (data?.verification?.status) {
        onStatusChange?.(data.verification.status);
      }
    } catch (err: any) {
      // 404 = no verification yet, that's fine
      if (err?.response?.status !== 404) {
        console.error("Failed to fetch verification status:", err);
      }
      setVerification(null);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── File pick ────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setFileError("Only PDF files are accepted.");
      setNidFile(null);
      return;
    }
    if (file.size > MAX_PDF_MB * 1024 * 1024) {
      setFileError(`File size must be under ${MAX_PDF_MB} MB.`);
      setNidFile(null);
      return;
    }
    setNidFile(file);
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nidFile) {
      setFileError("Please upload your NID document (PDF).");
      return;
    }

    try {
      setSubmitting(true);
      const result = await submitVerification({
        document_name: docName.trim(),
        father_name: fatherName.trim(),
        mother_name: motherName.trim(),
        date_of_birth: dob,
        nid_document: nidFile,
      });

      setVerification(result);
      onStatusChange?.(result.status);
      setShowForm(false);
      toast.success("Verification submitted! We'll review your documents shortly.");

      // Reset form
      setDocName(""); setFatherName(""); setMotherName(""); setDob(""); setNidFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to submit verification. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derive "can resubmit" ────────────────────────────────────
  const canSubmit = !verification || verification.status === "REJECTED";
  const isVerified = verification?.status === "VERIFIED";

  // ── Loading skeleton ─────────────────────────────────────────
  if (statusLoading) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 animate-pulse">
        <div className="h-5 w-48 bg-slate-800 rounded-lg mb-4" />
        <div className="h-3 w-72 bg-slate-800/60 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
      {/* Top accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500" />

      <div className="p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800/80 mb-6">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Identity Verification</h2>
            <p className="text-xs text-slate-400">Verify your identity to build trust with landlords & tenants</p>
          </div>
        </div>

        {/* ── Status Banner ───────────────────────────────────── */}
        {verification && statusConfig[verification.status] && (
          <div
            className={`flex items-start gap-4 rounded-xl p-4 border mb-6 ${statusConfig[verification.status].bg} ${statusConfig[verification.status].border}`}
          >
            <div className={`flex-shrink-0 mt-0.5 ${statusConfig[verification.status].color}`}>
              {statusConfig[verification.status].icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className={`font-bold text-sm ${statusConfig[verification.status].color}`}>
                  {statusConfig[verification.status].title}
                </p>
                <VerificationBadge status={verification.status} size="xs" showLabel />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {statusConfig[verification.status].description}
              </p>

              {/* Submitted info */}
              {verification.documentName && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-400">
                  <span><span className="text-slate-500">Name on Doc:</span> {verification.documentName}</span>
                  {verification.dateOfBirth && (
                    <span>
                      <span className="text-slate-500">DOB:</span>{" "}
                      {new Date(verification.dateOfBirth).toLocaleDateString("en-US", { dateStyle: "medium" })}
                    </span>
                  )}
                  {verification.createdAt && (
                    <span>
                      <span className="text-slate-500">Submitted:</span>{" "}
                      {new Date(verification.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                    </span>
                  )}
                  {isVerified && verification.verifiedAt && (
                    <span>
                      <span className="text-emerald-500">Verified on:</span>{" "}
                      {new Date(verification.verifiedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── No submission yet ───────────────────────────────── */}
        {!verification && !showForm && (
          <div className="flex flex-col items-center text-center py-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3 shadow-inner">
              <svg className="w-7 h-7 text-cyan-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-white mb-1">Not Yet Verified</p>
            <p className="text-xs text-slate-400 max-w-sm">
              Submit your National ID document to receive a verified badge that appears on your profile, properties, and chats.
            </p>
          </div>
        )}

        {/* ── Action / Form Toggle ─────────────────────────────── */}
        {!isVerified && !showForm && (
          <button
            id="btn-verify-identity"
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {canSubmit && verification ? "Resubmit Verification" : "Verify My Identity"}
          </button>
        )}

        {/* ── Submission Form ──────────────────────────────────── */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                id="v-doc-name"
                label="Name as on Document"
                value={docName}
                onChange={setDocName}
                placeholder="Exactly as it appears on your NID"
                required
              />
              <Field
                id="v-dob"
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={setDob}
                required
              />
              <Field
                id="v-father"
                label="Father's Name"
                value={fatherName}
                onChange={setFatherName}
                placeholder="As on NID"
                required
              />
              <Field
                id="v-mother"
                label="Mother's Name"
                value={motherName}
                onChange={setMotherName}
                placeholder="As on NID"
                required
              />
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                NID Document (PDF) <span className="text-rose-400">*</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-2 px-6 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  nidFile
                    ? "border-cyan-500/50 bg-cyan-500/5"
                    : fileError
                    ? "border-rose-500/50 bg-rose-500/5"
                    : "border-slate-700/60 bg-slate-900/40 hover:border-cyan-500/40 hover:bg-cyan-500/5"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {nidFile ? (
                  <>
                    <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-semibold text-cyan-400">{nidFile.name}</p>
                    <p className="text-xs text-slate-500">{(nidFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-sm text-slate-400">Click to upload your NID PDF</p>
                    <p className="text-xs text-slate-500">Max {MAX_PDF_MB} MB · PDF only</p>
                  </>
                )}
              </div>
              {fileError && <p className="mt-1.5 text-xs text-rose-400">{fileError}</p>}
              <p className="mt-1.5 text-[11px] text-slate-500">
                Your document is encrypted and stored securely. It will never be shared publicly.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  "Submit for Verification"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFileError("");
                  setNidFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-slate-300 text-sm font-semibold hover:bg-slate-800 hover:text-white transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerificationPanel;
