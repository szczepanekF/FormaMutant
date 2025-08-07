import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Button,
  VStack,
  SimpleGrid,
  Spinner,
  Text,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { set_item_number } from "../endpoints/api";
import { useAuth } from "../context/auth";
import { toast } from "sonner";
import { useItemsContext } from "../context/itemsContext";

const AdminTokenLookup = ({showToast}) => {
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const [numberValue, setNumberValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { withRefresh } = useAuth();
  const [shouldRefocusToken, setShouldRefocusToken] = useState(false);
  const { updateItemStateByToken, getAccountByItem } = useItemsContext();

  const numberInputRef = useRef(null);
  const tokenInputRef = useRef(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const res = await getAccountByItem(token);
      setUserData(res);
      setLoading(false);
    };
    const run = async () => {
      if (token.length === 32) {
        setLoading(true);
        await withRefresh(fetchUserData, () => {
          setLoading(false);
          setUserData(null);
        });
      }
    };
    run();
  }, [token]);

  useEffect(() => {
    tokenInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (userData) {
      // Delay focus to ensure component has mounted
      setTimeout(() => {
        numberInputRef.current?.focus();
      }, 0);
    }
  }, [userData]);
  const handleCancel = () => {
    setToken("");
    setUserData(null);
    setNumberValue("");
  };

  const handleSubmit = async () => {
    await withRefresh(
      async () => {
        let form = { state: "wydane", number: parseInt(numberValue) };
        await set_item_number(form, token);
        updateItemStateByToken(token, "wydane");
        handleCancel();
        setShouldRefocusToken(true);
        // toast.success("Pomyślnie przypisano słuchawki");
        // setShowCustomToast(true);
        showToast("success","Pomyślnie przypisano słuchawki");
      },
      () => {
        console.log("error");
      }
    );
  };
  useEffect(() => {
    if (shouldRefocusToken && !userData && token === "") {
      tokenInputRef.current?.focus();
      setShouldRefocusToken(false);
    }
  }, [shouldRefocusToken, userData, token]);
  return (
    <>
      <Box
        maxW="2xl"
        mx="auto"
        mt={8}
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
            <Box textAlign="center" py={10}>
              <Spinner size="xl" color="pink.200" thickness="3px" />
              <Text color="whiteAlpha.700" mt={4}>
                Ładowanie danych...
              </Text>
            </Box>
          ) : (
            <>
              <FormControl mb={6}>
                <FormLabel color="whiteAlpha.800">Token przedmiotu</FormLabel>
                <Input
                  ref={tokenInputRef}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  isDisabled={!!userData}
                  placeholder="Wklej token (32 znaki)"
                  maxLength={32}
                  color="white"
                  bg="rgba(255, 255, 255, 0.05)"
                  borderColor="rgba(255, 255, 255, 0.2)"
                  _hover={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
                  _focus={{
                    borderColor: "rgba(227, 11, 78, 0.8)",
                    boxShadow: "0 0 0 1px rgba(227, 11, 78, 0.5)",
                  }}
                />
              </FormControl>

              {userData && (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
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

                  <FormControl isReadOnly>
                    <FormLabel color="whiteAlpha.800">Email</FormLabel>
                    <Input
                      value={userData.email}
                      color="whiteAlpha.800"
                      bg="rgba(255, 255, 255, 0.03)"
                      borderColor="rgba(255, 255, 255, 0.1)"
                    />
                  </FormControl>

                  <FormControl isReadOnly>
                    <FormLabel color="whiteAlpha.800">Numer telefonu</FormLabel>
                    <Input
                      value={userData.phone_number}
                      color="whiteAlpha.800"
                      bg="rgba(255, 255, 255, 0.03)"
                      borderColor="rgba(255, 255, 255, 0.1)"
                    />
                  </FormControl>

                  <FormControl gridColumn={{ md: "1 / -1" }}>
                    <FormLabel color="whiteAlpha.800">
                      Numer słuchawek
                    </FormLabel>
                    <NumberInput
                      value={numberValue}
                      onChange={(val) => setNumberValue(val)}
                    >
                      <NumberInputField
                        ref={numberInputRef}
                        color="white"
                        bg="rgba(255, 255, 255, 0.05)"
                        borderColor="rgba(255, 255, 255, 0.2)"
                        _hover={{ borderColor: "rgba(255, 255, 255, 0.4)" }}
                        _focus={{
                          borderColor: "rgba(227, 11, 78, 0.8)",
                          boxShadow: "0 0 0 1px rgba(227, 11, 78, 0.5)",
                        }}
                      />
                    </NumberInput>
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
                      Przypisz
                    </Button>
                  </Box>
                </SimpleGrid>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AdminTokenLookup;
