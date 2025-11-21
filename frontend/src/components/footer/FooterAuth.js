/*eslint-disable*/
import React from "react";
import {
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function FooterAuth() {
  // Tu peux changer "gray.400" en "white" si le texte n'est pas
  // assez visible sur ton fond de formulaire.
  let textColor = useColorModeValue("gray.400", "gray.400");

  return (
    // J'ai supprimé le <Flex> qui centrait tout.
    // On renvoie juste le texte, aligné à gauche.
    <Text
      color={textColor}
      textAlign="start" // <-- ALIGNEMENT À GAUCHE
      mb={{ base: "20px", lg: "0px" }}>
      <Text as='span' fontWeight='500' ms='4px'>
        © 2025 AZTRAVEL. A project by Abderrahamen Sefrani & Zayd Tiab.
      </Text>
    </Text>
  );
}