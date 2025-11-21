import React from "react";
// --- NOUVEAU : On importe createRoot ---
import { createRoot } from "react-dom/client"; 
import "assets/css/App.css";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";

// On importe le "cerveau"
import { AuthProvider } from "contexts/AuthContext"; 

import App from "App.js"; // Ton composant App principal

// 1. Trouve l'endroit où "accrocher" l'application
const container = document.getElementById("root");

// 2. Crée la "racine" React
const root = createRoot(container); 

// 3. "Rends" (affiche) ton application à l'intérieur de la racine
root.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>
  </ChakraProvider>
);