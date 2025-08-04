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
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Link as ChakraLink,
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
import GradientBackground from "../components/gradientBackground";
import Footer from "../components/footer";
import { Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

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

  const formatDisplayPhone = (value) => {
    if (!value) return "";
    const match = value.match(/^(\d{3})(\d{3})(\d{3})(\d{2})?$/);
    return match
      ? `${match[1]} ${match[2]} ${match[3]}${match[4] ? ` ${match[4]}` : ""}`
      : value;
  };

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
        nav("/menu");
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
    <>
      <Flex
        minH="100vh"
        w="100%"
        align="center"
        justify="center"
        position="relative"
        overflow="hidden"
        flexDirection="column"
      >
        {/* Gradient Background */}
        <Box position="absolute" top={0} left={0} w="100%" h="100%" zIndex={0}>
          <GradientBackground />
        </Box>

        {/* Nagłówek NAD Stackiem */}
        <Heading
          fontSize="3rem"
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
          Rezerwacja Silent Disco
        </Heading>

        {/* Formularz - Stack z nowymi wymiarami */}
        <Stack
          spacing={6}
          w="50%"
          minH="60%"
          position="relative"
          p={8}
          rounded="lg"
          zIndex={1}
          _before={{
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "lg",
            padding: "2px",
            background:
              "linear-gradient(90deg, rgba(130, 70, 190, 0.8), rgba(227, 11, 78, 0.8))",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
          }}
          sx={{
            background:
              "linear-gradient(135deg, rgba(130, 70, 190, 0.15), rgba(227, 11, 78, 0.15))",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Pola formularza */}
          {["first_name", "last_name", "email"].map((field) => (
            <FormControl key={field} isInvalid={!!errors[field]}>
              <FormLabel color="white" fontSize="1.1rem" mb={2}>
                {fieldMap[field]}
              </FormLabel>
              <Box
                position="relative"
                borderRadius="md"
                _focusWithin={{
                  // Gradientowe obramowanie
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "-2px",
                    left: "-2px",
                    right: "-2px",
                    bottom: "-2px",
                    borderRadius: "md",
                    background:
                      "linear-gradient(90deg, rgba(130, 70, 190, 0.8), rgba(227, 11, 78, 0.8))",
                    zIndex: -1,
                    padding: "2px",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  },
                }}
              >
                <Input
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  color="white"
                  bg="rgba(255, 255, 255, 0.1)"
                  border="2px solid rgba(255, 255, 255, 0.3)"
                  borderRadius="md"
                  _hover={{
                    borderColor: "rgba(255, 255, 255, 0.5)",
                  }}
                  _focus={{
                    bg: "rgba(255, 255, 255, 0.2)",
                    borderColor: "transparent",
                    boxShadow: "none",
                    outline: "none",
                  }}
                  _placeholder={{
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                  maxLength={
                    field === "first_name" || field === "last_name"
                      ? 50
                      : undefined
                  }
                  autoComplete="off"
                />
              </Box>
              <FormErrorMessage color="rgb(249,72,38)" fontSize="0.9rem">
                {errors[field]}
              </FormErrorMessage>
            </FormControl>
          ))}

          {/* Pole telefonu */}
          <FormControl isInvalid={!!errors.phone_number}>
            <FormLabel color="white" fontSize="1.1rem" mb={2}>
              Numer telefonu
            </FormLabel>
            <Box
              position="relative"
              borderRadius="md"
              _focusWithin={{
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "-2px",
                  left: "-2px",
                  right: "-2px",
                  bottom: "-2px",
                  borderRadius: "md",
                  background:
                    "linear-gradient(90deg, rgba(130, 70, 190, 0.8), rgba(227, 11, 78, 0.8))",
                  zIndex: -1,
                  padding: "2px",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                },
              }}
            >
              <Input
                value={formData.phone_number}
                maxLength={11}
                inputMode="numeric"
                onChange={(e) => {
                  const raw = e.target.value;
                  handleChange("phone_number", formatPhone(raw));
                }}
                color="white"
                bg="rgba(255, 255, 255, 0.1)"
                border="2px solid rgba(255, 255, 255, 0.3)"
                borderRadius="md"
                _hover={{
                  borderColor: "rgba(255, 255, 255, 0.5)",
                }}
                _focus={{
                  bg: "rgba(255, 255, 255, 0.2)",
                  borderColor: "transparent",
                  boxShadow: "none",
                  outline: "none",
                }}
                _placeholder={{
                  color: "rgba(255, 255, 255, 0.5)",
                }}
                autoComplete="off"
              />
            </Box>
            <FormErrorMessage color="rgb(249,72,38)" fontSize="0.9rem">
              {errors.phone_number}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.agreeTerms}>
            <Checkbox
              isChecked={formData.agreeTerms}
              onChange={(e) => handleChange("agreeTerms", e.target.checked)}
              colorScheme="pink"
              color="white"
            >
              Akceptuję{" "}
              <ChakraLink
                href="/rules"
                color="pink.500"
                textDecoration="underline"
              >
                regulamin
              </ChakraLink>{" "}
              i zapoznałem/am się z{" "}
              <ChakraLink
                href="/rodo"
                color="pink.500"
                textDecoration="underline"
              >
                polityką prywatności
              </ChakraLink>
            </Checkbox>
            <FormErrorMessage>{errors.agreeTerms}</FormErrorMessage>
          </FormControl>

          <Flex width="100%" gap={4}>
            <Button
              flex={1}
              bg="rgba(255, 255, 255, 0.15)"
              color="white"
              backdropFilter="blur(4px)"
              border="1px solid rgba(255, 255, 255, 0.2)"
              _hover={{
                bg: "rgba(255, 255, 255, 0.25)",
                borderColor: "rgba(255, 255, 255, 0.4)",
              }}
              onClick={() => nav("/menu")} // Tutaj przekierowanie
              size="lg"
            >
              Anuluj
            </Button>
            <Button
              flex={1}
              bgGradient="linear(to-r, rgb(130, 70, 190), rgb(227,11,78))"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, rgb(130, 70, 190), rgb(249,72,38))",
              }}
              onClick={handleSubmit}
              size="lg"
            >
              Złóż zamówienie
            </Button>
          </Flex>
        </Stack>

        {/* Modal */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
          <Box
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            mx={4}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "lg",
              padding: "2px",
              background:
                "linear-gradient(90deg, rgba(130, 70, 190, 0.8), rgba(227, 11, 78, 0.8))",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
            }}
          >
            <ModalContent
              bg="linear-gradient(to bottom, rgb(20, 10, 30), #0d0d0d)"
              border="1px solid rgba(255, 255, 255, 0.1)"
              borderRadius="lg"
              // boxShadow="0 0 30px rgba(130, 70, 190, 0.5)"
            >
              <ModalHeader
                bgGradient="linear(to-r, rgb(130, 70, 190), rgb(227,11,78))"
                color="white"
                borderTopRadius="lg"
                py={4}
              >
                Potwierdzenie zamówienia
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody py={6}>
                <Text color="white" mb={4} textAlign="center" fontSize="lg">
                  Czy na pewno chcesz złożyć zamówienie?
                </Text>

                <Box
                  bg="rgba(255, 255, 255, 0.05)"
                  p={4}
                  rounded="md"
                  border="1px solid rgba(158, 27, 27, 0.8)"
                  _before={{
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    borderRadius: "lg",
                    padding: "2px",
                    background:
                      "linear-gradient(90deg, rgba(130, 70, 190, 0.8), rgba(227, 11, 78, 0.8))",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    pointerEvents: "none",
                  }}
                  sx={{
                    background:
                      "linear-gradient(135deg, rgba(130, 70, 190, 0.15), rgba(227, 11, 78, 0.15))",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {Object.entries(formData)
                    .filter(
                      ([key]) =>
                        key !== "agreeTerms" && key !== "number_of_headphones"
                    )
                    .map(([key, value]) => (
                      <Text key={key} mb={2} color="white">
                        <Text
                          as="span"
                          fontWeight="bold"
                          color="whiteAlpha.800"
                        >
                          {fieldMap[key]}:{" "}
                        </Text>
                        {key === "phone_number"
                          ? formatDisplayPhone(value)
                          : value}
                      </Text>
                    ))}
                </Box>
              </ModalBody>

              <ModalFooter display="flex" justifyContent="center" pt={0} pb={6}>
                <Button
                  bg="rgba(255, 255, 255, 0.15)"
                  color="white"
                  backdropFilter="blur(4px)"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.25)",
                    borderColor: "rgba(255, 255, 255, 0.4)",
                  }}
                  onClick={onClose}
                  mr={4}
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
                  onClick={handleCreateUser}
                >
                  Potwierdź
                </Button>
              </ModalFooter>
            </ModalContent>
          </Box>
        </Modal>
      </Flex>
    </>
  );
};

export default Order;
