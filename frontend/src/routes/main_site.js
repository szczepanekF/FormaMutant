import React, { useEffect, useState } from "react";
import { Box, Container, VStack, Heading, Text, Image } from "@chakra-ui/react";
import { motion, useAnimation, useAnimate } from "framer-motion";
import Slider from "../components/swiper";
import NoiseBackground from "../components/noiseBackground";
import GradientBackground from "../components/gradientBackground";
import CurvedTextComponent from "../components/curvedTextComponent";

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
    await animate(
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
    // Rozpocznij równolegle:
    // 1. Animację przejścia tła
    // 2. Timer do pokazania zawartości
    await Promise.all([
      // Animacja tła
      Promise.all([
        noiseAnimate(noiseRef.current, { opacity: 0 }, { duration: 0.7 }),
        gradientAnimate(gradientRef.current, { opacity: 1 }, { duration: 0.7 }),
      ]),
      // Timer do pokazania zawartości (50% czasu animacji tła)
      new Promise((resolve) =>
        setTimeout(() => {
          setAnimationDone(true);
          resolve();
        }, 300)
      ), // 0.4s to około połowa czasu animacji tła
    ]);
  }

  useEffect(() => {
    const animateLogo = async () => {
      await new Promise((res) => setTimeout(res, 1000)); // tylko Noise przez 1s

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
          boxSize="18vh"
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
              <Heading as="h1" size="xl" mb={4}>
                Witamy na naszej stronie!
              </Heading>
              <Text fontSize="lg">
                Tu znajdziesz wyjątkowe treści, zdjęcia i więcej.
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
              // border ="50px solid"
            >
              <Heading as="h2" size="lg" mb={4}>
                Kim jesteśmy?
              </Heading>
              <Text>
                Jesteśmy pasjonatami, którzy tworzą niesamowite rzeczy z pasją i
                zaangażowaniem...
              </Text>
            </MotionContainer>

            {/* Blok tekstowy #2 */}
            <MotionContainer
              maxW="container.lg"
              py={8}
              bg="gray.50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Heading as="h2" size="lg" mb={4}>
                Nasza misja
              </Heading>
              <Text>
                Pragniemy inspirować, uczyć i dzielić się tym, co najlepsze...
              </Text>
            </MotionContainer>
            <MotionContainer
              maxW="container.lg"
              py={8}
              bg="gray.50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Heading as="h2" size="lg" mb={4}>
                Nasza misja
              </Heading>
              <Text>
                Pragniemy inspirować, uczyć i dzielić się tym, co najlepsze...
              </Text>
            </MotionContainer>
            <MotionContainer
              maxW="container.lg"
              py={8}
              bg="gray.50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Heading as="h2" size="lg" mb={4}>
                Nasza misja
              </Heading>
              <Text>
                Pragniemy inspirować, uczyć i dzielić się tym, co najlepsze...
              </Text>
            </MotionContainer>
            <MotionContainer
              maxW="container.lg"
              py={8}
              bg="gray.50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Heading as="h2" size="lg" mb={4}>
                Nasza misja
              </Heading>
              <Text>
                Pragniemy inspirować, uczyć i dzielić się tym, co najlepsze...
              </Text>
            </MotionContainer>

            {/* Footer */}
            <MotionBox
              as="footer"
              py={6}
              textAlign="center"
              bg="gray.100"
              mt="auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <Text fontSize="sm">
                © 2025 Twoja Firma. Wszelkie prawa zastrzeżone.
              </Text>
            </MotionBox>
          </VStack>
        )}
      </Box>
    </>
  );
};

export default Menu;
