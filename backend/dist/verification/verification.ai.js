import { GoogleGenAI } from "@google/genai";
/**
 * Extracts structured text information from an NID PDF using Google Gemini.
 *
 * NOTE:
 * - Gemini acts strictly as an OCR/document reader.
 * - Gemini DOES NOT determine verification status (VERIFIED/REJECTED).
 * - All missing or unclear fields safely default to null.
 */
export async function extractNidWithGemini(fileBuffer, mimeType = "application/pdf") {
    const apiKey = process.env.GEMINI_API_KEY;
    // Safe fallback if API key is not configured in environment
    if (!apiKey) {
        console.warn("[VerificationAI] GEMINI_API_KEY is not set. Skipping AI extraction; manual review required.");
        return {
            name: null,
            father_name: null,
            mother_name: null,
            date_of_birth: null,
            nid_number: null,
            documentReadable: true,
            extractionNotes: "AI extraction bypassed: GEMINI_API_KEY is not configured in backend environment.",
        };
    }
    const prompt = `You are a specialized document reader.
Your task is to inspect the provided National ID (NID) document (PDF or image) and extract the text visible on it into a strictly structured JSON format.

CRITICAL INSTRUCTIONS:
1. Extract ONLY what is visible on the document.
2. DO NOT decide or evaluate whether the user is verified. Your role is purely text extraction.
3. If a field is missing, obscured, blurry, or not found, set its value to null.
4. "name": The person's full name as written on the NID (in English or transliterated).
5. "father_name": Father's name if present, otherwise null.
6. "mother_name": Mother's name if present, otherwise null.
7. "date_of_birth": Date of birth in YYYY-MM-DD format if clearly legible, otherwise null.
8. "nid_number": The National ID number or Smart Card number (numeric string), otherwise null.
9. "documentReadable": true if the document appears to be an authentic, legible ID document; false if completely blurry, blank, unreadable, or not an identity document.
10. "extractionNotes": Any brief observation (e.g. "Bengali text", "DOB clear", "Watermark present").

Return ONLY valid JSON matching this schema:
{
  "name": string | null,
  "father_name": string | null,
  "mother_name": string | null,
  "date_of_birth": string | null,
  "nid_number": string | null,
  "documentReadable": boolean,
  "extractionNotes": string | null
}`;
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            inlineData: {
                                mimeType,
                                data: fileBuffer.toString("base64"),
                            },
                        },
                        {
                            text: prompt,
                        },
                    ],
                },
            ],
            config: {
                responseMimeType: "application/json",
            },
        });
        const rawText = response.text?.trim() || "";
        if (!rawText) {
            throw new Error("Gemini returned an empty response.");
        }
        // Parse structured JSON
        const parsed = JSON.parse(rawText);
        return {
            name: typeof parsed.name === "string" ? parsed.name.trim() : null,
            father_name: typeof parsed.father_name === "string" ? parsed.father_name.trim() : null,
            mother_name: typeof parsed.mother_name === "string" ? parsed.mother_name.trim() : null,
            date_of_birth: typeof parsed.date_of_birth === "string"
                ? parsed.date_of_birth.trim()
                : null,
            nid_number: typeof parsed.nid_number === "string" ? parsed.nid_number.trim() : null,
            documentReadable: typeof parsed.documentReadable === "boolean"
                ? parsed.documentReadable
                : true,
            extractionNotes: typeof parsed.extractionNotes === "string"
                ? parsed.extractionNotes.trim()
                : undefined,
        };
    }
    catch (error) {
        console.error("[VerificationAI] Error extracting NID with Gemini:", error.message);
        // Graceful error handling: do not crash verification flow
        return {
            name: null,
            father_name: null,
            mother_name: null,
            date_of_birth: null,
            nid_number: null,
            documentReadable: false,
            extractionNotes: `AI reading failed or was unavailable: ${error.message || "Unknown error"}`,
        };
    }
}
export default extractNidWithGemini;
