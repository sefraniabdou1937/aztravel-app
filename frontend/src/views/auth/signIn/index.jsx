/* eslint-disable */
/*!
=========================================================
* Horizon UI - v1.1.0
=========================================================
* (Le copyright reste le même)
*/

import React, { useCallback } from "react"; // <-- MODIFIÉ// --- On importe le "cerveau" et le "navigateur" ---
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import DefaultAuth from "layouts/auth/Default";

// --- Imports des Icônes (CORRIGÉ) ---
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
// ------------------------------------

// Assets
import illustration from "assets/img/auth/AZ.png"; // <-- Ton image

function SignIn() {
  // Chakra Color Mode
  const textColor = useColorModeValue("navy.700", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  
  // --- NOUVELLE LOGIQUE (START) ---
  
  // Le "cerveau" et le "navigateur"
  const { login } = useAuth(); // On récupère la fonction login
  const navigate = useNavigate(); // Pour rediriger après le login

  // États pour les champs du formulaire
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(""); // Pour afficher les erreurs

  // État pour voir/cacher le mot de passe
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  // Fonction de CONNEXION (Login)
  const handleLogin = () => {
    // 1. Préparer les données au format "Form data" (exigé par notre API)
    const formData = new URLSearchParams();
    formData.append("username", email); // (Rappelle-toi, FastAPI attend "username")
    formData.append("password", password);

    // 2. Appeler l'API /api/login
    fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Email ou mot de passe incorrect");
        }
        return response.json();
      })
      .then((data) => {
        // 3. SUCCÈS ! On sauvegarde le token dans le "cerveau"
        login(data.access_token);
        // 4. On redirige vers le dashboard
        navigate("/admin/default");
      })
      .catch((err) => {
        setError(err.message); // Affiche l'erreur
      });
  };

  // Fonction d'INSCRIPTION (Register)
  const handleRegister = () => {
    // 1. Préparer les données au format JSON
    const body = JSON.stringify({ email, password });

    // 2. Appeler l'API /api/register
    fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'inscription. L'email existe peut-être déjà.");
        }
        return response.json();
      })
      .then((data) => {
        // 3. SUCCÈS ! On connecte l'utilisateur directement
        handleLogin();
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  // --- NOUVELLE LOGIQUE (END) ---

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Connexion
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color='gray.400'
            fontWeight='400'
            fontSize='md'>
            Entrez votre email et mot de passe pour vous connecter !
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          
          {/* AFFICHER L'ERREUR */}
          {error && (
            <Text color='red.500' mb='10px' fontWeight='bold'>
              {error}
            </Text>
          )}

          <FormControl>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='email'
              placeholder='mail@simmmple.com'
              mb='24px'
              fontWeight='500'
              size='lg'
              value={email} // <-- Connecté à l'état
              onChange={(e) => setEmail(e.target.value)} // <-- Connecté à l'état
            />
            <FormLabel
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              display='flex'>
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size='md'>
              <Input
                isRequired={true}
                fontSize='sm'
                placeholder='Min. 8 characters'
                mb='24px'
                size='lg'
                type={show ? "text" : "password"}
                variant='auth'
                value={password} // <-- Connecté à l'état
                onChange={(e) => setPassword(e.target.value)} // <-- Connecté à l'état
              />
              <InputRightElement display='flex' alignItems='center' mt='4px'>
                <Icon
                  color='gray.400'
                  _hover={{ cursor: "pointer" }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            
            <Button
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'
              onClick={handleLogin} // <-- Connecté à la fonction
            >
              Se Connecter
            </Button>
            <Button
              fontSize='sm'
              variant='outline'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'
              onClick={handleRegister} // <-- Connecté à la fonction
            >
              S'inscrire (Nouveau compte)
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;