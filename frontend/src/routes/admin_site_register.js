import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Button,
  VStack,
  Text,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { getAccountForItem, set_item_number } from "../endpoints/api";
import { useAuth } from "../context/auth";
const AdminTokenLookup = () => {
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const [numberValue, setNumberValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { withRefresh, witheErrorHandler } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
        const res = await getAccountForItem(token);
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
        handleCancel();
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
      mt={12}
      p={6}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
    >
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Token przedmiotu</FormLabel>
          <Input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            isDisabled={!!userData}
            placeholder="Wklej token (32 znaki)"
            maxLength={32}
          />
        </FormControl>

        {userData && (
          <>
            <FormControl isReadOnly>
              <FormLabel>Imię</FormLabel>
              <Input value={userData.first_name} />
            </FormControl>
            <FormControl isReadOnly>
              <FormLabel>Nazwisko</FormLabel>
              <Input value={userData.last_name} />
            </FormControl>
            <FormControl isReadOnly>
              <FormLabel>Email</FormLabel>
              <Input value={userData.email} />
            </FormControl>
            <FormControl isReadOnly>
              <FormLabel>Numer telefonu</FormLabel>
              <Input value={userData.phone_number} />
            </FormControl>

            <FormControl>
              <FormLabel>Liczba (np. sztuk, dni, itd.)</FormLabel>
              <NumberInput
                value={numberValue}
                onChange={(val) => setNumberValue(val)}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <Box display="flex" justifyContent="space-between">
              <Button colorScheme="blue" onClick={handleSubmit}>
                Wyślij
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Anuluj
              </Button>
            </Box>
          </>
        )}

        {loading && <Text>Ładowanie danych...</Text>}
      </VStack>
    </Box>
  );
};

export default AdminTokenLookup;
