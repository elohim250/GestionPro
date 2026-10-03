import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==================================================
// Routes publiques
// ==================================================
router.post("/register", register);
router.post("/login", login);

// ==================================================
// Routes privées (nécessitent un JWT valide)
// ==================================================
router.get("/me", protect, getMe);

export default router;