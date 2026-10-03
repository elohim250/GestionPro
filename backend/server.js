import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// ==================================================
// Chargement de la configuration
// ==================================================
dotenv.config();

// Connexion à MongoDB
connectDB();

// ==================================================
// Initialisation Express
// ==================================================
const app = express();

// ==================================================
// Configuration CORS robuste
// Accepte : Vite dev (:5173), Vite preview (:4173),
// CRA (:3000) et l'URL de production (FRONTEND_URL)
// ==================================================
const allowedOrigins = [
  "http://localhost:5173", // Vite dev
  "http://localhost:4173", // Vite preview
  "http://localhost:3000", // Autres
  process.env.FRONTEND_URL, // URL de prod (Vercel, etc.)
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (Postman, curl, mobile)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`⚠️ CORS bloqué pour : ${origin}`);
      return callback(new Error(`Origine non autorisée par CORS : ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ==================================================
// Middlewares globaux
// ==================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================================================
// Routes
// ==================================================

// Route racine
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API GestionPro opérationnelle",
    version: "1.0.0",
    status: "OK",
    environment: process.env.NODE_ENV || "development",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Routes d'authentification
app.use("/api/auth", authRoutes);

// Routes des tâches
app.use("/api/tasks", taskRoutes);

// ==================================================
// Middlewares d'erreurs (TOUJOURS EN DERNIER)
// ==================================================
app.use(notFound);
app.use(errorHandler);

// ==================================================
// Démarrage du serveur
// ==================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur GestionPro démarré sur le port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`🔧 Environnement : ${process.env.NODE_ENV || "development"}`);
  console.log(`🛡️  CORS autorisés : ${allowedOrigins.join(", ")}`);
});