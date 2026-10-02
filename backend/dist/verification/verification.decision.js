/**
 * Normalizes a string for fair comparison:
 * - Lowercases and trims
 * - Removes honorifics/titles (md, mst, mr, mrs, miss)
 * - Removes punctuation (dots, commas, dashes)
 * - Collapses repeated whitespace
 */
export function normalizeString(str) {
    if (!str)
        return "";
    return str
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ") // replace punctuation with space
        .replace(/\b(md|mst|mr|mrs|miss|dr|engr)\b/gi, "") // strip common titles
        .replace(/\s+/g, " ") // collapse multiple spaces
        .trim();
}
/**
 * Normalizes date strings to YYYY-MM-DD
 */
export function normalizeDate(dateStr) {
    if (!dateStr)
        return null;
    const cleaned = dateStr.trim().replace(/\//g, "-");
    // Check if already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
        return cleaned;
    }
    // Check DD-MM-YYYY format
    const dmyMatch = cleaned.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (dmyMatch) {
        const day = dmyMatch[1].padStart(2, "0");
        const month = dmyMatch[2].padStart(2, "0");
        const year = dmyMatch[3];
        return `${year}-${month}-${day}`;
    }
    const parsed = new Date(cleaned);
    if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split("T")[0];
    }
    return cleaned;
}
/**
 * Calculates word-level similarity between two normalized strings.
 * Returns true if strings are identical or contain each other's core tokens.
 */
function areStringsMatching(a, b) {
    const normA = normalizeString(a);
    const normB = normalizeString(b);
    if (!normA && !normB)
        return true;
    if (!normA || !normB)
        return false;
    if (normA === normB)
        return true;
    // Check token intersection
    const tokensA = normA.split(" ").filter(Boolean);
    const tokensB = normB.split(" ").filter(Boolean);
    if (tokensA.length === 0 || tokensB.length === 0)
        return false;
    const setB = new Set(tokensB);
    const common = tokensA.filter((t) => setB.has(t));
    // If most tokens match (e.g. "rahim ahmed" vs "rahim ahmed choudhury")
    const overlapRatio = (2 * common.length) / (tokensA.length + tokensB.length);
    return overlapRatio >= 0.7;
}
/**
 * Evaluates submitted user information against Gemini-extracted information
 * and decides verification status strictly through backend business logic.
 */
export function evaluateVerificationDecision(submitted, extracted, isDuplicateNid) {
    // 1. If duplicate NID detected across users -> needs human investigation
    if (isDuplicateNid) {
        return {
            status: "MANUAL_REVIEW",
            reason: "This NID number is already associated with another account in the system.",
            matchDetails: {
                nameMatch: false,
                fatherNameMatch: false,
                motherNameMatch: false,
                dobMatch: false,
                nidMatch: false,
                documentReadable: extracted.documentReadable,
            },
            notes: "Duplicate NID detected. Manual security review required before approval.",
        };
    }
    // 2. If the document is marked unreadable or corrupt
    if (!extracted.documentReadable) {
        return {
            status: "MANUAL_REVIEW",
            reason: extracted.extractionNotes ||
                "The uploaded NID document is blurry, illegible, or could not be verified automatically.",
            matchDetails: {
                nameMatch: false,
                fatherNameMatch: false,
                motherNameMatch: false,
                dobMatch: false,
                nidMatch: false,
                documentReadable: false,
            },
            notes: "Document readability failed. Routed to manual review.",
        };
    }
    // 3. If extraction is incomplete (missing essential fields from document)
    const isMissingCoreFields = !extracted.name || !extracted.date_of_birth;
    if (isMissingCoreFields) {
        return {
            status: "MANUAL_REVIEW",
            reason: "Key information could not be clearly extracted from the document for automated verification.",
            matchDetails: {
                nameMatch: false,
                fatherNameMatch: false,
                motherNameMatch: false,
                dobMatch: false,
                nidMatch: false,
                documentReadable: true,
            },
            notes: "Incomplete document extraction. Routed to manual review.",
        };
    }
    // 4. Compare fields
    const nameMatch = areStringsMatching(submitted.document_name, extracted.name);
    const subDob = normalizeDate(submitted.date_of_birth);
    const extDob = normalizeDate(extracted.date_of_birth);
    const dobMatch = Boolean(subDob && extDob && subDob === extDob);
    // Father name comparison (if available in both)
    let fatherNameMatch = true;
    if (submitted.father_name && extracted.father_name) {
        fatherNameMatch = areStringsMatching(submitted.father_name, extracted.father_name);
    }
    // Mother name comparison (if available in both)
    let motherNameMatch = true;
    if (submitted.mother_name && extracted.mother_name) {
        motherNameMatch = areStringsMatching(submitted.mother_name, extracted.mother_name);
    }
    // NID comparison (if available in both)
    let nidMatch = true;
    if (submitted.nid_number && extracted.nid_number) {
        const cleanSubNid = submitted.nid_number.replace(/\D/g, "");
        const cleanExtNid = extracted.nid_number.replace(/\D/g, "");
        nidMatch = cleanSubNid === cleanExtNid;
    }
    const matchDetails = {
        nameMatch,
        fatherNameMatch,
        motherNameMatch,
        dobMatch,
        nidMatch,
        documentReadable: true,
    };
    // 5. Check for clear mismatch -> REJECTED
    // A clear mismatch occurs when core identity fields explicitly contradict the document
    if (!nameMatch || !dobMatch || !nidMatch) {
        const mismatches = [];
        if (!nameMatch) {
            mismatches.push(`Name mismatch (submitted: "${submitted.document_name}", document: "${extracted.name}")`);
        }
        if (!dobMatch) {
            mismatches.push(`Date of birth mismatch (submitted: "${subDob}", document: "${extDob}")`);
        }
        if (!nidMatch) {
            mismatches.push("NID number mismatch");
        }
        return {
            status: "REJECTED",
            reason: `Verification rejected due to data mismatch: ${mismatches.join("; ")}.`,
            matchDetails,
            notes: `Rejected automatically: ${mismatches.join(", ")}.`,
        };
    }
    // 6. Check parent name mismatches if provided
    if (!fatherNameMatch || !motherNameMatch) {
        // If name and DOB match, but parent names differ slightly, send to manual review
        return {
            status: "MANUAL_REVIEW",
            reason: "Parent names on document differ from submitted details.",
            matchDetails,
            notes: "Name and DOB matched, but parent details require human confirmation.",
        };
    }
    // 7. All required information matches and document is readable -> VERIFIED
    return {
        status: "VERIFIED",
        reason: null,
        matchDetails,
        notes: "All identity details successfully verified against the official NID document.",
    };
}
export default evaluateVerificationDecision;
