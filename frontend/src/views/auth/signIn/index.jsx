/* eslint-disable */
/*!
=========================================================
* Horizon UI - v1.1.0
=========================================================
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- IMPORTS ---
import { useAuth } from "../../../contexts/AuthContext";
import { getEndpoint } from "../../../config/api";
import DefaultAuth from "../../../layouts/auth/Default";

// Chakra UI
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

// Icons
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

// Illustration
import illustration from "../../../assets/img/auth/AZ.png";

function SignIn() {
  const textColor = useColorModeValue("navy.700", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const { login } = useAuth();
  const navigate = useNavigate();

  // --- STATES ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const togglePassword = () => setShow(!show);

  // ---------------------------------------------------------
  // 🔐 LOGIN
  // ---------------------------------------------------------
  const handleLogin = async () => {
    try {
      setError("");

      if (!email || !password) {
        setError("Veuillez remplir tous les champs.");
        return;
      }

      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(getEndpoint("/api/login"), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Email ou mot de passe incorrect.");
      }

      const data = await response.json();

      login(data.access_token);
      navigate("/admin/default");

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message);
    }
  };

  // ---------------------------------------------------------
  // 🆕 REGISTER
  // ---------------------------------------------------------
  const handleRegister = async () => {
    try {
      setError("");

      if (!email || !password) {
        setError("Veuillez remplir tous les champs.");
        return;
      }

      const response = await fetch(getEndpoint("/api/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Erreur lors de l'inscription.");
      }

      console.log("Inscription réussie");
      await handleLogin(); // auto login

    } catch (err) {
      console.error("Register Error:", err);
      setError(err.message);
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mt={{ base: "40px", md: "14vh" }}
        flexDirection="column"
      >
        <Box mb="20px">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Connexion
          </Heading>
          <Text mb="36px" color="gray.400" fontSize="md">
            Entrez votre email et mot de passe pour vous connecter !
          </Text>
        </Box>

        <Flex w={{ base: "100%", md: "420px" }} flexDirection="column">
          
          {/* ------ ZONE ERREUR ------ */}
          {error && (
            <Box bg="red.50" p={3} border="1px solid" borderColor="red.200" mb={4} borderRadius="md">
              <Text color="red.600" fontWeight="bold" fontSize="sm">
                ⚠️ {error}
              </Text>
            </Box>
          )}

          <FormControl>
            {/* Email */}
            <FormLabel fontSize="sm" fontWeight="500" color={textColor}>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              type="email"
              placeholder="email@example.com"
              variant="auth"
              mb="24px"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            <FormLabel fontSize="sm" fontWeight="500" color={textColor}>
              Mot de passe<Text color={brandStars}>*</Text>
            </FormLabel>

            <InputGroup size="md">
              <Input
                type={show ? "text" : "password"}
                placeholder="Min. 8 caractères"
                variant="auth"
                mb="24px"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputRightElement>
                <Icon
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  color="gray.400"
                  cursor="pointer"
                  onClick={togglePassword}
                />
              </InputRightElement>
            </InputGroup>

            {/* Boutons */}
            <Button
              w="100%"
              mb="20px"
              h="50"
              variant="brand"
              fontWeight="500"
              onClick={handleLogin}
            >
              Se connecter
            </Button>

            <Button
              w="100%"
              h="50"
              variant="outline"
              fontWeight="500"
              onClick={handleRegister}
            >
              S'inscrire
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
