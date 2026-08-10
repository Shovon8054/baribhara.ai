import { Router } from "express";

import adminPropertyController
    from "./adminProperty.controller.js";

import requireAuth
    from "../../middleware/authMiddleware.js";

import requireAdmin
    from "../../middleware/adminMiddleware.js";

const router = Router();


// Authentication
router.use(requireAuth);

// Admin authorization
router.use(requireAdmin);


// GET /api/admin/properties
router.get(
    "/",
    adminPropertyController.getAllProperties
);


// DELETE /api/admin/properties/:id
router.delete(
    "/:id",
    adminPropertyController.deleteProperty
);


export default router;