import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// --- NOUVEAU: On importe le "cerveau" ---
import { useAuth } from "contexts/AuthContext";

// --- On importe les 2 mises en page (Layouts) ---
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";

export default function App() {
  // 1. On demande au "cerveau" si on a un token
  const { token } = useAuth();

  return (
    <Routes>
      {/* 2. Si on a un token... */}
      {token ? (
        <>
          {/* Route pour le dashboard principal */}
          <Route path="/admin/*" element={<AdminLayout />} />
          
          {/* Si on est connecté et qu'on essaie d'aller sur "/",
              on redirige vers le dashboard */}
          <Route path="/*" element={<Navigate to="/admin/default" replace />} />
        </>
      ) : (
        <>
          {/* 3. Si on n'a PAS de token... */}
          
          {/* Route pour la page de connexion */}
          <Route path="/auth/*" element={<AuthLayout />} />
          
          {/* Si on n'est pas connecté, TOUTES les autres URL
              (comme "/" ou "/admin") redirigent vers la page de connexion */}
          <Route path="/*" element={<Navigate to="/auth/sign-in" replace />} />
        </>
      )}
    </Routes>
  );
}