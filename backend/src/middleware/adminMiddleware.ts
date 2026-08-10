import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    console.log("Authenticated user:", req.user);

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });
    }

    next();
};
export default requireAdmin;