import pool from './dbConnection.js';
async function migrate() {
    const client = await pool.connect();
    try {
        console.log('--- Connected to DB for verification tables migration ---');
        await client.query('BEGIN');
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
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED', 'MANUAL_REVIEW')),
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ user_verifications table created/verified');
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
        status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED', 'MANUAL_REVIEW')),
        rejection_reason TEXT,
        review_notes TEXT,
        reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
        attempt_number INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ verification_attempts table created/verified');
        // 3. Indexes
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_user_verifications_user_id ON user_verifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_verifications_status ON user_verifications(status);
      CREATE INDEX IF NOT EXISTS idx_user_verifications_nid_hash ON user_verifications(nid_hash);

      CREATE INDEX IF NOT EXISTS idx_verification_attempts_verification_id ON verification_attempts(verification_id);
      CREATE INDEX IF NOT EXISTS idx_verification_attempts_user_id ON verification_attempts(user_id);
      CREATE INDEX IF NOT EXISTS idx_verification_attempts_status ON verification_attempts(status);
    `);
        console.log('✅ Indexes created');
        // 4. Trigger for update_updated_at
        await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_verifications_updated_at'
        ) THEN
          CREATE TRIGGER update_user_verifications_updated_at
          BEFORE UPDATE ON user_verifications
          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
        END IF;
      END $$;
    `);
        console.log('✅ Trigger created');
        await client.query('COMMIT');
        console.log('🎉 Verification tables migration completed successfully!');
        const res = await client.query(`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name IN ('user_verifications', 'verification_attempts')
      ORDER BY table_name, ordinal_position;
    `);
        console.table(res.rows);
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
    finally {
        client.release();
        await pool.end();
    }
}
migrate();
