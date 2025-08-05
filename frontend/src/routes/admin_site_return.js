import React, { useState } from "react";
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Button,
  VStack,
  Spinner,
  SimpleGrid,
  Text,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { change_item_state } from "../endpoints/api";
import { useItemsContext } from "../context/itemsContext";
import { useAuth } from "../context/auth";
import { toast } from "sonner";

const AdminNumberLookup = () => {
  const [itemNumber, setItemNumber] = useState("");
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState("");
  const [selectedState, setSelectedState] = useState("zwrócone");
  const [loading, setLoading] = useState(false);
  const { withRefresh } = useAuth();
  const { getAccountForNumber } = useItemsContext();
  const handleFetch = async () => {
    await withRefresh(
      async () => {
        setLoading(true);
        const res = await getAccountForNumber(itemNumber);
        setUserData(res);
        setToken(res.token);
        setLoading(false);
      },
      () => {
        console.log("error");
        setUserData(null);
        setToken("");
        setLoading(false);
      }
    );
  };

  const handleCancel = () => {
    setItemNumber("");
    setUserData(null);
    setToken("");
    setSelectedState("zwrócone");
  };

  // const handleSubmit = async () => {
  //   await change_item_state(selectedState, token);
  //   handleCancel();
  // };

  const handleSubmit = async () => {
    await withRefresh(
      async () => {
        await change_item_state(selectedState, token);
        handleCancel();
        toast.success("Pomyślnie odebrano słuchawki");
      },
      () => {
        console.log("error");
      }
    );
  };

  return (
    <Box
      maxW="lg"
      mx="auto"
      mt={0}
      p={6}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: "lg",
        padding: "2px",
        // background:
        //   "linear-gradient(90deg, rgba(130, 70, 190, 0.8), rgba(227, 11, 78, 0.8))",
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        pointerEvents: "none",
      }}
    >
      <Box
        bg="linear-gradient(to bottom, rgb(20, 10, 30), #0d0d0d)"
        border="1px solid rgba(255, 255, 255, 0.1)"
        borderRadius="lg"
        p={6}
      >
        {loading ? (
          <Box textAlign="center" py={4}>
            <Spinner size="md" color="pink.200" thickness="3px" />
            <Text color="whiteAlpha.700" mt={2}>
              Ładowanie danych...
            </Text>
          </Box>
        ) : (
          <VStack spacing={5} align="stretch">
            <FormControl>
              <FormLabel color="whiteAlpha.800">Numer słuchawek</FormLabel>
              <Box display="flex" gap={3}>
                <Input
                  value={itemNumber}
                  onChange={(e) => setItemNumber(e.target.value)}
                  placeholder="Wpisz numer słuchawek"
                  isDisabled={!!userData}
                  color="white"
                  bg="rgba(255, 255, 255, 0.05)"
                  borderColor="rgba(255, 255, 255, 0.2)"
                  _hover={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
                  _focus={{
                    borderColor: "rgba(227, 11, 78, 0.8)",
                    boxShadow: "0 0 0 1px rgba(227, 11, 78, 0.5)",
                  }}
                  flex="1"
                />
                <Button
                  onClick={handleFetch}
                  isDisabled={!!userData}
                  bgGradient="linear(to-r, rgb(130, 70, 190), rgb(227,11,78))"
                  color="white"
                  _hover={{
                    bgGradient:
                      "linear(to-r, rgb(130, 70, 190), rgb(249,72,38))",
                    transform: "translateY(-2px)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  minW="120px"
                >
                  Pobierz dane
                </Button>
              </Box>
            </FormControl>

            {userData && (
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
                <FormControl isReadOnly>
                  <FormLabel color="whiteAlpha.800">Imię</FormLabel>
                  <Input
                    value={userData.first_name}
                    color="pink.200"
                    bg="rgba(255, 255, 255, 0.03)"
                    borderColor="rgba(255, 255, 255, 0.1)"
                  />
                </FormControl>

                <FormControl isReadOnly>
                  <FormLabel color="whiteAlpha.800">Nazwisko</FormLabel>
                  <Input
                    value={userData.last_name}
                    color="pink.200"
                    bg="rgba(255, 255, 255, 0.03)"
                    borderColor="rgba(255, 255, 255, 0.1)"
                  />
                </FormControl>

                <FormControl isReadOnly gridColumn={{ md: "1 / -1" }}>
                  <FormLabel color="whiteAlpha.800">Email</FormLabel>
                  <Input
                    value={userData.email}
                    color="whiteAlpha.800"
                    bg="rgba(255, 255, 255, 0.03)"
                    borderColor="rgba(255, 255, 255, 0.1)"
                  />
                </FormControl>

                <FormControl isReadOnly gridColumn={{ md: "1 / -1" }}>
                  <FormLabel color="whiteAlpha.800">Numer telefonu</FormLabel>
                  <Input
                    value={userData.phone_number}
                    color="whiteAlpha.800"
                    bg="rgba(255, 255, 255, 0.03)"
                    borderColor="rgba(255, 255, 255, 0.1)"
                  />
                </FormControl>

                <FormControl gridColumn={{ md: "1 / -1" }} pt={2}>
                  <FormLabel color="whiteAlpha.800">Status słuchawek</FormLabel>
                  <RadioGroup onChange={setSelectedState} value={selectedState}>
                    <Stack spacing={3}>
                      <Radio
                        value="zwrócone"
                        colorScheme="green"
                        color="whiteAlpha.800"
                      >
                        Zwrócone
                      </Radio>
                      <Radio
                        value="zgubione"
                        colorScheme="red"
                        color="whiteAlpha.800"
                      >
                        Zgubione
                      </Radio>
                      <Radio
                        value="uszkodzone"
                        colorScheme="orange"
                        color="whiteAlpha.800"
                      >
                        Uszkodzone
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <Box
                  gridColumn={{ md: "1 / -1" }}
                  display="flex"
                  justifyContent="flex-end"
                  gap={4}
                  pt={4}
                >
                  <Button
                    bg="rgba(255, 255, 255, 0.15)"
                    color="white"
                    backdropFilter="blur(4px)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    _hover={{
                      bg: "rgba(255, 255, 255, 0.25)",
                      borderColor: "rgba(255, 255, 255, 0.4)",
                    }}
                    onClick={handleCancel}
                    minW="120px"
                  >
                    Anuluj
                  </Button>

                  <Button
                    bgGradient="linear(to-r, rgb(130, 70, 190), rgb(227,11,78))"
                    color="white"
                    _hover={{
                      bgGradient:
                        "linear(to-r, rgb(130, 70, 190), rgb(249,72,38))",
                      transform: "translateY(-2px)",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    onClick={handleSubmit}
                    minW="120px"
                  >
                    Zapisz zmiany
                  </Button>
                </Box>
              </SimpleGrid>
            )}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default AdminNumberLookup;
