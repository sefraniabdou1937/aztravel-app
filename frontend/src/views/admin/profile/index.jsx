// Chakra imports
import {
  Box,
  Grid,
  Text,
  useColorModeValue,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
  Icon,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

// Custom components
import Card from "components/card/Card.js";
import { useAuth } from "contexts/AuthContext";
import { MdPerson, MdEmail, MdCheckCircle, MdLock } from "react-icons/md";

export default function ProfileOverview() {
  const { token } = useAuth();
  const toast = useToast();
  
  // Styles
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgIcon = useColorModeValue("gray.100", "whiteAlpha.100");

  // États
  const [userData, setUserData] = useState({ email: "Chargement...", id: null });
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [stats, setStats] = useState({ total: 0, pending: 0 });

  // 1. Charger les infos de l'utilisateur et ses stats
  useEffect(() => {
    if (token) {
      // Récupérer l'utilisateur
      fetch("http://127.0.0.1:8000/api/users/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error(err));

      // Récupérer ses stats
      fetch("http://127.0.0.1:8000/api/tasks/stats", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setStats({ total: data.total_tasks, pending: data.pending_tasks }))
      .catch(err => console.error(err));
    }
  }, [token]);

  // 2. Gérer le changement de mot de passe
  const handleChangePassword = () => {
    // Validation simple
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Erreur",
        description: "Les nouveaux mots de passe ne correspondent pas.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (passwords.new.length < 4) {
        toast({
            title: "Erreur",
            description: "Le mot de passe est trop court.",
            status: "warning",
            duration: 3000,
            isClosable: true,
        });
        return;
    }

    // Appel API
    fetch("http://127.0.0.1:8000/api/users/me/password", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ 
        old_password: passwords.old, 
        new_password: passwords.new 
      }),
    })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Succès",
          description: "Votre mot de passe a été mis à jour.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setPasswords({ old: "", new: "", confirm: "" }); // Reset du formulaire
      } else {
        throw new Error(data.detail || "Erreur lors de la mise à jour");
      }
    })
    .catch(err => {
      toast({
        title: "Erreur",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1.5fr 2fr", // Colonne gauche plus petite, droite plus grande
        }}
        gap={{ base: "20px", xl: "20px" }}>
        
        {/* --- CARTE 1 : INFORMATIONS PROFIL (Gauche) --- */}
        <Card p='20px' align='center'>
            <Flex direction='column' align='center' justify='center' h="100%">
                <Box
                    bg={bgIcon}
                    w='100px'
                    h='100px'
                    borderRadius='50%'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    mb='20px'
                >
                    <Icon as={MdPerson} w='50px' h='50px' color={iconColor} />
                </Box>
                <Text color={textColor} fontSize='2xl' fontWeight='bold'>
                    Mon Profil
                </Text>
                <Text color={textColorSecondary} fontSize='sm' mb='40px'>
                   Membre AZTRAVEL
                </Text>

                {/* Détails Email */}
                <Flex w='100%' direction='column' gap='20px' mb='auto'>
                    <Flex align='center' justify='space-between' p='15px' border='1px solid' borderColor='gray.200' borderRadius='15px'>
                        <Flex align='center'>
                             <Icon as={MdEmail} color={iconColor} mr='10px' w='24px' h='24px'/>
                             <Text fontWeight='700' color={textColor}>Email</Text>
                        </Flex>
                        <Text color={textColorSecondary} fontWeight='500'>{userData.email}</Text>
                    </Flex>

                    {/* Détails Tâches */}
                    <Flex align='center' justify='space-between' p='15px' border='1px solid' borderColor='gray.200' borderRadius='15px'>
                        <Flex align='center'>
                             <Icon as={MdCheckCircle} color='green.500' mr='10px' w='24px' h='24px'/>
                             <Text fontWeight='700' color={textColor}>Tâches Créées</Text>
                        </Flex>
                        <Text color={textColorSecondary} fontWeight='bold' fontSize='lg'>{stats.total}</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Card>

        {/* --- CARTE 2 : SÉCURITÉ (Droite) --- */}
        <Card p='40px'>
            <Flex align='center' mb='20px'>
                <Icon as={MdLock} w='24px' h='24px' color={iconColor} mr='10px' />
                <Text color={textColor} fontSize='xl' fontWeight='bold'>
                    Modifier le mot de passe
                </Text>
            </Flex>
            
            <Flex direction='column' gap='25px'>
                <FormControl>
                    <FormLabel fontWeight='bold' color={textColor}>Ancien Mot de passe</FormLabel>
                    <Input 
                        type="password" 
                        placeholder="Votre mot de passe actuel"
                        borderRadius="15px"
                        size="lg"
                        value={passwords.old}
                        onChange={(e) => setPasswords({...passwords, old: e.target.value})}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel fontWeight='bold' color={textColor}>Nouveau Mot de passe</FormLabel>
                    <Input 
                        type="password" 
                        placeholder="Nouveau mot de passe"
                        borderRadius="15px"
                        size="lg"
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel fontWeight='bold' color={textColor}>Confirmer le Nouveau Mot de passe</FormLabel>
                    <Input 
                        type="password" 
                        placeholder="Répétez le nouveau mot de passe"
                        borderRadius="15px"
                        size="lg"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    />
                </FormControl>
                
                <Button 
                    variant='brand' 
                    mt='20px' 
                    h='50px'
                    fontSize='lg'
                    borderRadius="15px"
                    onClick={handleChangePassword}
                    isDisabled={!passwords.old || !passwords.new}
                >
                    Mettre à jour le mot de passe
                </Button>
            </Flex>
        </Card>

      </Grid>
    </Box>
  );
}