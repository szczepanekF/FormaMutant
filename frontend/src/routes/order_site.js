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
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalCloseButton,
} from "@chakra-ui/react";
import React from "react";
// import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { order_creation } from "../endpoints/api";
import { useAuth } from "../context/auth";

const Order = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    number_of_headphones: "",
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
      number_of_headphones: "",
    });
    setLoading(false);
    // toast.success("User has benn successfully craeted.");
    onClose();
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.phone_number.trim() || !/^\d{9}$/.test(formData.phone_number))
      newErrors.phone_number = "Phone number must be 9 digits long";
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

  const handleCreateUser = async () => {
    await withErrorHandler(
      async () => {
        setLoading(true);
        const user = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_number: formData.phone_number,
        };
        const amount = formData.number_of_headphones;
        const response = await order_creation(user, amount);
        reset();
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
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
              "number_of_headphones",
            ].map((field) => (
              <FormControl key={field} isInvalid={!!errors[field]}>
                <FormLabel color="#04080F">
                  {field
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </FormLabel>
                <Input
                  color="#04080F"
                  boxShadow="md"
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
                <FormErrorMessage>{errors[field]}</FormErrorMessage>
              </FormControl>
            ))}
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
                Confirm user creation
              </Heading>
              <Text fontSize="lg" color="#04080F" mb={2} textAlign="center">
                Are you sure you want to create a user with the following
                details?
              </Text>
              <Box bg="white" p={4} rounded="md" shadow="md" mb={4}>
                {/* <Text color="#04080F" fontWeight="semibold" ml={3}>
                  Username:{" "}
                  <Text as="span" color="#04080F" fontWeight="normal">
                    {formData.username}
                  </Text>
                </Text> */}
                <Text color="#04080F" fontWeight="semibold" ml={3}>
                  First name:{" "}
                  <Text as="span" color="#04080F" fontWeight="normal">
                    {formData.first_name}
                  </Text>
                </Text>
                <Text color="#04080F" fontWeight="semibold" ml={3}>
                  Last name:{" "}
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
                  Phone number:{" "}
                  <Text as="span" color="#04080F" fontWeight="normal">
                    {formData.phone_number}
                  </Text>
                </Text>
                <Text color="#04080F" fontWeight="semibold" ml={3}>
                  Liczba sluchawek:{" "}
                  <Text as="span" color="#04080F" fontWeight="normal">
                    {formData.number_of_headphones}
                  </Text>
                </Text>
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
                  Confirm
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
                  Cancel
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
