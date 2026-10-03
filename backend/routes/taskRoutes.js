import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Toutes les routes de ce fichier sont protégées par JWT
router.use(protect);

// ==================================================
// Routes principales
// ==================================================
router.route("/").get(getTasks).post(createTask);

// ==================================================
// Routes par ID
// ==================================================
router
  .route("/:id")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

// ==================================================
// Route spéciale : basculer le statut
// ==================================================
router.patch("/:id/toggle", toggleTaskStatus);

export default router;