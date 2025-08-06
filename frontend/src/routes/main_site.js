import { useEffect, useState } from "react";
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
import Footer from "../components/footer";
import { Link as RouterLink } from "react-router-dom";
import Menu2 from "./main_site_copy";

const MotionBox = motion(Box);
const MotionImage = motion(Image);
const MotionContainer = motion(Container);

const Menu = () => {
  const controls = useAnimation();
  const [scope, animate] = useAnimate();
  const [animationDone, setAnimationDone] = useState(false);
  const [skipAnimation, setSkimAnimation] = useState(
    !!localStorage.getItem("hasSeenAnimation")
  );
  const [noiseRef, noiseAnimate] = useAnimate();
  const [gradientRef, gradientAnimate] = useAnimate();

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
        ],
      ],
      {
        ease: "easeInOut",
        duration: 2,
      }
    );
    await new Promise((res) => setTimeout(res, 900));
    const getTopValue = () => {
      return window.innerWidth < 768 ? "2vh" : "3vh";
    };
    const mainAnimation = animate(
      [
        [
          scope.current,
          {
            top: getTopValue(),
            scale: 1,
            opacity: 1,
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

    const backgroundAnimations = Promise.all([
      noiseAnimate(noiseRef.current, { opacity: 0 }, { duration: 3 }),
      gradientAnimate(gradientRef.current, { opacity: 1 }, { duration: 3 }),
    ]);

    const contentReveal = new Promise((resolve) => {
      setTimeout(() => {
        setAnimationDone(true);
        resolve();
      }, 750);
    });

    await Promise.all([mainAnimation, backgroundAnimations, contentReveal]);
    localStorage.setItem("hasSeenAnimation", "true");
  }

  useEffect(() => {
    const animateLogo = async () => {
      await new Promise((res) => setTimeout(res, 1000));

      await myAnimation();

      setAnimationDone(true);
    };
    if (skipAnimation) return;
    animateLogo();
  }, [controls]);

  const benefits = [
    {
      icon: "/assets/logo.png",
      title: "Profesjonalne słuchawki",
      desc: "Bezprzewodowe, wielokanałowe słuchawki z regulacją głośności i wygodnym pasem na głowę",
    },
    {
      icon: "/assets/logo.png",
      title: "3 kanały muzyczne",
      desc: "Różne gatunki muzyki prowadzone przez naszych DJ-ów: pop, rock i elektro",
    },
    {
      icon: "/assets/logo.png",
      title: "Efekty wizualne",
      desc: "Profesjonalne oświetlenie LED i efekty specjalne tworzące niepowtarzalny klimat",
    },
    {
      icon: "/assets/logo.png",
      title: "Obsługa techniczna",
      desc: "Nasz zespół techniczny czuwa nad płynnym przebiegiem imprezy 24/7",
    },
    {
      icon: "/assets/logo.png",
      title: "Pamiątkowy gadżet",
      desc: "Exclusive Silent Disco Pirates wristband dla każdego uczestnika",
    },
    {
      icon: "/assets/logo.png",
      title: "Bezpieczna przestrzeń",
      desc: "Strefa imprezy chroniona przez profesjonalną ochronę",
    },
  ];

  const faqItems = [
    {
      question: "Jak dokonać rezerwacji?",
      answer:
        "Rezerwacja składa się z 3 prostych kroków: 1) Wypełnij formularz rejestracyjny, 2) Otrzymasz e-mail z potwierdzeniem, 3) Dokonaj płatności online. Cały proces zajmuje mniej niż 5 minut!",
    },
    {
      question: "Czy mogę anulować rezerwację?",
      answer:
        "Tak, anulowanie jest możliwe do 48 godzin przed wydarzeniem. Zwrot środków następuje w ciągu 14 dni roboczych. Prosimy o kontakt na rezerwacje@silentdiscopiraci.pl",
    },
    {
      question: "Czy potrzebuję własnych słuchawek?",
      answer:
        "Nie, zapewniamy wysokiej jakości słuchawki bezprzewodowe z 3 kanałami muzycznymi. Możesz jednak zabrać własne słuchawki jeśli wolisz.",
    },
    {
      question: "Czy są jakieś ograniczenia wiekowe?",
      answer:
        "Impreza przeznaczona jest dla osób powyżej 18 roku życia. Wymagamy okazania dokumentu tożsamości przy wejściu.",
    },
    {
      question: "Co jeśli uszkodzę słuchawki?",
      answer:
        "Za przypadkowe uszkodzenie sprzętu pobieramy kaucję w wysokości 150 zł, która jest zwracana po oddaniu sprawnego zestawu.",
    },
    {
      question: "Czy można przyjść bez rejestracji?",
      answer:
        "Rejestracja online jest obowiązkowa. Nie prowadzimy sprzedaży biletów w dniu imprezy ze względu na ograniczoną liczbę słuchawek.",
    },
  ];

  return (
    <>
      {skipAnimation ? (
        <Menu2 />
      ) : (
        <>
          <MotionBox
            ref={noiseRef}
            initial={1}
            position="fixed"
            w="100%"
            h="100%"
            zIndex={1}
          >
            <NoiseBackground />
          </MotionBox>

          <MotionBox
            ref={gradientRef}
            initial={0}
            position="fixed"
            w="100%"
            h="100%"
            zIndex={0}
          >
            <GradientBackground />
          </MotionBox>

          <Box
            position="relative"
            zIndex={2}
            h="100vh"
            w="100vw"
            overflowX="hidden"
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
            {" "}
            <Box h={{ base: "2vh", md: "3vh" }} />
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
              boxSize={{ base: "15vh", md: "20vh" }}
              mx="auto"
              style={{
                objectFit: "contain",
              }}
            />
            {animationDone && (
              <VStack
                spacing={{ base: 8, md: 12 }}
                minH="100vh"
                overflow="visible"
                position="relative"
                align="stretch"
                w="100%"
                p={0}
                m={0}
              >
                <Box h={{ base: "15vh", md: "20vh" }} />
                <MotionContainer
                  maxW="container.md"
                  textAlign="center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  px={{ base: 4, md: 0 }}
                >
                  <Heading
                    as="h1"
                    fontSize={{ base: "2rem", sm: "2.5rem", md: "3rem" }}
                    color="white"
                    mb={{ base: 2, md: 4 }}
                  >
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

                  <Text
                    fontSize={{ base: "1.2rem", md: "1.5rem" }}
                    color="white"
                  >
                    Dobronianka, 22.08.2025 20:00
                  </Text>
                </MotionContainer>

                <Box w="100%" px={0}>
                  <MotionContainer
                    maxW="100%"
                    maxH="10%"
                    px={0}
                    marginTop={4}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    mx="auto"
                  >
                    <Slider />
                  </MotionContainer>
                </Box>
                <MotionContainer
                  maxW="container.lg"
                  py={{ base: 6, md: 8 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  px={{ base: 4, md: 0 }}
                  textAlign="center"
                  color="white"
                >
                  <VStack
                    spacing={{ base: 3, md: 4 }}
                    align="center"
                    mb={{ base: 6, md: 8 }}
                  >
                    <Heading
                      as="h3"
                      fontSize={{ base: "2.5rem", md: "4rem" }}
                      fontWeight="bold"
                      textAlign="center"
                    >
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

                    <Text fontSize={{ base: "1.1rem", md: "1.5rem" }}>
                      Wypełnij formularz i zarezerwuj miejsce na imprezie
                    </Text>

                    <Text
                      fontSize={{ base: "0.9rem", md: "1rem" }}
                      fontStyle="italic"
                    >
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
                      px={{ base: 8, md: 12 }}
                      py={{ base: 4, md: 5 }}
                      borderRadius="full"
                      fontSize={{ base: "1.2rem", md: "1.5rem" }}
                      bg="white"
                      color="black"
                      transition="all 0.3s ease"
                      position="relative"
                      _hover={{
                        color: "white",
                        bg: "rgba(255, 255, 255, 0)",
                        boxShadow: "lg",
                      }}
                    >
                      Zarezerwuj miejsce
                    </Button>
                  </ChakraLink>
                </MotionContainer>
                <MotionContainer
                  maxW={{ base: "90%", md: "85%" }}
                  py={{ base: 6, md: 8 }}
                  bg="transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  textAlign="left"
                  color="white"
                >
                  <Box mb={{ base: 8, md: 14 }}>
                    <Heading
                      as="h2"
                      size="lg"
                      mb={{ base: 4, md: 6 }}
                      fontSize={{ base: "2.5rem", md: "3.5rem" }}
                      bgGradient="linear-gradient(90deg, rgb(130, 70, 190), rgb(227,11,78), rgb(249,72,38))"
                      bgClip="text"
                      css={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Rezerwacja trzyetapowa
                    </Heading>

                    <Box
                      width={{ base: "100%", md: "70%", lg: "55%" }}
                      fontSize={{ base: "1.1rem", md: "1.3rem" }}
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Mauris consequat metus nec neque dignissim elementum. Sed
                      dapibus venenatis urna a aliquam.
                    </Box>
                  </Box>

                  <VStack
                    spacing={{ base: 12, md: 20 }}
                    align="flex-start"
                    pl={{ base: 0, md: 14 }}
                  >
                    {[1, 2, 3].map((step) => (
                      <Box key={step}>
                        <Heading
                          as="h3"
                          mb={0.5}
                          fontSize={{ base: "0.8rem", md: "0.9rem" }}
                          color="gray.300"
                        >
                          {step}. Krok{" "}
                          {step === 1
                            ? "pierwszy"
                            : step === 2
                            ? "drugi"
                            : "trzeci"}
                        </Heading>
                        <Text
                          fontWeight="bold"
                          mb={2}
                          fontSize={{ base: "1.8rem", md: "2.5rem" }}
                        >
                          Wypełnij formularz!
                        </Text>
                        <Box
                          width={{ base: "100%", md: "70%", lg: "55%" }}
                          fontSize={{ base: "1rem", md: "1.1rem" }}
                        >
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Mauris consequat metus nec neque dignissim
                          elementum.
                        </Box>
                      </Box>
                    ))}
                  </VStack>
                </MotionContainer>
                <MotionContainer
                  maxW={{ base: "90%", md: "85%" }}
                  py={{ base: 6, md: 8 }}
                  bg="transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  textAlign="center"
                  color="white"
                >
                  <Box mb={{ base: 6, md: 8 }}>
                    <Heading
                      as="h2"
                      size="lg"
                      mb={{ base: 4, md: 6 }}
                      fontSize={{ base: "2.5rem", md: "3.5rem" }}
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
                      fontSize={{ base: "1.1rem", md: "1.3rem" }}
                      color="whiteAlpha.700"
                      fontStyle="italic"
                      mb={{ base: 8, md: 12 }}
                    >
                      Poznaj wyjątkowe doświadczenie imprezy w zupełnie nowym
                      wymiarze
                    </Text>

                    <Box
                      maxW="800px"
                      mx="auto"
                      fontSize={{ base: "1rem", md: "1.2rem" }}
                      lineHeight="1.8"
                      textAlign="center"
                    >
                      <Text mb={{ base: 4, md: 6 }}>
                        TUTAJ BEDA SZCZEGOLY WYDARZENIA Z JAKIMS WPROWADZENIEM
                      </Text>
                      <Text mb={{ base: 4, md: 6 }}>
                        Silent Disco to rewolucyjna forma rozrywki, gdzie
                        uczestnicy tańczą w słuchawkach, każdy wybierając swój
                        ulubiony kanał muzyczny.
                      </Text>
                    </Box>
                  </Box>
                </MotionContainer>
                <MotionContainer
                  maxW={{ base: "90%", md: "85%" }}
                  py={{ base: 6, md: 10 }}
                  bg="transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  textAlign="center"
                  color="white"
                >
                  <Box mb={{ base: 8, md: 16 }}>
                    <Heading
                      as="h2"
                      mb={{ base: 4, md: 6 }}
                      fontSize={{ base: "2.5rem", md: "3.5rem" }}
                      bgGradient="linear-gradient(90deg, rgb(130, 70, 190), rgb(227,11,78), rgb(249,72,38))"
                      bgClip="text"
                      css={{
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Co jest w cenie?
                    </Heading>

                    <Text
                      fontSize={{ base: "1.1rem", md: "1.3rem" }}
                      color="whiteAlpha.700"
                      mb={{ base: 8, md: 16 }}
                    >
                      Pełen pakiet rozrywki za jednym zamówieniem
                    </Text>

                    <SimpleGrid
                      columns={{ base: 1, sm: 2, md: 3 }}
                      spacing={{ base: 6, md: 8 }}
                      maxW="1200px"
                      mx="auto"
                    >
                      {benefits.map((item, index) => (
                        <Box
                          key={index}
                          p={{ base: 4, md: 6 }}
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
                            boxSize={{ base: "60px", md: "80px" }}
                            mx="auto"
                            mb={{ base: 4, md: 6 }}
                          />
                          <Heading
                            as="h3"
                            fontSize={{ base: "1.4rem", md: "1.8rem" }}
                            mb={{ base: 3, md: 4 }}
                            bgGradient="linear-gradient(90deg, rgb(130, 70, 190), rgb(227,11,78))"
                            bgClip="text"
                          >
                            {item.title}
                          </Heading>
                          <Text
                            fontSize={{ base: "0.9rem", md: "1.1rem" }}
                            color="whiteAlpha.800"
                          >
                            {item.desc}
                          </Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                </MotionContainer>
                <MotionContainer
                  maxW={{ base: "90%", md: "85%" }}
                  py={{ base: 6, md: 8 }}
                  bg="transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  textAlign="left"
                  color="white"
                  px={{ base: 4, md: 0 }}
                >
                  <Box mb={{ base: 8, md: 14 }} textAlign="left">
                    <Heading
                      as="h2"
                      mb={{ base: 4, md: 6 }}
                      fontSize={{ base: "2.5rem", md: "3.5rem" }}
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
                      fontSize={{ base: "1.1rem", md: "1.3rem" }}
                    >
                      Nie znalazłeś odpowiedzi? Skontaktuj się z nami!
                    </Box>
                  </Box>
                  <Box textAlign="left">
                    {faqItems.map((item, index) => (
                      <Box
                        key={index}
                        borderBottom="1px solid"
                        borderColor="whiteAlpha.300"
                        py={{ base: 4, md: 6 }}
                      >
                        <Accordion allowToggle>
                          <AccordionItem border="none">
                            {({ isExpanded }) => (
                              <>
                                <AccordionButton
                                  px={0}
                                  _hover={{ bg: "transparent" }}
                                  _focus={{ boxShadow: "none" }}
                                  justifyContent="space-between"
                                >
                                  <Box flex="1" textAlign="left">
                                    <Heading
                                      as="h3"
                                      fontSize={{
                                        base: "1.4rem",
                                        md: "1.8rem",
                                      }}
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
                                    fontSize="1.5rem"
                                    ml={4}
                                    transform={
                                      isExpanded ? "rotate(180deg)" : "none"
                                    }
                                    transition="transform 0.2s"
                                  />
                                </AccordionButton>

                                <AccordionPanel
                                  pb={4}
                                  px={0}
                                  textAlign="left"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{
                                    opacity: isExpanded ? 1 : 0,
                                    height: isExpanded ? "auto" : 0,
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Text
                                    fontSize={{ base: "1rem", md: "1.2rem" }}
                                    color="whiteAlpha.800"
                                    maxW={{ base: "100%", md: "70%" }}
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
            )}
          </Box>
        </>
      )}{" "}
    </>
  );
};

export default Menu;
