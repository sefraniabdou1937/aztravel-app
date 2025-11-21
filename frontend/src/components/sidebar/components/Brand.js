import React from "react";

// Chakra imports
// On ajoute 'Text' aux imports
import { Flex, useColorModeValue, Text } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      
      {/* --- REMPLACEMENT DU LOGO PAR DU TEXTE --- */}
      <Text
        fontSize='32px'
        fontWeight='800'
        color={logoColor}
        fontFamily='sans-serif'
        my='32px' // Marge verticale pour l'espacement
        letterSpacing='-1px' // Style un peu plus "logo"
      >
        AZTRAVEL
      </Text>
      {/* ----------------------------------------- */}

      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;