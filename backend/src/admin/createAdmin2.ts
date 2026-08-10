import bcrypt from "bcryptjs";
import pool from "../db/dbConnection.js";

const createAdmin = async () => {
    try {
        const email = "admin@baribhara.ai";
        const password = "Admin1234";
        const fullName = "BashaBhara Admin";
        const phone = "01700000000";

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const result = await pool.query(
            `
            INSERT INTO users (
                email,
                password,
                full_name,
                phone,
                role,
                is_verified,
                is_active
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                'ADMIN',
                true,
                true
            )
            RETURNING
                id,
                email,
                full_name,
                role,
                is_verified,
                is_active
            `,
            [
                email,
                hashedPassword,
                fullName,
                phone,
            ]
        );

        console.log(
            "Admin created successfully:"
        );

        console.log(result.rows[0]);

    } catch (error) {
        console.error(
            "Failed to create admin:",
            error
        );
    } finally {
        await pool.end();
    }
};

createAdmin();