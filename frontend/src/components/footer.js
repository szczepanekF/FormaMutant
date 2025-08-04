import { Box, Flex, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const MotionBox = motion(Box);
  return (
    <MotionBox
      as="footer"
      py={8}
      pb={0}
      textAlign="center"
      mt="auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      <Box maxW="85%" mx="auto" px={1} borderTop="1px solid white" mb={8} pb={0}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "center", md: "flex-start" }}
          wrap="wrap"
          color="gray.200"
          pt={6}
        >
          {/* Kolumna 1: Copyright, Kontakt, Organizator */}
          <Box
            flexBasis={{ md: "33.33%" }}
            mb={{ base: 6, md: 0 }}
            textAlign={{ base: "center", md: "left" }}
          >
            <Text fontSize="sm" mb={2} lineHeight="tall">
              © 2025 Planeta Luzu
            </Text>
            <Text fontSize="sm" mb={2} lineHeight="tall">
              Kontakt:{" "}
              <ChakraLink
                href="mailto:kontakt@planetaluzu.pl"
                color="gray.200"
                _hover={{ color: "white", textDecoration: "underline" }}
              >
                planetaluzu.sd@gmail.com
              </ChakraLink>
            </Text>
            <Text fontSize="sm" lineHeight="tall">
              Organizator: Wiktoria Kirsz
            </Text>
          </Box>

          {/* Kolumna 2: Linki do wydarzeń */}
          <Box
            flexBasis={{ md: "33.33%" }}
            mb={{ base: 6, md: 0 }}
            textAlign={{ base: "center", md: "center" }}
          >
            <Text fontSize="sm" fontWeight="bold" mb={4} lineHeight="tall">
              Linki do wydarzeń
            </Text>
            <Flex justify="center" gap={4}>
              {/* Facebook Logo Box */}
              <ChakraLink
                href="https://fb.me/2OUxczu5qaojgBY"
                isExternal
                _hover={{ transform: "scale(1.05)" }}
              >
                <Box
                  bg="transparent"
                  p="0.5rem"
                  border="1px solid white"
                  borderRadius="0.5rem"
                  w="3.5rem"
                  h="2rem"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                >
                  <Image
                    src="/assets/fb.svg"
                    alt="Facebook"
                    w="1.25rem"
                    h="1.25rem"
                    filter="brightness(0) invert(1)"
                  />
                </Box>
              </ChakraLink>

              {/* Instagram Logo Box */}
              <ChakraLink
                href="https://instagram.com"
                isExternal
                _hover={{ transform: "scale(1.05)" }}
              >
                <Box
                  bg="transparent"
                  p="0.5rem"
                  border="1px solid white"
                  borderRadius="0.5rem"
                  w="3.5rem"
                  h="2rem"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                >
                  <Image
                    src="/assets/ig.svg"
                    alt="Instagram"
                    w="1.25rem"
                    h="1.25rem"
                    filter="brightness(0) invert(1)"
                  />
                </Box>
              </ChakraLink>
            </Flex>
          </Box>

          {/* Kolumna 3: Regulaminy */}
          <Box
            flexBasis={{ md: "33.33%" }}
            mb={{ base: 6, md: 0 }}
            textAlign={{ base: "center", md: "right" }}
            w={{ md: "100%" }}
          >
            <Text fontSize="sm" mb={2} lineHeight="tall">
              <ChakraLink
                as={RouterLink}
                to="/rules"
                color="gray.200"
                _hover={{ color: "white", textDecoration: "underline" }}
              >
                Regulamin
              </ChakraLink>
            </Text>
            <Text fontSize="sm" lineHeight="tall">
              <ChakraLink
                as={RouterLink}
                to="/rodo"
                color="gray.200"
                _hover={{ color: "white", textDecoration: "underline" }}
              >
                Regulamin RODO
              </ChakraLink>
            </Text>
          </Box>
        </Flex>
      </Box>
    </MotionBox>
  );
};

export default Footer;