import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  Input,
  Button,
  useColorModeValue,
  Spinner, // <-- NOUVEAU: Import du Spinner
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import { MdChatBubbleOutline, MdSend } from "react-icons/md"; // <-- NOUVEAU: Icônes de Chat

// On garde le nom "CheckTable" mais il accepte les nouvelles props de chat
export default function CheckTable({ chatHistory, onSend, selectedCity }) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null); // Pour le défilement automatique

  // Styles
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const modelBg = useColorModeValue("gray.100", "navy.700"); // Fond pour l'IA
  const brandColor = useColorModeValue("brand.500", "white");
  const borderColor = useColorModeValue("gray.200", "navy.700");

  // Défilement automatique vers le bas à chaque nouveau message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [chatHistory]);

  const handleSend = () => {
    if (inputText.trim() === "") return;
    onSend(inputText);
    setInputText("");
  };

  return (
    <Card
      direction='column'
      w='100%'
      h='100%' // Fait en sorte que la carte prenne toute la hauteur de la grille
      px='0px'
      overflow='hidden' // Cache tout ce qui dépasse
      pb='0' // Pas de padding en bas
    >
      {/* --- TITRE --- */}
      <Flex px='25px' justify='space-between' mb='10px' align='center'>
        <Text
          color={textColor}
          fontSize='xl'
          fontWeight='700'
          lineHeight='100%'>
          AZTravel Assistant
        </Text>
        <Icon as={MdChatBubbleOutline} color={brandColor} w='20px' h='20px' />
      </Flex>
      
      {/* --- FENÊTRE DE CHAT --- */}
      <Flex
        direction='column'
        h='300px' // Hauteur fixe pour la fenêtre de chat
        p='15px'
        overflowY='auto' // Permet de faire défiler les messages
        borderTop='1px solid'
        borderBottom='1px solid'
        borderColor={borderColor}
      >
        
        {/* Messages */}
        {chatHistory.length === 0 && selectedCity ? (
            <Text color={textColorSecondary} textAlign="center" m='auto'>
                Pose ta première question sur {selectedCity} !
            </Text>
        ) : chatHistory.length === 0 && (
            <Text color={textColorSecondary} textAlign="center" m='auto'>
                Sélectionne une ville pour activer l'assistant.
            </Text>
        )}
        
        {chatHistory.map((msg, index) => (
          <Flex 
            key={index} 
            justify={msg.role === "user" ? "flex-end" : "flex-start"} 
            mb='10px'>
            <Box
              maxW='80%'
              p='10px'
              borderRadius='lg'
              bg={msg.role === "user" ? brandColor : modelBg}
              color={msg.role === "user" ? "white" : textColor}
              fontWeight='medium'
              fontSize='sm'
            >
              {/* Permet d'afficher les sauts de ligne de l'IA */}
              <Text whiteSpace='pre-wrap'>{msg.text}</Text>
            </Box>
          </Flex>
        ))}
        {/* Ancre invisible pour le défilement auto */}
        <div ref={messagesEndRef} />
      </Flex>
      
      {/* --- INPUT DU CHAT --- */}
      <Flex p='15px' gap='10px' align='center' mt='auto'>
        <Input
          placeholder={selectedCity ? `Demande quelque chose sur ${selectedCity}...` : "Sélectionnez une ville..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
          isDisabled={!selectedCity} // Désactivé si aucune ville n'est sélectionnée
        />
        <Button 
            onClick={handleSend} 
            colorScheme='brand' 
            isDisabled={!selectedCity || inputText.trim() === ""}
            px='15px'>
          <Icon as={MdSend} />
        </Button>
      </Flex>

    </Card>
  );
}