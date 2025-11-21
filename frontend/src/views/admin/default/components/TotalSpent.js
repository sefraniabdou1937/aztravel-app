// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Spinner, // On importe un "Spinner" de chargement
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react"; 
import { MdBarChart } from "react-icons/md";

export default function TotalSpent({ forecastData }) {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("white", "whiteAlpha.100");
  const brandColor = useColorModeValue("brand.500", "white");

  // --- NOUVELLE LOGIQUE D'AFFICHAGE ---
  const renderContent = () => {
    // Cas 1 : On a des données valides
    if (forecastData && forecastData.forecast && forecastData.forecast.length > 0) {
     return forecastData.forecast.map((day, index) => (
        // Le conteneur "Flex" avec justify='space-between'
        // va pousser le 1er enfant (le <Box>) à gauche
        // et le 2ème enfant (le <Text>) à droite.
        <Flex 
          key={index} 
          justify='space-between' 
          align='center' 
          mb='15px' 
          p='10px' 
          bg={boxBg} 
          borderRadius='12px'
        >
          
          {/* ENFANT 1 : Le bloc Jour/Date (à gauche) */}
          <Box>
            <Text fontSize='lg' fontWeight='700' color={textColor}>
              {day.day_name}
            </Text>
            <Text fontSize='sm' color={textColorSecondary}>
              {day.full_date}
            </Text>
          </Box>
          
          {/* ENFANT 2 : La température (à droite) */}
          <Text fontSize='xl' fontWeight='700' color={brandColor}>
            {day.temp}°C
          </Text>

        </Flex>
      ));
    }
    
    // Cas 2 : On attend les données (forecastData est null au début)
    // Mais l'utilisateur a déjà cliqué (le titre a changé)
    if (forecastData) {
       return (
        <Flex justify='center' align='center' h='100%'>
          <Spinner size='xl' color={brandColor} />
          <Text ml='10px' color={textColorSecondary}>Chargement des prévisions...</Text>
        </Flex>
       )
    }

    // Cas 3 : État initial (avant de choisir une ville)
    return (
      <Text color={textColorSecondary} textAlign='center' mt='20px'>
        Sélectionnez une ville pour voir les prévisions.
      </Text>
    );
  };
  // --- FIN DE LA NOUVELLE LOGIQUE ---

  return (
    <Card
      justifyContent='center'
      align='center'
      direction='column'
      w='100%'
      mb='0px'>
      
      {/* Titre (ne change pas) */}
      <Flex justify='space-between' ps='0px' pe='20px' pt='5px' w='100%'>
        <Flex align='center' w='100%'>
          <Button
            bg={boxBg}
            fontSize='sm'
            fontWeight='500'
            color={textColorSecondary}
            borderRadius='7px'>
            <Icon
              as={MdBarChart}
              color={textColorSecondary}
              me='4px'
            />
            Prévisions sur 5 jours
          </Button>
        </Flex>
      </Flex>
      
      {/* Sous-titre (ne change pas) */}
      <Flex w='100%' flexDirection={{ base: "column", lg: "row" }} px='15px'>
        <Flex minW='100%' maxW='100%' mt='8px' me='auto'>
          <Text
            color={textColor}
            fontSize='xl'
            fontWeight='700'
            lineHeight='100%'>
            {forecastData ? "Prévisions Météo" : "Prévisions Météo (sélectionnez une ville)"}
          </Text>
        </Flex>
      </Flex>
      
      {/* --- LE CONTENU (REMPLACÉ) --- */}
      <Box w='100%' minH='260px' mt='20px' p='10px'>
        {renderContent()}
      </Box>

    </Card>
  );
}