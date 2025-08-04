import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Image,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  SimpleGrid,
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
const Menu2 = () => {
  const controls = useAnimation();
  const [scope, animate] = useAnimate();
  const [noiseRef, noiseAnimate] = useAnimate();
  const [gradientRef, gradientAnimate] = useAnimate();
  const [textRef] = useAnimate();
  const [shouldAnimate, setShouldAnimate] = useState(true);


  return (
    <>
      <MotionBox
        ref={gradientRef}
        initial={ 1 }
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
        // h={animationDone ? "auto" : "100vh"}
        zIndex={2}
        // h="100vh"
        // h={animationDone ? "auto" : "100vh"}
        h="100vh"
        w="100vw"
        overflowX="hidden"
        // overflowY="auto"
        sx={{
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
          style={
            {
              // willChange: "opacity", // Informuje przeglądarkę, że będzie zmiana
              // imageRendering: "crisp-edges", // Lepsza jakość dla skalowania
              //         filter: "blur(0)", // Hack dla Safari
              // transform: "translateZ(0)", // Wymusza warstwę GPU
            }
          }
          initial={{
                  position: "absolute",
                  top: "3vh",
                  left: "50%",
                  x: "-50%",
                  y: "0",
                  scale: 1,
                  opacity: 1,
                  zIndex: 10,
                }
            }
          
          // animate={controls}
          // transition={{ type: "spring", damping: 20 }}
          boxSize="20vh"
          mx="auto"
        />
     

          <VStack
            spacing={12}
            // border={"10px solid green"}
            minH="100vh" // Zapewnia odpowiednią wysokość
            overflow="visible"
            position="relative"
            align="stretch"
            w="100%" // ZMIANA: z 100vw na 100%
            // minH="100%"
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
                maxH="60%"
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

              <VStack spacing={20} align="flex-start" pl={14}>
                {" "}
                {/* Wyrównanie do lewej */}
                <Box>
                  <Heading
                    as="h3"
                    size="md"
                    mb={0.5}
                    fontSize="0.9rem"
                    color="gray.300"
                  >
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
                  <Heading
                    as="h3"
                    size="md"
                    mb={0.5}
                    fontSize="0.9rem"
                    color="gray.300"
                  >
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
                  <Heading
                    as="h3"
                    size="md"
                    mb={0.5}
                    fontSize="0.9rem"
                    color="gray.300"
                  >
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
            <MotionContainer
              maxW="85%"
              py={1} // Większy padding pionowy
              bg="transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              textAlign="center" // Wyśrodkowanie całej sekcji
              color="white"
            >
              <Box mb={0}>
                <Heading
                  as="h2"
                  size="lg"
                  mb={6}
                  fontSize="3.5rem"
                  bgGradient="linear-gradient(90deg, rgb(130, 70, 190), rgb(227,11,78), rgb(249,72,38))"
                  bgClip="text"
                  css={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Czym jest Silent Disco?
                </Heading>

                <Text
                  fontSize="1.3rem"
                  color="whiteAlpha.700"
                  fontStyle="italic"
                  mb={12}
                >
                  Poznaj wyjątkowe doświadczenie imprezy w zupełnie nowym
                  wymiarze
                </Text>

                <Box
                  maxW="800px"
                  mx="auto" // Wyśrodkowanie bloku tekstowego
                  fontSize="1.2rem"
                  lineHeight="1.8"
                  textAlign="center"
                >
                  <Text mb={6}>
                    TUTAJ BEDA SZCZEGOLY WYDARZENIA Z JAKIMS WPROWADZENIEM
                  </Text>
                  <Text mb={6}>
                    Silent Disco to rewolucyjna forma rozrywki, gdzie uczestnicy
                    tańczą w słuchawkach, każdy wybierając swój ulubiony kanał
                    muzyczny. Dzięki temu powstaje unikalna atmosfera - widzisz
                    tłum ludzi tańczących w rytm różnych beatów, ale słyszysz
                    tylko swoją muzykę.
                  </Text>

                  <Text mb={6}>
                    Nasze wydarzenie to nie tylko tańce - to pełna produkcja z
                    profesjonalnym oświetleniem, efektami wizualnymi i trzema
                    kanałami muzycznymi prowadzonymi przez najlepszych DJ-ów.
                  </Text>

                  <Text>
                    Dołącz do nas i doświadcz imprezy przyszłości, gdzie Ty
                    kontrolujesz głośność i rodzaj muzyki, a sąsiedzi nawet nie
                    wiedzą, że właśnie urządzasz najlepszą imprezę w okolicy!
                  </Text>
                </Box>
              </Box>
            </MotionContainer>
            <MotionContainer
              maxW="85%"
              py={10}
              bg="transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              textAlign="center"
              color="white"
            >
              <Box mb={16}>
                <Heading
                  as="h2"
                  size="lg"
                  mb={6}
                  fontSize="3.5rem"
                  bgGradient="linear-gradient(90deg, rgb(130, 70, 190), rgb(227,11,78), rgb(249,72,38))"
                  bgClip="text"
                  css={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Co jest w cenie?
                </Heading>

                <Text fontSize="1.3rem" color="whiteAlpha.700" mb={16}>
                  Pełen pakiet rozrywki za jednym zamówieniem
                </Text>

                {/* Grid 2x3 */}
                <SimpleGrid
                  columns={{ base: 1, md: 3 }} // 1 kolumna na mobile, 3 na desktop
                  spacing={8}
                  maxW="1200px"
                  mx="auto"
                >
                  {/* Rząd 1 */}
                  {[
                    {
                      icon: "/assets/logo.png",
                      title: "Profesjonalne słuchawki",
                      desc: "Bezprzewodowe, wielokanałowe z regulacją głośności",
                    },
                    {
                      icon: "/assets/logo.png",
                      title: "3 kanały muzyczne",
                      desc: "Różne gatunki muzyki prowadzone przez DJ-ów",
                    },
                    {
                      icon: "/assets/logo.png",
                      title: "Efekty wizualne",
                      desc: "Profesjonalne oświetlenie i multimedia",
                    },
                    // Rząd 2
                    {
                      icon: "/assets/logo.png",
                      title: "Obsługa techniczna",
                      desc: "Całodobowe wsparcie naszego zespołu",
                    },
                    {
                      icon: "/assets/logo.png",
                      title: "Pamiątkowy gadżet",
                      desc: "Niepowtarzalny upominek dla każdego uczestnika",
                    },
                    {
                      icon: "/assets/logo.png",
                      title: "Bezpieczna przestrzeń",
                      desc: "Ubezpieczenie i ochrona przez cały czas trwania",
                    },
                  ].map((item, index) => (
                    <Box
                      key={index}
                      p={6}
                      borderRadius="lg"
                      bg="whiteAlpha.50"
                      backdropFilter="blur(10px)"
                      _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "xl",
                      }}
                      transition="all 0.3s ease"
                    >
                      <Image
                        src={item.icon}
                        alt={item.title}
                        boxSize="80px"
                        mx="auto"
                        mb={6}
                      />
                      <Heading
                        as="h3"
                        fontSize="1.8rem"
                        mb={4}
                        bgGradient="linear-gradient(90deg, rgb(130, 70, 190), rgb(227,11,78))"
                        bgClip="text"
                      >
                        {item.title}
                      </Heading>
                      <Text fontSize="1.1rem" color="whiteAlpha.800">
                        {item.desc}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </MotionContainer>
            <MotionContainer
              maxW="85%"
              py={8}
              bg="transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              textAlign="left" // Wyrównanie całej sekcji do prawej
              color="white"
              pr={{ base: 0, md: "0%" }} // Margines prawy na większych ekranach
              pl={{ base: 0, md: "0%" }} // Większy lewy margines
            >
              <Box mb={14} textAlign="left">
                {" "}
                {/* Wyrównanie nagłówka do prawej */}
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
                  Najczęściej zadawane pytania
                </Heading>
                <Box
                  width={{ base: "100%", md: "70%", lg: "55%" }}
                  fontSize="1.3rem"
                  //ml="auto" // Automatyczny lewy margines dla tekstu
                >
                  Nie znalazłeś odpowiedzi? Skontaktuj się z nami!
                </Box>
              </Box>

              {/* Kontener FAQ */}
              <Box textAlign="left" pl={"0%"}>
                {" "}
                {/* Wyrównanie pytań do prawej */}
                {[
                  {
                    question: "Jak dokonać rezerwacji?",
                    answer:
                      "Rezerwacja składa się z 3 kroków: 1) Wypełnij formularz, 2) Otrzymasz e-mail z potwierdzeniem, 3) Dokonaj płatności.",
                  },
                  {
                    question: "Czy mogę anulować rezerwację?",
                    answer:
                      "Tak, anulowanie jest możliwe do 48h przed wydarzeniem. Wystarczy wysłać e-mail na adres: rezerwacje@silentdiscopiraci.pl",
                  },
                  {
                    question: "Czy potrzebuję własnych słuchawek?",
                    answer:
                      "Nie, zapewniamy wysokiej jakości słuchawki bezprzewodowe. Możesz jednak zabrać własne jeśli wolisz.",
                  },
                  {
                    question: "Czy mogę anulować rezerwację?",
                    answer:
                      "Tak, anulowanie jest możliwe do 48h przed wydarzeniem. Wystarczy wysłać e-mail na adres: rezerwacje@silentdiscopiraci.pl",
                  },
                  {
                    question: "Czy mogę anulować rezerwację?",
                    answer:
                      "Tak, anulowanie jest możliwe do 48h przed wydarzeniem. Wystarczy wysłać e-mail na adres: rezerwacje@silentdiscopiraci.pl",
                  },
                  {
                    question: "Czy mogę anulować rezerwację?",
                    answer:
                      "Tak, anulowanie jest możliwe do 48h przed wydarzeniem. Wystarczy wysłać e-mail na adres: rezerwacje@silentdiscopiraci.pl",
                  },
                  {
                    question: "Czy mogę anulować rezerwację?",
                    answer:
                      "Tak, anulowanie jest możliwe do 48h przed wydarzeniem. Wystarczy wysłać e-mail na adres: rezerwacje@silentdiscopiraci.pl",
                  },
                ].map((item, index) => (
                  <Box
                    key={index}
                    borderBottom="1px solid"
                    borderColor="whiteAlpha.300"
                    py={6}
                  >
                    <Accordion allowToggle>
                      <AccordionItem border="none">
                        {({ isExpanded }) => (
                          <>
                            <AccordionButton
                              px={0}
                              _hover={{ bg: "transparent" }}
                              _focus={{ boxShadow: "none" }}
                              justifyContent="flex-end" // Przycisk rozwijany do prawej
                            >
                              <Box flex="1" textAlign="left">
                                {" "}
                                {/* Pytanie wyrównane do prawej */}
                                <Heading
                                  as="h3"
                                  fontSize="1.8rem"
                                  fontWeight="bold"
                                  color={
                                    isExpanded ? "white" : "whiteAlpha.800"
                                  }
                                >
                                  {item.question}
                                </Heading>
                              </Box>
                              <AccordionIcon
                                color="white"
                                fontSize="2rem"
                                ml={4} // Margines od tekstu
                                transform={
                                  isExpanded ? "rotate(180deg)" : "none"
                                }
                                transition="transform 0.2s"
                              />
                            </AccordionButton>

                            <AccordionPanel
                              pb={4}
                              px={0}
                              textAlign="left" // Odpowiedź wyrównana do prawej
                              initial={{ opacity: 0, height: 0 }}
                              animate={{
                                opacity: isExpanded ? 1 : 0,
                                height: isExpanded ? "auto" : 0,
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              <Text
                                fontSize="1.2rem"
                                color="whiteAlpha.800"
                                // ml="auto" // Automatyczny margines dla tekstu
                                maxW={{ base: "100%", md: "70%" }} // Ograniczenie szerokości
                              >
                                {item.answer}
                              </Text>
                            </AccordionPanel>
                          </>
                        )}
                      </AccordionItem>
                    </Accordion>
                  </Box>
                ))}
              </Box>
            </MotionContainer>
            <Footer />
          </VStack>
      </Box>
    </>
  );
};

export default Menu2;
