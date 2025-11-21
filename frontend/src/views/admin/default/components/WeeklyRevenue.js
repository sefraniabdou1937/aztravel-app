// Chakra imports
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Spinner, // Pour le chargement
  Image,   // Pour afficher les photos
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";

// Le composant accepte la prop 'photoData'
export default function WeeklyRevenue({ photoData }) {
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const brandColor = useColorModeValue("brand.500", "white");

  // Fonction pour afficher le contenu
  const renderContent = () => {
    // Cas 1: On attend (avant qu'une ville soit choisie)
    if (photoData === null) {
      return (
        <Flex justify='center' align='center' h='100%'>
          <Text color={textColorSecondary}>
            Sélectionnez une ville pour voir les photos.
          </Text>
        </Flex>
      );
    }

    // Cas 2: On charge (l'API est appelée mais n'a pas répondu)
    if (Array.isArray(photoData) && photoData.length === 0) {
       return (
        <Flex justify='center' align='center' h='100%'>
          <Spinner size='xl' color={brandColor} />
        </Flex>
       )
    }

    // Cas 3: On a reçu les photos (photoData est une liste pleine)
    if (Array.isArray(photoData) && photoData.length > 0) {
      return (
        <Flex 
          w='100%' 
          h='100%' 
          gap='10px' 
          p='5px'
          wrap='wrap'
          justify='center'
          alignItems='center' // <-- MODIFICATION 1: Centre les photos verticalement
          overflowY='auto'
        >
          {photoData.map((photo) => (
            <Box 
              key={photo.id} 
              width='calc(50% - 5px)'
              height={{ base: '150px', md: '180px' }}
              borderRadius='lg' 
              overflow='hidden'
            >
              <Image
                src={photo.url_small}
                alt={photo.alt}
                w='100%'
                h='100%'
                objectFit='cover'
              />
            </Box>
          ))}
        </Flex>
      );
    }

    // Cas par défaut (ne devrait pas arriver)
    return null;
  };

  return (
    <Card w='100%' h='100%'>
      {/* TITRE */}
      <Flex align='center' w='100%' px='15px' py='10px'>
        <Text
          color={textColor}
          fontSize='lg'
          fontWeight='700'
          lineHeight='100%'>
          Galerie de la Ville
        </Text>
      </Flex>

      {/* CONTENU (La Galerie) */}
      <Box 
        h='380px' 
        w='100%' 
        mt='20px' // <-- MODIFICATION 2: Remonté (au lieu de 'mt=auto')
      >
        {renderContent()}
      </Box>
    </Card>
  );
}