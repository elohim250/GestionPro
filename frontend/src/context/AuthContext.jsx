import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

// ==================================================
// Création du contexte
// ==================================================
const AuthContext = createContext(null);

// ==================================================
// Hook personnalisé pour utiliser le contexte
// ==================================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};

// ==================================================
// Provider : englobe toute l'app
// ==================================================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au montage : récupérer le user depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("gestionpro_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("gestionpro_user");
      }
    }
    setLoading(false);
  }, []);

  // ----------------------------------------
  // Inscription
  // ----------------------------------------
  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("gestionpro_user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  // ----------------------------------------
  // Connexion
  // ----------------------------------------
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("gestionpro_user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  // ----------------------------------------
  // Déconnexion
  // ----------------------------------------
  const logout = () => {
    localStorage.removeItem("gestionpro_user");
    setUser(null);
  };

  // ----------------------------------------
  // Valeur exposée par le contexte
  // ----------------------------------------
  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};