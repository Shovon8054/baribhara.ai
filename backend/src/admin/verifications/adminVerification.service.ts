import pool from "../../db/dbConnection.js";
import { getSignedVerificationDocUrl } from "../../utils/uploadToCloudinary.js";

export interface AdminReviewDto {
  action?: "APPROVE" | "REJECT";
  status?: "VERIFIED" | "REJECTED" | "MANUAL_REVIEW";
  reason?: string | null;
  review_notes?: string | null;
}

export class AdminVerificationService {
  /**
   * Helper to parse AI extraction details from stored review_notes.
   */
  private parseAiExtraction(rawNotes?: string | null) {
    if (!rawNotes) return null;
    try {
      const parsed = JSON.parse(rawNotes);
      return parsed.aiExtraction || parsed;
    } catch {
      return { notes: rawNotes };
    }
  }

  /**
   * List verifications, optionally filtered by status (e.g. MANUAL_REVIEW).
   */
  async getVerifications(filters?: { status?: string }) {
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
        u.role,
        a.rejection_reason AS latest_reason,
        a.review_notes AS latest_notes,
        a.attempt_number AS latest_attempt_number,
        a.created_at AS latest_attempt_date
      FROM user_verifications v
      JOIN users u ON u.id = v.user_id
      LEFT JOIN LATERAL (
        SELECT rejection_reason, review_notes, attempt_number, created_at
        FROM verification_attempts
        WHERE verification_id = v.id
        ORDER BY created_at DESC
        LIMIT 1
      ) a ON true
    `;

    const params: any[] = [];
    if (filters?.status) {
      params.push(filters.status.toUpperCase());
      query += ` WHERE v.status = $1`;
    }

    query += ` ORDER BY v.updated_at DESC`;

    const res = await pool.query(query, params);

    return res.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      user: {
        id: row.user_id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        role: row.role,
      },
      submittedData: {
        documentName: row.document_name,
        fatherName: row.father_name,
        motherName: row.mother_name,
        dateOfBirth: row.date_of_birth,
      },
      status: row.status,
      reviewReason: row.latest_reason,
      aiExtraction: this.parseAiExtraction(row.latest_notes),
      // Secure temporary signed URL for admin viewing only (expires in 1 hour)
      documentUrl: row.document_public_id
        ? getSignedVerificationDocUrl(row.document_public_id, 3600)
        : null,
      attemptNumber: row.latest_attempt_number || 1,
      verifiedAt: row.verified_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  /**
   * Get single verification submission details by ID.
   */
  async getVerificationById(id: string) {
    const query = `
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
        u.role,
        u.is_verified AS user_is_verified
      FROM user_verifications v
      JOIN users u ON u.id = v.user_id
      WHERE v.id = $1
    `;

    const res = await pool.query(query, [id]);
    if (res.rows.length === 0) {
      return null;
    }

    const row = res.rows[0];

    // Fetch full history of verification attempts
    const historyRes = await pool.query(
      `SELECT 
         id,
         verification_id,
         user_id,
         document_name,
         father_name,
         mother_name,
         date_of_birth,
         status,
         rejection_reason,
         review_notes,
         reviewed_by,
         attempt_number,
         created_at
       FROM verification_attempts
       WHERE verification_id = $1
       ORDER BY created_at DESC`,
      [id]
    );

    const history = historyRes.rows.map((att) => ({
      id: att.id,
      status: att.status,
      rejectionReason: att.rejection_reason,
      reviewNotes: this.parseAiExtraction(att.review_notes),
      reviewedBy: att.reviewed_by,
      attemptNumber: att.attempt_number,
      createdAt: att.created_at,
    }));

    const latestAttempt = history[0] || null;

    return {
      id: row.id,
      userId: row.user_id,
      user: {
        id: row.user_id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        role: row.role,
        isVerified: row.user_is_verified,
      },
      submittedData: {
        documentName: row.document_name,
        fatherName: row.father_name,
        motherName: row.mother_name,
        dateOfBirth: row.date_of_birth,
      },
      status: row.status,
      verifiedAt: row.verified_at,
      latestReason: latestAttempt?.rejectionReason || null,
      aiExtraction: latestAttempt?.reviewNotes || null,
      documentUrl: row.document_public_id
        ? getSignedVerificationDocUrl(row.document_public_id, 3600)
        : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      history,
    };
  }

  /**
   * Admin approves or rejects a verification submission.
   */
  async reviewVerification(
    id: string,
    adminId: string,
    dto: AdminReviewDto
  ) {
    // Normalize target status
    let finalStatus: "VERIFIED" | "REJECTED";
    if (dto.action === "APPROVE" || dto.status === "VERIFIED") {
      finalStatus = "VERIFIED";
    } else if (dto.action === "REJECT" || dto.status === "REJECTED") {
      finalStatus = "REJECTED";
    } else {
      throw new Error("Invalid review action. Must be 'APPROVE' or 'REJECT'.");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Verify record exists
      const checkRes = await client.query(
        `SELECT * FROM user_verifications WHERE id = $1`,
        [id]
      );
      if (checkRes.rows.length === 0) {
        throw new Error("Verification record not found");
      }

      const current = checkRes.rows[0];
      const verifiedAt = finalStatus === "VERIFIED" ? new Date() : null;

      // Update user_verifications
      const updateQuery = `
        UPDATE user_verifications
        SET
          status = $1,
          verified_at = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *;
      `;
      const updateRes = await client.query(updateQuery, [
        finalStatus,
        verifiedAt,
        id,
      ]);
      const updated = updateRes.rows[0];

      // Update users table is_verified status
      const isUserVerified = finalStatus === "VERIFIED";
      await client.query(
        `UPDATE users SET is_verified = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [isUserVerified, current.user_id]
      );

      // Increment attempt count for record keeping
      const countRes = await client.query(
        `SELECT COUNT(*) FROM verification_attempts WHERE verification_id = $1`,
        [id]
      );
      const nextAttemptNumber = parseInt(countRes.rows[0].count, 10) + 1;

      // Insert audit history in verification_attempts
      const notes =
        dto.review_notes ||
        (finalStatus === "VERIFIED"
          ? "Approved manually by administrator."
          : `Rejected manually by administrator. Reason: ${dto.reason || "Not specified"}`);

      await client.query(
        `INSERT INTO verification_attempts (
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP)`,
        [
          id,
          current.user_id,
          current.document_name,
          current.father_name,
          current.mother_name,
          current.date_of_birth,
          current.nid_hash,
          current.document_public_id,
          finalStatus,
          dto.reason || null,
          notes,
          adminId,
          nextAttemptNumber,
        ]
      );

      await client.query("COMMIT");

      return {
        id: updated.id,
        userId: updated.user_id,
        status: updated.status,
        verifiedAt: updated.verified_at,
        updatedAt: updated.updated_at,
        reviewedBy: adminId,
        decision: finalStatus,
        reason: dto.reason || null,
      };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

export const adminVerificationService = new AdminVerificationService();
export default adminVerificationService;
