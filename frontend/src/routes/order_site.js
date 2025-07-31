import {
  FormControl,
  FormLabel,
  Input,
  Button,
  useDisclosure,
  FormErrorMessage,
  Text,
  Flex,
  Stack,
  Modal,
  Heading,
  Box,
  Checkbox,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import React from "react";
// import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { order_creation } from "../endpoints/api";
import { useAuth } from "../context/auth";
import { toast } from "sonner";

const Order = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    number_of_headphones: "1",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { withErrorHandler } = useAuth();

  const reset = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      number_of_headphones: "1",
      agreeTerms: false,
    });
    setLoading(false);
    onClose();
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = "Wprowadź imię";
    if (!formData.last_name.trim()) newErrors.last_name = "Wprowadź nazwisko";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Wprowadź poprawny adres email";
    if (
      !formData.phone_number ||
      !/^\d{3}\s\d{3}\s\d{3}$/.test(formData.phone_number)
    )
      newErrors.phone_number = "Numer telefonu musi mieć 9 cyfr";
    if (!formData.agreeTerms)
      newErrors.agreeTerms = "Zatwierdzenie regulaminu jest wymagane";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onOpen();
    }
  };
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const formatPhone = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 9);
    return digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  };

  const handleCreateUser = async () => {
    await withErrorHandler(
      async () => {
        setLoading(true);
        const user = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_number: formData.phone_number.replace(/\s+/g, ""),
        };
        const amount = 1; //formData.number_of_headphones;
        const response = await order_creation(user, amount);
        reset();
        setLoading(false);
        toast.success("Pomyślnie utworzono rezerwacje");
      },
      () => {
        setLoading(false);
      }
    );
  };

  const fieldMap = {
    first_name: "Imię",
    last_name: "Nazwisko",
    email: "Email",
    phone_number: "Numer telefonu",
  };

  return (
    <Flex
      minH={"100%"}
      maxW={"100%"}
      align={"center"}
      justify={"center"}
      bg="#DAE3E5"
      flex="1"
    >
      <Stack
        spacing={2}
        display={"flex"}
        align={"center"}
        justify={"center"}
        width={"600px"}
        height="100%"
        maxW={"100%"}
        py={5}
        //  border="4px solid black"
      >
        {/* <Stack align={"center"}>
          <Heading fontSize={"4xl"} color="#04080F">
            Create user
          </Heading>
        </Stack> */}
        <Box
          rounded={"lg"}
          bg={"white"}
          boxShadow={"lg"}
          px={6}
          py={4}
          minH="65%"
          width={"100%"}
        >
          <Stack spacing={4}>
            {[
              "first_name",
              "last_name",
              "email",
              "phone_number",
              // "number_of_headphones",
            ].map((field) => (
              <FormControl key={field} isInvalid={!!errors[field]}>
                <FormLabel color="#04080F">{fieldMap[field]}</FormLabel>

                {field === "number_of_headphones" ? (
                  <NumberInput
                    min={1}
                    value={parseInt(formData[field]) || 1}
                    onChange={(_, valueNumber) =>
                      handleChange(field, String(Math.max(1, valueNumber || 1)))
                    }
                    clampValueOnBlur
                  >
                    <NumberInputField
                      pointerEvents="none"
                      color="#04080F"
                      boxShadow="md"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                ) : (
                  <Input
                    color="#04080F"
                    boxShadow="md"
                    value={formData[field]}
                    maxLength={
                      field === "phone_number"
                        ? 11
                        : field === "first_name" || field === "last_name"
                        ? 50
                        : undefined
                    }
                    inputMode={field === "phone_number" ? "numeric" : undefined}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (field === "phone_number") {
                        handleChange(field, formatPhone(raw));
                      } else {
                        handleChange(field, raw);
                      }
                    }}
                  />
                )}
                <FormErrorMessage>{errors[field]}</FormErrorMessage>
              </FormControl>
            ))}
            <FormControl isInvalid={!!errors.agreeTerms}>
              <Checkbox
                isChecked={formData.agreeTerms}
                onChange={(e) => handleChange("agreeTerms", e.target.checked)}
                color="#04080F"
              >
                Akceptuję regulamin
              </Checkbox>
              <FormErrorMessage>{errors.agreeTerms}</FormErrorMessage>
            </FormControl>
            <Button
              bg="#507DBC"
              // mt={3}
              color={"white"}
              _hover={{
                bg: "blue.700",
              }}
              onClick={handleSubmit}
              boxShadow="md"
            >
              Złóz zamówienie
            </Button>
          </Stack>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent bg="#DAE3E5" rounded="lg" boxShadow="xl">
            <ModalCloseButton />
            <ModalBody p={6}>
              <Heading size="md" color="#04080F" mb={4} textAlign="center">
                Składanie zamówienia
              </Heading>
              <Text fontSize="lg" color="#04080F" mb={2} textAlign="center">
                Na pewno chcesz złożyć zamówienie na poniższe dane?
              </Text>
              <Box bg="white" p={4} rounded="md" shadow="md" mb={4}>
                {/* <Text color="#04080F" fontWeight="semibold" ml={3}>
                  Username:{" "}
                  <Text as="span" color="#04080F" fontWeight="normal">
                    {formData.username}
                  </Text>
                </Text> */}
                <Text color="#04080F" fontWeight="semibold" ml={3}>
                  Imię:{" "}
                  <Text as="span" color="#04080F" fontWeight="normal">
                    {formData.first_name}
                  </Text>
                </Text>
                <Text color="#04080F" fontWeight="semibold" ml={3}>
                  Nazwisko:{" "}
                  <Text as="span" color="#04080F" fontWeight="normal">
                    {formData.last_name}
                  </Text>
                </Text>
                <Text color="#04080F" fontWeight="semibold" ml={3}>
                  Email:{" "}
                  <Text as="span" color="#04080F" fontWeight="normal">
                    {formData.email}
                  </Text>
                </Text>
                <Text color="#04080F" fontWeight="semibold" ml={3}>
                  Numer telefonu:{" "}
                  <Text as="span" color="#04080F" fontWeight="normal">
                    {formData.phone_number}
                  </Text>
                </Text>
                {/* <Text color="#04080F" fontWeight="semibold" ml={3}>
                  Liczba sluchawek:{" "}
                  <Text as="span" color="#04080F" fontWeight="normal">
                    {formData.number_of_headphones}
                  </Text>
                </Text> */}
              </Box>
              <Stack direction="row" justify="center" spacing={4}>
                <Button
                  bg="#507DBC"
                  color="white"
                  _hover={{ bg: "blue.700" }}
                  onClick={handleCreateUser}
                  isLoading={loading}
                  boxShadow="md"
                  width={"100%"}
                >
                  Złóż zamówienie
                </Button>
                <Button
                  // variant="outline"
                  bg="#DB504A"
                  color={"white"}
                  _hover={{
                    bg: "red.700",
                  }}
                  onClick={onClose}
                  boxShadow="md"
                  width={"100%"}
                >
                  Anuluj
                </Button>
              </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Stack>
    </Flex>
  );
};

export default Order;
