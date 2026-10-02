import { z } from "zod";
export const verificationStatusEnum = z.enum([
    "PENDING",
    "VERIFIED",
    "REJECTED",
    "MANUAL_REVIEW",
]);
/**
 * Validates verification submission payload.
 * Supports snake_case and common aliases (e.g., documented_name vs document_name).
 */
export const submitVerificationSchema = z
    .object({
    document_name: z.string().optional(),
    documented_name: z.string().optional(),
    father_name: z.string().optional(),
    fathers_name: z.string().optional(),
    mother_name: z.string().optional(),
    mothers_name: z.string().optional(),
    date_of_birth: z.string().optional(),
    dob: z.string().optional(),
    nid_number: z.string().optional(),
    nid_hash: z.string().optional(),
})
    .transform((data) => {
    const documentName = (data.documented_name || data.document_name || "").trim();
    const fatherName = (data.fathers_name || data.father_name || "").trim();
    const motherName = (data.mothers_name || data.mother_name || "").trim();
    const dateOfBirth = (data.date_of_birth || data.dob || "").trim();
    return {
        document_name: documentName,
        father_name: fatherName,
        mother_name: motherName,
        date_of_birth: dateOfBirth,
        nid_number: data.nid_number ? data.nid_number.trim() : undefined,
        nid_hash: data.nid_hash ? data.nid_hash.trim() : undefined,
    };
})
    .superRefine((val, ctx) => {
    if (!val.document_name || val.document_name.length < 2) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["documented_name"],
            message: "Documented name is required (minimum 2 characters).",
        });
    }
    if (!val.father_name || val.father_name.length < 2) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["fathers_name"],
            message: "Father's name is required.",
        });
    }
    if (!val.mother_name || val.mother_name.length < 2) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["mothers_name"],
            message: "Mother's name is required.",
        });
    }
    if (!val.date_of_birth) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["date_of_birth"],
            message: "Date of birth is required.",
        });
    }
    else {
        const parsedDate = new Date(val.date_of_birth);
        if (isNaN(parsedDate.getTime())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["date_of_birth"],
                message: "Date of birth must be a valid date format (e.g. YYYY-MM-DD).",
            });
        }
    }
});
export const reviewVerificationSchema = z.object({
    status: verificationStatusEnum,
    rejection_reason: z.string().max(1000).optional().nullable(),
    review_notes: z.string().max(1000).optional().nullable(),
});
