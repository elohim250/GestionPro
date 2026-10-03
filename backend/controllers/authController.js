import User from "../models/User.js";
import jwt from "jsonwebtoken";

// 🔧 Fonction utilitaire : génère un JWT signé
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ==================================================
// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
// ==================================================
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation basique
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs sont requis (name, email, password)",
      });
    }

    // Vérifier si l'email existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "Un utilisateur avec cet email existe déjà",
      });
    }

    // Créer l'utilisateur (le mdp sera hashé automatiquement par le pre-save)
    const user = await User.create({ name, email, password });

    // Réponse avec token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// ==================================================
// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
// ==================================================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation basique
    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe requis",
      });
    }

    // Chercher l'utilisateur par email
    const user = await User.findOne({ email });

    // Vérifier email + mot de passe
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }
  } catch (error) {
    next(error);
  }
};

// ==================================================
// @desc    Récupérer l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Privé (nécessite un JWT)
// ==================================================
export const getMe = async (req, res, next) => {
  try {
    // req.user est injecté par le middleware protect
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};