import React, { useState } from "react";
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  Button,
  VStack,
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
      mt={12}
      p={6}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
    >
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Numer słuchawek</FormLabel>
          <Input
            value={itemNumber}
            onChange={(e) => setItemNumber(e.target.value)}
            placeholder="Wpisz numer słuchawek"
            isDisabled={!!userData}
          />
          <Button mt={2} onClick={handleFetch} isDisabled={!!userData}>
            Pobierz dane
          </Button>
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
              <FormLabel>Status słuchawek</FormLabel>
              <RadioGroup onChange={setSelectedState} value={selectedState}>
                <Stack spacing={3}>
                  <Radio value="zwrócone">Zwrócone</Radio>
                  <Radio value="zgubione">Zgubione</Radio>
                  <Radio value="uszkodzone">Uszkodzone</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <Box display="flex" justifyContent="space-between">
              <Button colorScheme="blue" onClick={handleSubmit}>
                Zapisz zmiany
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

export default AdminNumberLookup;
