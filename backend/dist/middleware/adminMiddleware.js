const requireAdmin = (req, res, next) => {
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
