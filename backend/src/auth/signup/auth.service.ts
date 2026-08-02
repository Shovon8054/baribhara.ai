import pool from "../../db/dbConnection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterUser {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}

const authService = {
  async register(user: RegisterUser) {
    const { full_name, email, password, phone = null, role = "TENANT" } = user;
    const normalizedRole = (() => {
      const upperRole = role.toUpperCase();
      const allowedRoles = ["TENANT", "OWNER", "ADMIN"];
      if (!allowedRoles.includes(upperRole)) {
        throw new Error(`Invalid role. Allowed values are: ${allowedRoles.join(", ")}`);
      }
      return upperRole;
    })();

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users(full_name, email, password, phone, role)
      VALUES($1, $2, $3, $4, $5)
      RETURNING id, full_name, email, phone, role
      `,
      [full_name, email, hashedPassword, phone, normalizedRole]
    );

    const newUser = result.rows[0];

    const accessToken = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    return {
      user: newUser,
      accessToken,
    };
  },
};

export default authService;