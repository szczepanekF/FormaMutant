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
      <Box
        position="fixed"
        top="20px"
        left="20px"
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
          maxH="100px"
          onClick={() => nav("/menu")}
          cursor="pointer"
        />
      </Box>
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
          minH="100vh" // Zapewnia odpowiednią wysokość
          overflow="visible"
          position="relative"
          align="stretch"
          w="100%" // ZMIANA: z 100vw na 100%
          p={0} // Zapewnia brak paddingu
          m={0} // Zapewnia brak marginesu
        >
          <Box h="5vh" />

          <Container
            maxW="container.md"
            textAlign="center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            px={0}
          >
            <Heading
              fontSize="2.7rem"
              color="white"
              mb={8}
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
          <Container
            maxW="container.md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            px={0}
          >
            <Box
              w="100%"
              position="relative"
              p={8}
              rounded="lg"
              zIndex={1}
              sx={{
                background:
                  "linear-gradient(135deg, rgba(130, 70, 190, 0.15), rgba(227, 11, 78, 0.15))",
                backdropFilter: "blur(8px)",
                mb: 8,
              }}
            >
              <OrderedList spacing={4} color="white">
                {[...Array(10)].map((_, i) => (
                  <ListItem key={i} mb={4}>
                    <Text as="span" fontWeight="bold">
                      {i + 1}. Punkt polityki RODO
                      fdsfdsfdsfsdffdsfdsfdsfsdffdsfdsfdsfsdffdsfdsfdsfsdffdsfdsfdsfsdffdsfdsfdsfsdffdsfdsfdsfsdffdsfdsfdsfsdffdsfdsfdsfsdf
                    </Text>
                  </ListItem>
                ))}
              </OrderedList>
            </Box>
          </Container>
          <Container maxW="container.md" px={0}>
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
              h="50px" // stała wysokość
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
              fontWeight="bold"
              transition="all 0.2s"
            >
              Powrót na stronę główną
            </Button>
          </Container>
          <Footer />
        </VStack>
      </Box>
    </>
  );
};

export default Rodo;
