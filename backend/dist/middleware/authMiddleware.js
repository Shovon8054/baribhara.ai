import jwt from "jsonwebtoken";
function parseAuthTokenFromHeader(req) {
    const cookieHeader = req.headers?.cookie;
    if (!cookieHeader)
        return undefined;
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const c of cookies) {
        const [k, v] = c.split("=");
        if (k === "auth_token")
            return v;
    }
    return undefined;
}
export function requireAuth(req, res, next) {
    try {
        const token = parseAuthTokenFromHeader(req);
        if (!token)
            return res.status(401).json({ success: false, message: "Authentication required" });
        const secret = process.env.JWT_SECRET;
        if (!secret)
            return res.status(500).json({ success: false, message: "Server misconfigured" });
        const payload = jwt.verify(token, secret);
        // Attach minimal user info to request
        req.user = {
            id: payload.id,
            email: payload.email,
            role: payload.role,
        };
        return next();
    }
    catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}
export default requireAuth;
