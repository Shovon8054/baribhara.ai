import api from "../api/axios";

export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED" | "MANUAL_REVIEW";

export interface VerificationRecord {
  id: string;
  documentName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  status: VerificationStatus;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationStatusResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    isVerified: boolean;
  };
  verification: VerificationRecord | null;
  history: {
    id: string;
    status: string;
    rejection_reason?: string;
    attempt_number: number;
    created_at: string;
  }[];
}

export interface SubmitVerificationPayload {
  document_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  nid_document: File;
}

/** GET /api/verification/status */
export const getVerificationStatus = async (): Promise<VerificationStatusResponse> => {
  const res = await api.get("/verification/status");
  return res.data.data;
};

/** POST /api/verification — multipart/form-data */
export const submitVerification = async (
  payload: SubmitVerificationPayload
): Promise<VerificationRecord> => {
  const form = new FormData();
  form.append("document_name", payload.document_name);
  form.append("father_name", payload.father_name);
  form.append("mother_name", payload.mother_name);
  form.append("date_of_birth", payload.date_of_birth);
  // Must match Multer field name: 'nid_pdf' | 'document' | 'file'
  form.append("nid_pdf", payload.nid_document);

  const res = await api.post("/verification", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Backend returns { verification: {...}, attempt: {...}, decision: {...} }
  // We only need the verification record for UI state.
  const payload_data = res.data.data;
  return (payload_data?.verification ?? payload_data) as VerificationRecord;
};

// ──────────────────────────────────────────────
// Admin endpoints
// ──────────────────────────────────────────────

/** Matches the nested shape the backend actually returns for list items */
interface RawAdminVerificationItem {
  id: string;
  userId: string;
  user: { id: string; fullName: string; email: string; phone?: string; role?: string; isVerified?: boolean };
  submittedData: { documentName: string; fatherName: string; motherName: string; dateOfBirth: string };
  status: VerificationStatus;
  reviewReason?: string | null;
  latestReason?: string | null;
  aiExtraction?: Record<string, unknown> | null;
  documentUrl?: string | null;
  attemptNumber?: number;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  history?: unknown[];
}

/** Flat shape the UI components consume */
export interface AdminVerificationItem {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  document_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  status: VerificationStatus;
  rejection_reason?: string | null;
  review_reason?: string | null;
  ai_extraction?: Record<string, any> | null;
  signedDocumentUrl?: string | null;
  created_at: string;
  updated_at: string;
}

/** Normalise a raw backend item into the flat UI shape */
function normalise(raw: RawAdminVerificationItem): AdminVerificationItem {
  return {
    id: raw.id,
    user_id: raw.userId,
    full_name: raw.user?.fullName || "",
    email: raw.user?.email || "",
    phone: raw.user?.phone || "",
    document_name: raw.submittedData?.documentName || "",
    father_name: raw.submittedData?.fatherName || "",
    mother_name: raw.submittedData?.motherName || "",
    date_of_birth: raw.submittedData?.dateOfBirth || "",
    status: raw.status,
    rejection_reason: raw.latestReason ?? raw.reviewReason ?? null,
    review_reason: raw.reviewReason ?? null,
    ai_extraction: (raw.aiExtraction as Record<string, any>) ?? null,
    signedDocumentUrl: (raw.documentUrl as string) ?? null,
    created_at: raw.createdAt,
    updated_at: raw.updatedAt,
  };
}

/** GET /api/admin/verifications */
export const getAdminVerifications = async (
  status?: string
): Promise<AdminVerificationItem[]> => {
  const params = status ? { status } : {};
  const res = await api.get("/admin/verifications", { params });
  const rows: RawAdminVerificationItem[] = res.data.data || [];
  return rows.map(normalise);
};

/** GET /api/admin/verifications/:id */
export const getAdminVerificationDetail = async (
  id: string
): Promise<AdminVerificationItem> => {
  const res = await api.get(`/admin/verifications/${id}`);
  return normalise(res.data.data as RawAdminVerificationItem);
};

/** PATCH /api/admin/verifications/:id */
export const reviewAdminVerification = async (
  id: string,
  payload: { status: "VERIFIED" | "REJECTED"; reason?: string }
): Promise<void> => {
  await api.patch(`/admin/verifications/${id}`, payload);
};
