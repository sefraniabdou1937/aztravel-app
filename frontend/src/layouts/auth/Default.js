// Chakra imports
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React from "react";
import Footer from "components/footer/FooterAuth"; // <-- Il appelle ton FooterAuth.js
import FixedPlugin from "components/fixedPlugin/FixedPlugin";
// Custom components
import { NavLink } from "react-router-dom";
// Assets
import { FaChevronLeft } from "react-icons/fa";

function AuthIllustration(props) {
  const { children, illustrationBackground } = props;
  // Chakra color mode
  return (
    // 1. Conteneur principal (Revenu à h='max-content')
    <Flex position='relative' h='max-content'>
      
      {/* 2. Contenu principal (Formulaire + Image) */}
      <Flex
        // flex='1' a été SUPPRIMÉ d'ici
        h={{
          sm: "initial",
          md: "unset",
          lg: "100vh",
          xl: "97vh",
        }}
        w='100%'
        maxW={{ md: "66%", lg: "1313px" }}
        mx='auto'
        pt={{ sm: "50px", md: "0px" }}
        px={{ lg: "30px", xl: "0px" }}
        ps={{ xl: "70px" }}
        justifyContent='start'
        direction='column'>
        
        {/* Lien "Back to Simmmple" */}
        <NavLink
          to='/admin'
          style={() => ({
            width: "fit-content",
            marginTop: "40px",
          })}>
          <Flex
            align='center'
            ps={{ base: "25px", lg: "0px" }}
            pt={{ lg: "0px", xl: "0px" }}
            w='fit-content'>
            <Icon
              as={FaChevronLeft}
              me='12px'
              h='13px'
              w='8px'
              color='secondaryGray.600'
            />
            <Text ms='0px' fontSize='sm' color='secondaryGray.600'>
              Back to Simmmple
            </Text>
          </Flex>
        </NavLink>
        
        {children} {/* <-- C'est ici que ton formulaire <SignIn> s'affiche */}
        
        {/* L'image de droite */}
        <Box
          display={{ base: "none", md: "block" }}
          h='100%'
          minH='100vh'
          w={{ lg: "50vw", "2xl": "44vw" }}
          position='absolute'
          right='0px'>
          <Flex
            bg={`url(${illustrationBackground})`}
            justify='center'
            align='end'
            w='100%'
            h='100%'
            bgSize='cover'
            bgPosition='50%'
            position='absolute'
            borderBottomLeftRadius={{ lg: "120px", xl: "200px" }}></Flex>
        </Box>
        
        {/* 3. Pied de page (Footer) RE-DÉPLACÉ ici */}
        {/* Il est maintenant à l'intérieur de la colonne de gauche */}
        <Box
          w='100%'
          px={{ base: "30px", md: "50px" }}
          pb='30px'
          pt='30px' // Ajout d'un peu d'espace en haut
        >
          <Footer />
        </Box>

      </Flex> {/* <-- Fin de la 2ème Flex */}
      
      {/* Plugin Fixe (Roue dentée) */}
      <FixedPlugin />
      
    </Flex> // <-- Fin de la 1ère Flex
  );
}

// PROPS (CORRIGÉ)
AuthIllustration.propTypes = {
  illustrationBackground: PropTypes.string,
  image: PropTypes.any,
};

export default AuthIllustration;