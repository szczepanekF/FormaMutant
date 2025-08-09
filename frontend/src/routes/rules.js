import {
  Text,
  Heading,
  OrderedList,
  VStack,
  Container,
  ListItem,
  Image,
  Box,
  Button,
} from "@chakra-ui/react";
import GradientBackground from "../components/gradientBackground";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
const Rules = () => {
  const nav = useNavigate();
  const rules = [
    {
      title: "Informacje ogólne",
      body: `Impreza Silent Disco Planeta Luzu jest wydarzeniem prywatnym, organizowanym przez osobę fizyczną – Wiktorię Kirsz (dalej: Organizator).
      Wydarzenie ma charakter zamknięty – udział w imprezie jest możliwy wyłącznie po wcześniejszej rejestracji przez formularz online oraz otrzymaniu potwierdzenia udziału.
      Impreza odbędzie się w określonym miejscu i terminie podanym uczestnikom drogą elektroniczną po rejestracji.
      Niniejszy regulamin ma na celu zapewnienie bezpieczeństwa i komfortu wszystkim uczestnikom.`,
    },
    {
      title: "Uczestnictwo",
      body: `Uczestnikiem imprezy może być wyłącznie osoba, która:
    \u00A0 \u00A0 \u00A0 \u00A0a) ukończyła 18 lat (lub uczestniczy za zgodą i pod opieką osoby dorosłej),
    \u00A0 \u00A0 \u00A0 \u00A0b) zarejestrowała się przez stronę internetową,
    \u00A0 \u00A0 \u00A0 \u00A0c) zaakceptowała regulamin i politykę prywatności,
    \u00A0 \u00A0 \u00A0 \u00A0d) otrzymała potwierdzenie udziału.
Organizator zastrzega sobie prawo do odmowy udziału osobie, która nie spełnia powyższych warunków.`,
    },
    {
      title: "Zasady podczas wydarzenia",
      body: `Uczestnicy zobowiązani są do:
    \u00A0 \u00A0 \u00A0 \u00A0a) zachowania kultury osobistej i szacunku wobec innych,
    \u00A0 \u00A0 \u00A0 \u00A0b) nieprzeszkadzania innym w odbiorze wydarzenia,
    \u00A0 \u00A0 \u00A0 \u00A0c) przestrzegania przepisów porządkowych obowiązujących w miejscu imprezy.
Zabrania się:
    \u00A0 \u00A0 \u00A0 \u00A0a) wnoszenia środków odurzających i nielegalnych substancji,
    \u00A0 \u00A0 \u00A0 \u00A0b) agresywnego, głośnego lub niebezpiecznego zachowania,
    \u00A0 \u00A0 \u00A0 \u00A0c) dewastacji sprzętu (w tym słuchawek) lub wyposażenia miejsca imprezy.`,
    },
    {
      title: "Odpowiedzialność",
      body: `Uczestnik ponosi odpowiedzialność finansową za celowe uszkodzenie sprzętu lub wyposażenia (w tym słuchawek). W przypadku uszkodzenia lub zagubienia słuchawek obowiązuje opłata w wysokości 800 zł za sztukę. 
Organizator nie ponosi odpowiedzialności za rzeczy pozostawione bez nadzoru ani za skutki działań uczestników niezgodnych z regulaminem.
Udział w wydarzeniu odbywa się na własną odpowiedzialność uczestnika.`,
    },
    {
      title: "Sprzęt i słuchawki",
      body: `Podczas wydarzenia uczestnikom zostaną wypożyczone słuchawki niezbędne do udziału w Silent Disco.
Warunkiem otrzymania słuchawek jest okazanie kodu QR otrzymanego drogą elektroniczną po zatwierdzeniu rejestracji przez Organizatora.
Uczestnik zobowiązany jest do zwrotu słuchawek w nienaruszonym stanie po zakończeniu imprezy.`,
    },
    {
      title: "Rejestracja danych i prywatność",
      body: `Podczas rejestracji zbierane są dane osobowe uczestników (np. imię, adres e-mail, numer telefonu) wyłącznie w celu organizacji wydarzenia.
Szczegóły dotyczące przetwarzania danych osobowych znajdują się w Polityce Prywatności dostępnej na stronie głównej wydarzenia.
Rejestracja i udział w wydarzeniu oznaczają akceptację tego regulaminu oraz polityki prywatności.`,
    },
    {
      title: "Zmiany i kontakt",
      body: `Organizator zastrzega sobie prawo do wprowadzenia zmian w regulaminie oraz harmonogramie imprezy – uczestnicy zostaną o tym poinformowani mailowo lub na stronie wydarzenia.
Wszelkie pytania można kierować do Organizatora na adres e-mail planetaluzu.sd@gmail.com `,
    },
  ];

  return (
    <>
      <Box initial={1} position="fixed" w="100%" h="100%" zIndex={1}>
        <GradientBackground />
      </Box>

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
          <Box h={{ base: "3vh", md: "5vh" }} />

          <Container
            maxW="container.md"
            textAlign="center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            px={{ base: 4, md: 0 }}
          >
            <Heading
              fontSize={{ base: "1.8rem", sm: "2.2rem", md: "2.7rem" }}
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
              Regulamin Imprezy Silent Disco
            </Heading>
          </Container>

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
              <OrderedList listStyleType="none" spacing={4} color="white">
                {rules.map((item, i) => (
                  <ListItem key={i} mb={4}>
                    <Text as="span" fontWeight="bold">
                      §{i + 1}. {item.title}
                      <Text
                        as="span"
                        fontWeight="normal"
                        display="block"
                        mt={1}
                        whiteSpace="pre-line"
                      >
                        {item.body}
                      </Text>
                    </Text>
                  </ListItem>
                ))}
              </OrderedList>
            </Box>
          </Container>

          <Container
            maxW="container.md"
            px={{ base: 4, md: 0 }}
            mb={{ base: 6, md: 8 }}
          >
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

export default Rules;
