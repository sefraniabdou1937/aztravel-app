import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Crée le "Contexte" (la boîte)
const AuthContext = createContext();

// 2. Crée le "Fournisseur" (le composant qui gère la boîte)
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // 3. Au premier chargement, on vérifie si un token est déjà
  //    dans la mémoire "long terme" du navigateur (localStorage)
  useEffect(() => {
    const storedToken = localStorage.getItem("travel_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // 4. Fonction de Login
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("travel_token", newToken); // On sauvegarde
  };

  // 5. Fonction de Logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem("travel_token"); // On efface
  };

  // 6. On partage le token et les fonctions avec toute l'application
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 7. Crée un "raccourci" (hook) pour utiliser ce contexte facilement
export const useAuth = () => {
  return useContext(AuthContext);
};