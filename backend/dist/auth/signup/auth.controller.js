import authService from "./auth.service.js";
const authController = {
    async register(req, res) {
        try {
            const { name, email, password, phone, role } = req.body;
            const result = await authService.register({
                full_name: name,
                email,
                password,
                phone,
                role,
            });
            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: result,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            res.status(400).json({
                success: false,
                message,
            });
        }
    },
};
export default authController;
