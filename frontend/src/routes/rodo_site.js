import {
  Text,
  Heading,
  OrderedList,
  VStack,
  Container,
  ListItem,
  Link,
  Box,
  Image,
  Button,
} from "@chakra-ui/react";
import GradientBackground from "../components/gradientBackground";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
const Rodo = () => {
  const nav = useNavigate();
  return (
    <>
      <Box initial={1} position="fixed" w="100%" h="100%" zIndex={1}>
        <GradientBackground />
      </Box>

      {/* Logo */}
      <Box
        position="fixed"
        top={{ base: "10px", md: "20px" }}
        left={{ base: "10px", md: "20px" }}
        zIndex={3}
        p={2}
        bg="rgba(255, 255, 255, 0)"
        borderRadius="md"
        backdropFilter="blur(4px)"
        _hover={{
          bg: "rgba(255, 255, 255, 0)",
        }}
      >
        <Image
          src="/assets/logo.png"
          alt="Logo"
          maxH={{ base: "70px", md: "100px" }}
          onClick={() => nav("/menu")}
          cursor="pointer"
        />
      </Box>

      {/* Główna zawartość */}
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
        <VStack
          spacing={0}
          minH="100vh"
          overflow="visible"
          position="relative"
          align="stretch"
          w="100%"
          p={0}
          m={0}
        >
          {/* Odstęp na górze */}
          <Box h={{ base: "3vh", md: "5vh" }} />

          {/* Nagłówek */}
          <Container
            maxW="container.md"
            textAlign="center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            px={{ base: 4, md: 0 }}
          >
            <Heading
              fontSize={{ base: "2rem", md: "2.7rem" }}
              color="white"
              mb={{ base: 6, md: 8 }}
              zIndex={1}
              sx={{
                background:
                  "linear-gradient(90deg, rgb(130, 70, 190), rgb(227,11,78), rgb(249,72,38))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              Polityka Prywatności RODO
            </Heading>
          </Container>

          {/* Treść polityki */}
          <Container
            maxW="container.md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            px={{ base: 4, md: 0 }}
          >
            <Box
              w="100%"
              position="relative"
              p={{ base: 4, md: 8 }}
              rounded="lg"
              zIndex={1}
              sx={{
                background:
                  "linear-gradient(135deg, rgba(130, 70, 190, 0.15), rgba(227, 11, 78, 0.15))",
                backdropFilter: "blur(8px)",
                mb: { base: 6, md: 8 },
              }}
            >
              <OrderedList spacing={4} color="white">
                {[...Array(10)].map((_, i) => (
                  <ListItem key={i} mb={4}>
                    <Text as="span" fontWeight="bold">
                      {i + 1}. Punkt polityki RODO
                      <Text
                        as="span"
                        fontWeight="normal"
                        display="block"
                        mt={2}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam in dui mauris. Vivamus hendrerit arcu sed erat
                        molestie vehicula. Sed auctor neque eu tellus rhoncus ut
                        eleifend nibh porttitor. Ut in nulla enim. Phasellus
                        molestie magna non est bibendum non venenatis nisl
                        tempor.
                      </Text>
                    </Text>
                  </ListItem>
                ))}
              </OrderedList>
            </Box>
          </Container>

          {/* Przycisk powrotu */}
          <Container maxW="container.md" px={{ base: 4, md: 0 }}>
            <Button
              onClick={() => nav("/menu")}
              w="100%"
              bg="rgba(255, 255, 255, 0.15)"
              color="white"
              backdropFilter="blur(4px)"
              border="1px solid rgba(255, 255, 255, 0.2)"
              _hover={{
                bg: "rgba(255, 255, 255, 0.25)",
                borderColor: "rgba(255, 255, 255, 0.4)",
              }}
              h="50px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
              fontWeight="bold"
              transition="all 0.2s"
              mb={{ base: 6, md: 8 }}
            >
              Powrót na stronę główną
            </Button>
          </Container>

          {/* Stopka */}
          <Footer />
        </VStack>
      </Box>
    </>
  );
};

export default Rodo;
