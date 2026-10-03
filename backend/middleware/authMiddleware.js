import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ==================================================
// @desc    Middleware de protection des routes privées
//          Vérifie la présence et la validité du JWT
// @access  Interne
// ==================================================
export const protect = async (req, res, next) => {
  let token;

  // Vérifier si le header Authorization contient "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extraire le token : "Bearer abc.def.ghi" → "abc.def.ghi"
      token = req.headers.authorization.split(" ")[1];

      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer le user SANS son mot de passe et l'attacher à req.user
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "Utilisateur introuvable, token invalide",
        });
      }

      next(); // Continuer vers le contrôleur
    } catch (error) {
      console.error("❌ Erreur d'authentification :", error.message);
      return res.status(401).json({
        message: "Non autorisé, token invalide ou expiré",
      });
    }
  } else {
    return res.status(401).json({
      message: "Non autorisé, aucun token fourni",
    });
  }
};