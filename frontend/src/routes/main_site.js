import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Image,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { motion, useAnimation, useAnimate } from "framer-motion";
import Slider from "../components/swiper";
import NoiseBackground from "../components/noiseBackground";
import GradientBackground from "../components/gradientBackground";
import CurvedTextComponent from "../components/curvedTextComponent";
import Footer from "../components/footer";
import { Link as RouterLink } from "react-router-dom";

// W komponencie Menu, przed zwróceniem JSX:

// Motion components
const MotionBox = motion(Box);
const MotionImage = motion(Image);
const MotionContainer = motion(Container);
const MotionText = motion(Text);

// Main component
const Menu = () => {
  const controls = useAnimation();
  const [scope, animate] = useAnimate();
  const [animationDone, setAnimationDone] = useState(false);
  const [noiseRef, noiseAnimate] = useAnimate();
  const [gradientRef, gradientAnimate] = useAnimate();
  const [textRef] = useAnimate();

  async function myAnimation() {
    await animate(
      [
        [
          scope.current,
          {
            position: "absolute",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            scale: 2,
            opacity: 1,
            zIndex: 10,
          },
          { at: 0 },
        ], // at: 0 oznacza start w tym samym czasie
        [
          textRef.current,
          {
            position: "absolute",
            top: "calc(50% )",
            left: "50%",
            x: "-50%",
            y: "-50%",
            scale: 2.5,
            opacity: 1,
            zIndex: 10,
          },
          { at: 0 },
        ], // at: 0 dla synchronicznego startu
      ],
      {
        ease: "easeInOut",
        duration: 2,
      }
    );
    await new Promise((res) => setTimeout(res, 900));

    // 1. Animacja głównych elementów (scope i textRef)
    const mainAnimation = animate(
      [
        [
          scope.current,
          {
            top: "3vh",
            scale: 1,
            opacity: 1,
            y: 0,
            x: "-50%",
          },
          { at: 0 },
        ],
        [
          textRef.current,
          {
            top: "calc(0vh)",
            scale: 1,
            opacity: 0,
            y: 0,
            x: "-50%",
          },
          { at: 0 },
        ],
      ],
      {
        ease: "easeInOut",
        duration: 1.5,
      }
    );

    // 2. Równolegle uruchamiamy animacje tła
    const backgroundAnimations = Promise.all([
      noiseAnimate(noiseRef.current, { opacity: 0 }, { duration: 15 }),
      gradientAnimate(gradientRef.current, { opacity: 1 }, { duration: 3 }),
    ]);

    // 3. Ustawiamy timer na wywołanie setAnimationDone w połowie głównej animacji
    const contentReveal = new Promise((resolve) => {
      setTimeout(() => {
        setAnimationDone(true);
        resolve();
      }, 750); // Połowa czasu trwania głównej animacji (1.5s / 2)
    });

    // Czekamy na:
    // - zakończenie głównej animacji
    // - zakończenie animacji tła (choć noise trwa 15s, nie blokujemy)
    // - pokazanie zawartości
    await Promise.all([mainAnimation, backgroundAnimations, contentReveal]);
  }

  useEffect(() => {
    const animateLogo = async () => {
      await new Promise((res) => setTimeout(res, 1)); // tylko Noise przez 1s

      await myAnimation();

      setAnimationDone(true);
    };

    animateLogo();
  }, [controls]);

  return (
    <>
      <MotionBox
        ref={noiseRef}
        initial={{ opacity: 1 }}
        position="fixed"
        w="100%"
        h="100%"
        zIndex={0}
      >
        <NoiseBackground />
      </MotionBox>

      {/* GradientBackground z początkowym opacity 0 i animowanym do 1 */}
      <MotionBox
        ref={gradientRef}
        initial={{ opacity: 0 }}
        position="fixed"
        w="100%"
        h="100%"
        zIndex={1}
      >
        <GradientBackground />
      </MotionBox>
      {/* Zawsze to samo logo, które zmienia styl i pozycję */}

      <Box
        position="relative"
        // border={"10px solid green"}
        zIndex={2}
        h="100vh"
        w="100vw"
        overflowX="hidden"
        overflowY="auto"
        css={{
          scrollbarGutter: "stable",
          "&::-webkit-scrollbar": {
            width: "12px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0,0,0,0.05)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "6px",
            border: "3px solid transparent",
            backgroundClip: "content-box",
          },
        }}
      >
        <MotionImage
          src="/assets/logo.png"
          alt="Logo"
          ref={scope}
          initial={{
            position: "fixed",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            scale: 10,
            opacity: 0,
            zIndex: 10,
          }}
          // animate={controls}
          boxSize="20vh"
          mx="auto"
        />
        <CurvedTextComponent textRef={textRef} />
        {animationDone && (
          <VStack
            spacing={12}
            // border={"10px solid green"}
            align="stretch"
            w="100%" // ZMIANA: z 100vw na 100%
            minH="100%"
            p={0} // Zapewnia brak paddingu
            m={0} // Zapewnia brak marginesu
            // pb="20px"
            // overflowY="auto"
            // overflowX="hidden"
            // style={{ scrollbarGutter: "stable" }}

            // border ="20px solid red"
          >
            <Box h="20vh" />
            {/* Wprowadzenie */}
            <MotionContainer
              maxW="container.md"
              textAlign="center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              px={0}
            >
              <Heading as="h1" fontSize="3rem" color="white" mb={4}>
                Silent Disco{" "}
                <Box
                  as="span"
                  sx={{
                    background:
                      "linear-gradient(90deg, rgb(130, 70, 190), rgb(227,11,78), rgb(249,72,38))",

                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                  }}
                >
                  PIRACI
                </Box>
              </Heading>

              <Text fontSize="1.5rem" color="white">
                Dobranka, 22.08.2025 20:00
              </Text>
            </MotionContainer>

            {/* Slider */}
            <Box w="100%" px={0}>
              <MotionContainer
                maxW="100%"
                maxH="55%"
                px={0}
                marginTop={4}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                // border="50px solid"
                mx="auto"
              >
                <Slider />
              </MotionContainer>
            </Box>
            {/* Blok tekstowy #1 */}
            <MotionContainer
              maxW="container.lg"
              py={8}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              px={0}
              textAlign="center" // Wyśrodkowanie tekstu
              color="white" // Biały kolor tekstu
            >
              <VStack spacing={4} align="center" mb={8}>
                <Heading as="h3" fontSize="4rem" fontWeight="bold">
                  Dołącz do{" "}
                  <Box
                    as="span"
                    bgGradient="linear-gradient(90deg, rgb(130, 70, 190), rgb(227,11,78), rgb(249,72,38))"
                    bgClip="text"
                    display="inline"
                  >
                    NAS 22 sierpnia
                  </Box>
                </Heading>

                <Text fontSize="1.5rem">
                  Wypełnij formularz i zarezerwuj miejsce na imprezie
                </Text>

                <Text fontSize="1rem" fontStyle="italic">
                  Formularz aktywny do 20.08
                </Text>
              </VStack>

              <ChakraLink
                as={RouterLink}
                to="/order"
                _hover={{ textDecoration: "none" }}
              >
                <Button
                  height="auto"
                  width="auto"
                  px={12}
                  py={5}
                  borderRadius="full"
                  fontSize={"1.5rem"}
                  bg="white"
                  color="black"
                  transition="all 0.3s ease"
                  position="relative"
                  _hover={{
                    color: "white", // tekst na biały
                    bg: "rgba(255, 255, 255, 0)", // tło całkowicie przezroczyste
                    boxShadow: "lg",
                    // transform: "none" - usunięte, aby nie zmieniać rozmiaru
                  }}
                >
                  Zarezerwuj miejsce
                </Button>
              </ChakraLink>
            </MotionContainer>

            <MotionContainer
              maxW="85%"
              py={8}
              bg="transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              textAlign="left"
              color="white"
            >
              <Box mb={14}>
                <Heading
                  as="h2"
                  size="lg"
                  mb={4}
                  fontSize="3.5rem"
                  bgGradient="linear-gradient(90deg, rgb(130, 70, 190), rgb(227,11,78), rgb(249,72,38))"
                  bgClip="text"
                  css={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Rezerwacja trzy etapowa
                </Heading>

                <Box
                  width={{ base: "100%", md: "70%", lg: "55%" }} // Responsywna szerokość
                  fontSize="1.3rem"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris consequat metus nec neque dignissim elementum. Sed
                  dapibus venenatis urna a aliquam.
                </Box>
              </Box>

              <VStack spacing={12} align="flex-start" pl={8}>
                {" "}
                {/* Wyrównanie do lewej */}
                <Box>
                  <Heading as="h3" size="md" mb={0.5} fontSize="0.9rem" color="gray.300">
                    {" "}
                    {/* Rozmiar w rem */}
                    1. Krok pierwszy
                  </Heading>
                  <Text fontWeight="bold" mb={2} fontSize="2.5rem">
                    {" "}
                    {/* Rozmiar w rem */}
                    Wypełnij formularz!
                  </Text>
                  <Box
                    width={{ base: "100%", md: "70%", lg: "55%" }} // Responsywna szerokość
                    fontSize="1.1rem"
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris consequat metus nec neque dignissim elementum. Sed
                    dapibus venenatis urna a aliquam.
                  </Box>
                </Box>
                <Box>
                  <Heading as="h3" size="md" mb={0.5} fontSize="0.9rem" color="gray.300">
                    {" "}
                    {/* Rozmiar w rem */}
                    2. Krok drugi
                  </Heading>
                  <Text fontWeight="bold" mb={2} fontSize="2.5rem">
                    {" "}
                    {/* Rozmiar w rem */}
                    Wypełnij formularz!
                  </Text>
                  <Box
                    width={{ base: "100%", md: "70%", lg: "55%" }} // Responsywna szerokość
                    fontSize="1.1rem"
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris consequat metus nec neque dignissim elementum. Sed
                    dapibus venenatis urna a aliquam.
                  </Box>
                </Box>
                <Box>
                  <Heading as="h3" size="md" mb={0.5} fontSize="0.9rem" color="gray.300">
                    {" "}
                    {/* Rozmiar w rem */}
                    3. Krok treci
                  </Heading>
                  <Text fontWeight="bold" mb={2} fontSize="2.5rem">
                    {" "}
                    {/* Rozmiar w rem */}
                    Wypełnij formularz!
                  </Text>
                  <Box
                    width={{ base: "100%", md: "70%", lg: "55%" }} // Responsywna szerokość
                    fontSize="1.1rem"
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris consequat metus nec neque dignissim elementum. Sed
                    dapibus venenatis urna a aliquam.
                  </Box>
                </Box>
              </VStack>
            </MotionContainer>

            <Footer />
          </VStack>
        )}
      </Box>
    </>
  );
};

export default Menu;
