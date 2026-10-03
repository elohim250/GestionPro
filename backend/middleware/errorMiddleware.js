// ==================================================
// @desc    Middleware pour les routes non trouvées (404)
// ==================================================
export const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// ==================================================
// @desc    Middleware de gestion centralisée des erreurs
// ==================================================
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Cas spécial : CastError Mongoose (ID invalide)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Ressource introuvable (ID invalide)";
  }

  // Cas spécial : Duplicate key Mongoose (ex: email unique)
  if (err.code === 11000) {
    statusCode = 400;
    message = "Doublon détecté : cette valeur existe déjà";
  }

  res.status(statusCode).json({
    message,
    // Stack trace uniquement en développement
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};