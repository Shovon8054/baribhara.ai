import pool from "./dbConnection.js";
/**
 * Idempotent migration: creates user_verifications and verification_attempts tables
 * if they don't already exist. Safe to call on every server startup.
 *
 * This replaces the standalone createVerificationTables.ts script which required
 * manual execution and was never run on the production (Render) database.
 */
export async function runVerificationMigration() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        // 1. user_verifications table
        await client.query(`
      CREATE TABLE IF NOT EXISTS user_verifications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        document_name VARCHAR(255),
        father_name VARCHAR(255),
        mother_name VARCHAR(255),
        date_of_birth DATE,
        nid_hash VARCHAR(255),
        document_public_id VARCHAR(255),
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING'
          CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED', 'MANUAL_REVIEW')),
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // 2. verification_attempts table
        await client.query(`
      CREATE TABLE IF NOT EXISTS verification_attempts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        verification_id UUID REFERENCES user_verifications(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        document_name VARCHAR(255),
        father_name VARCHAR(255),
        mother_name VARCHAR(255),
        date_of_birth DATE,
        nid_hash VARCHAR(255),
        document_public_id VARCHAR(255),
        status VARCHAR(50) NOT NULL
          CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED', 'MANUAL_REVIEW')),
        rejection_reason TEXT,
        review_notes TEXT,
        reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
        attempt_number INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // 3. Indexes (all use IF NOT EXISTS, safe to repeat)
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_verifications_user_id  ON user_verifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_verifications_status   ON user_verifications(status);
      CREATE INDEX IF NOT EXISTS idx_user_verifications_nid_hash ON user_verifications(nid_hash);

      CREATE INDEX IF NOT EXISTS idx_verification_attempts_verification_id ON verification_attempts(verification_id);
      CREATE INDEX IF NOT EXISTS idx_verification_attempts_user_id         ON verification_attempts(user_id);
      CREATE INDEX IF NOT EXISTS idx_verification_attempts_status          ON verification_attempts(status);
    `);
        // 4. update_updated_at trigger function (create only if it doesn't exist yet)
        //    Some DB setups already have this from db.sql; the DO block makes it safe.
        await client.query(`
      DO $$
      BEGIN
        -- Create the trigger function if it doesn't already exist
        IF NOT EXISTS (
          SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at'
        ) THEN
          CREATE OR REPLACE FUNCTION update_updated_at()
          RETURNS TRIGGER AS $func$
          BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
          END;
          $func$ LANGUAGE plpgsql;
        END IF;

        -- Attach trigger to user_verifications if not already attached
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_verifications_updated_at'
        ) THEN
          CREATE TRIGGER update_user_verifications_updated_at
          BEFORE UPDATE ON user_verifications
          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
        END IF;
      END $$;
    `);
        await client.query("COMMIT");
        console.log("✅ Verification tables migration completed (or already up-to-date).");
    }
    catch (err) {
        await client.query("ROLLBACK");
        // Log but don't crash the server — existing features still work
        console.error("⚠️  Verification tables migration failed (non-fatal):", err);
    }
    finally {
        client.release();
    }
}
