import {
  Box,
  Flex,
  Link as ChakraLink,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
// import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Link as RouterLink, NavLink } from "react-router-dom";
import { useAuth } from "../context/auth";

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { logoutUser, userName, admin } = useAuth();
  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <Box
      bg="#507DBC"
      color="white"
      position="sticky"
      top="0"
      boxShadow="md"
      zIndex="1000"
    >
      <Flex
        as="nav"
        maxW="100%"
        mx="auto"
        px="4"
        py="2"
        align="center"
        justify="space-between"
      >
        <ChakraLink
          as={RouterLink}
          to="/menu"
          fontSize="1.7rem"
          fontWeight="bold"
          textDecoration="none"
          color="white"
          ml={5}
        >
          Menu
        </ChakraLink>

        {/* <ChakraLink
          as={RouterLink}
          to="/admin"
          fontSize="1.7rem"
          fontWeight="bold"
          textDecoration="none"
          color="white"
          ml={5}
        >
          Admin
        </ChakraLink> */}
        {/* <ChakraLink
          as={RouterLink}
          to="/login"
          fontSize="1.7rem"
          fontWeight="bold"
          textDecoration="none"
          color="white"
          ml={5}
        >
          Login
        </ChakraLink> */}
        <ChakraLink
          as={RouterLink}
          to="/order"
          fontSize="1.7rem"
          fontWeight="bold"
          textDecoration="none"
          color="white"
          ml={5}
        >
          Order
        </ChakraLink>
        <ChakraLink
          as={RouterLink}
          to="/rules"
          fontSize="1.7rem"
          fontWeight="bold"
          textDecoration="none"
          color="white"
          ml={5}
        >
          Rules
        </ChakraLink>
        <ChakraLink
          as={RouterLink}
          to="/rodo"
          fontSize="1.7rem"
          fontWeight="bold"
          textDecoration="none"
          color="white"
          ml={5}
        >
          Rodo
        </ChakraLink>
      </Flex>
    </Box>
  );
};

export default Navbar;
