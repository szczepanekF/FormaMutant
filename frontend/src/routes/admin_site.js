import React from "react";
import { Box, Heading, useDisclosure } from "@chakra-ui/react";
import { useAuth } from "../context/auth";
import { useEffect } from "react";

const Admin = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { logoutUser, userName, admin } = useAuth();
  const handleLogout = async () => {
    await logoutUser();
  };

  //   useEffect(() => {
  //   window.location.href = "http://localhost:8000/admin";
  // }, []);

  return (
    <Box p={4}>
      <Heading as="h1" size="xl">
        Admin!
      </Heading>
      <Box
        as="a"
        href="http://localhost:8000/admin"
        _hover={{ bg: "blue.700" }}
        fontSize="1.2rem"
        bg="#507DBC"
        color="white"
        p={2}
        display="inline-block"
        borderRadius="md"
        mt={4}
      >
        Przejdź do panelu Django
      </Box>
      <Box
        onClick={handleLogout}
        _hover={{ bg: "blue.700" }}
        fontSize="1.2rem"
        bg="#507DBC"
      >
        Logout
      </Box>
    </Box>
  );
};

export default Admin;
