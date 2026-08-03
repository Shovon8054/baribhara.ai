import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function parseAuthTokenFromHeader(req: Request): string | undefined {
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const c of cookies) {
    const [k, v] = c.split("=");
    if (k === "auth_token") return v;
  }

  return undefined;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = parseAuthTokenFromHeader(req);
    if (!token) return res.status(401).json({ success: false, message: "Authentication required" });

    const secret = process.env.JWT_SECRET as string;
    if (!secret) return res.status(500).json({ success: false, message: "Server misconfigured" });

    const payload = jwt.verify(token, secret) as Record<string, unknown>;

    // Attach minimal user info to request
    (req as any).user = {
      id: (payload as any).id,
      email: (payload as any).email,
      role: (payload as any).role,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export default requireAuth;
