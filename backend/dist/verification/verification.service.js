import crypto from "crypto";
import pool from "../db/dbConnection.js";
import { uploadNidPdfToCloudinary, getSignedVerificationDocUrl, deleteFromCloudinary, } from "../utils/uploadToCloudinary.js";
import { extractNidWithGemini } from "./verification.ai.js";
import { evaluateVerificationDecision } from "./verification.decision.js";
export class VerificationService {
    /**
     * Hashes NID number to ensure privacy and unique indexing.
     */
    hashNid(nid) {
        return crypto.createHash("sha256").update(nid.trim()).digest("hex");
    }
    /**
     * Get current verification record for a user along with their attempts.
     * Does NOT expose private Cloudinary public_ids or NID hashes.
     */
    async getVerificationStatus(userId) {
        const verificationQuery = `
      SELECT 
        v.id,
        v.user_id,
        v.document_name,
        v.father_name,
        v.mother_name,
        v.date_of_birth,
        v.status,
        v.verified_at,
        v.created_at,
        v.updated_at,
        u.email,
        u.full_name,
        u.is_verified AS user_is_verified
      FROM users u
      LEFT JOIN user_verifications v ON v.user_id = u.id
      WHERE u.id = $1
    `;
        const res = await pool.query(verificationQuery, [userId]);
        if (res.rows.length === 0) {
            return null;
        }
        const row = res.rows[0];
        const attemptsRes = await pool.query(`SELECT id, status, rejection_reason, attempt_number, created_at 
       FROM verification_attempts 
       WHERE user_id = $1 
       ORDER BY created_at DESC`, [userId]);
        return {
            user: {
                id: row.user_id || userId,
                email: row.email,
                fullName: row.full_name,
                isVerified: row.user_is_verified,
            },
            verification: row.id
                ? {
                    id: row.id,
                    documentName: row.document_name,
                    fatherName: row.father_name,
                    motherName: row.mother_name,
                    dateOfBirth: row.date_of_birth,
                    status: row.status,
                    verifiedAt: row.verified_at,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at,
                }
                : null,
            history: attemptsRes.rows,
        };
    }
    /**
     * Submit or re-submit a verification request.
     * Uploads NID PDF to private Cloudinary storage under baribhara/identity-verification.
     * If upload fails, no database record is created.
     */
    async submitVerification(userId, data, file) {
        // 1. Validate file presence
        if (!file) {
            throw new Error("NID PDF document is required.");
        }
        // 2. Validate that uploaded file is a PDF
        if (file.mimetype !== "application/pdf") {
            throw new Error("Invalid document format. The NID document must be an uploaded PDF file.");
        }
        // 3. Upload NID PDF to Cloudinary with private/authenticated access mode
        let documentPublicId;
        try {
            const uploadResult = await uploadNidPdfToCloudinary(file.buffer, "baribhara/identity-verification");
            documentPublicId = uploadResult.public_id;
        }
        catch (uploadError) {
            console.error("Cloudinary NID PDF upload error:", uploadError);
            throw new Error(`Cloudinary upload failed: ${uploadError.message || "Failed to store NID document"}`);
        }
        // 4. Extract structured text using Google Gemini (strictly as OCR/document reader)
        const extractedData = await extractNidWithGemini(file.buffer, file.mimetype);
        // 5. Save to database transaction
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            // Compute NID hash if NID number is provided or extracted by Gemini
            let computedNidHash = data.nid_hash || null;
            if (data.nid_number) {
                computedNidHash = this.hashNid(data.nid_number);
            }
            else if (extractedData.nid_number) {
                computedNidHash = this.hashNid(extractedData.nid_number);
            }
            // Check for duplicate NID hash across other verified users
            let isDuplicateNid = false;
            if (computedNidHash) {
                const duplicateCheck = await client.query(`SELECT user_id FROM user_verifications 
           WHERE nid_hash = $1 AND user_id != $2 AND status = 'VERIFIED'
           LIMIT 1`, [computedNidHash, userId]);
                if (duplicateCheck.rows.length > 0) {
                    isDuplicateNid = true;
                }
            }
            // Execute backend verification decision logic
            const decision = evaluateVerificationDecision(data, extractedData, isDuplicateNid);
            // Count past attempts
            const countRes = await client.query(`SELECT COUNT(*) FROM verification_attempts WHERE user_id = $1`, [userId]);
            const attemptNumber = parseInt(countRes.rows[0].count, 10) + 1;
            // Upsert into user_verifications with decided status
            const verifiedAt = decision.status === "VERIFIED" ? new Date() : null;
            const upsertQuery = `
        INSERT INTO user_verifications (
          user_id,
          document_name,
          father_name,
          mother_name,
          date_of_birth,
          nid_hash,
          document_public_id,
          status,
          verified_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id) DO UPDATE SET
          document_name = EXCLUDED.document_name,
          father_name = EXCLUDED.father_name,
          mother_name = EXCLUDED.mother_name,
          date_of_birth = EXCLUDED.date_of_birth,
          nid_hash = COALESCE(EXCLUDED.nid_hash, user_verifications.nid_hash),
          document_public_id = EXCLUDED.document_public_id,
          status = EXCLUDED.status,
          verified_at = EXCLUDED.verified_at,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, user_id, document_name, father_name, mother_name, date_of_birth, status, verified_at, created_at, updated_at;
      `;
            const verificationRes = await client.query(upsertQuery, [
                userId,
                data.document_name,
                data.father_name,
                data.mother_name,
                data.date_of_birth,
                computedNidHash,
                documentPublicId,
                decision.status,
                verifiedAt,
            ]);
            const verification = verificationRes.rows[0];
            // Update user is_verified flag based on decided status
            if (decision.status === "VERIFIED") {
                await client.query(`UPDATE users SET is_verified = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [userId]);
            }
            else if (decision.status === "REJECTED") {
                await client.query(`UPDATE users SET is_verified = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [userId]);
            }
            // Prepare comprehensive audit summary for review history
            const auditNotes = JSON.stringify({
                notes: decision.notes,
                matchDetails: decision.matchDetails,
                aiExtraction: {
                    name: extractedData.name,
                    father_name: extractedData.father_name,
                    mother_name: extractedData.mother_name,
                    date_of_birth: extractedData.date_of_birth,
                    nid_number: extractedData.nid_number,
                    documentReadable: extractedData.documentReadable,
                    extractionNotes: extractedData.extractionNotes,
                },
            });
            // Insert record into verification_attempts for history keeping
            const attemptQuery = `
        INSERT INTO verification_attempts (
          verification_id,
          user_id,
          document_name,
          father_name,
          mother_name,
          date_of_birth,
          nid_hash,
          document_public_id,
          status,
          rejection_reason,
          review_notes,
          attempt_number,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
        RETURNING id, verification_id, status, rejection_reason, review_notes, attempt_number, created_at;
      `;
            const attemptRes = await client.query(attemptQuery, [
                verification.id,
                userId,
                verification.document_name,
                verification.father_name,
                verification.mother_name,
                verification.date_of_birth,
                computedNidHash,
                documentPublicId,
                decision.status,
                decision.reason,
                auditNotes,
                attemptNumber,
            ]);
            await client.query("COMMIT");
            return {
                verification: {
                    id: verification.id,
                    userId: verification.user_id,
                    documentName: verification.document_name,
                    fatherName: verification.father_name,
                    motherName: verification.mother_name,
                    dateOfBirth: verification.date_of_birth,
                    status: verification.status,
                    verifiedAt: verification.verified_at,
                    createdAt: verification.created_at,
                    updatedAt: verification.updated_at,
                },
                attempt: attemptRes.rows[0],
                decision,
                extractedData,
            };
        }
        catch (dbErr) {
            await client.query("ROLLBACK");
            // Clean up orphaned uploaded file from Cloudinary if DB save failed
            await deleteFromCloudinary(documentPublicId, "authenticated").catch(() => { });
            throw dbErr;
        }
        finally {
            client.release();
        }
    }
    /**
     * Get user's verification attempt history.
     */
    async getVerificationHistory(userId) {
        const res = await pool.query(`SELECT id, verification_id, status, rejection_reason, attempt_number, created_at 
       FROM verification_attempts 
       WHERE user_id = $1 
       ORDER BY created_at DESC`, [userId]);
        return res.rows;
    }
    /**
     * Admin reviews verification submission.
     */
    async reviewVerification(verificationId, adminId, input) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            // Find current verification record
            const checkRes = await client.query(`SELECT * FROM user_verifications WHERE id = $1`, [verificationId]);
            if (checkRes.rows.length === 0) {
                throw new Error("Verification record not found");
            }
            const current = checkRes.rows[0];
            const isVerified = input.status === "VERIFIED";
            // Update user_verifications
            const updateQuery = `
        UPDATE user_verifications
        SET
          status = $1,
          verified_at = CASE WHEN $1 = 'VERIFIED' THEN CURRENT_TIMESTAMP ELSE NULL END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, user_id, document_name, father_name, mother_name, date_of_birth, status, verified_at, updated_at;
      `;
            const updateRes = await client.query(updateQuery, [input.status, verificationId]);
            const updatedVerification = updateRes.rows[0];
            // Update user table is_verified status
            await client.query(`UPDATE users SET is_verified = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [isVerified, current.user_id]);
            // Create new review history record in verification_attempts
            const countRes = await client.query(`SELECT COUNT(*) FROM verification_attempts WHERE verification_id = $1`, [verificationId]);
            const nextAttemptNumber = parseInt(countRes.rows[0].count, 10) + 1;
            await client.query(`INSERT INTO verification_attempts (
          verification_id,
          user_id,
          document_name,
          father_name,
          mother_name,
          date_of_birth,
          nid_hash,
          document_public_id,
          status,
          rejection_reason,
          review_notes,
          reviewed_by,
          attempt_number,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP)`, [
                verificationId,
                current.user_id,
                current.document_name,
                current.father_name,
                current.mother_name,
                current.date_of_birth,
                current.nid_hash,
                current.document_public_id,
                input.status,
                input.rejection_reason || null,
                input.review_notes || null,
                adminId,
                nextAttemptNumber,
            ]);
            await client.query("COMMIT");
            return updatedVerification;
        }
        catch (err) {
            await client.query("ROLLBACK");
            throw err;
        }
        finally {
            client.release();
        }
    }
    /**
     * Admin lists all verification requests with secure temporary signed document URLs.
     */
    async getAllVerifications(filters) {
        let query = `
      SELECT 
        v.id,
        v.user_id,
        v.document_name,
        v.father_name,
        v.mother_name,
        v.date_of_birth,
        v.document_public_id,
        v.status,
        v.verified_at,
        v.created_at,
        v.updated_at,
        u.email,
        u.full_name,
        u.phone,
        u.role
      FROM user_verifications v
      JOIN users u ON u.id = v.user_id
    `;
        const params = [];
        if (filters?.status) {
            params.push(filters.status);
            query += ` WHERE v.status = $1`;
        }
        query += ` ORDER BY v.updated_at DESC`;
        const res = await pool.query(query, params);
        // Attach signed temporary URLs for admin review
        return res.rows.map((row) => ({
            ...row,
            document_url: row.document_public_id
                ? getSignedVerificationDocUrl(row.document_public_id, 3600) // 1-hour secure signed link
                : null,
        }));
    }
}
export const verificationService = new VerificationService();
export default verificationService;
