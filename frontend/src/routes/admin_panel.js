import React, { useState } from "react";
import {
  Container,
  Flex,
  Heading,
  Button,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorMode,
  useBreakpointValue,
  Box,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import {
  FiExternalLink,
  FiLogOut,
  FiShoppingCart,
  FiPackage,
  FiHeadphones,
  FiRotateCcw,
  FiMoon,
  FiSun,
} from "react-icons/fi";

import AdminItems from "./admin_site_items";
import AdminOrders from "./admin_site_orders";
import AdminTokenLookup from "./admin_site_register";
import AdminNumberLookup from "./admin_site_return";
import { useAuth } from "../context/auth";

const TABS = [
  {
    key: "orders",
    label: "Zamówienia",
    icon: FiShoppingCart,
    component: <AdminOrders />,
  },
  {
    key: "items",
    label: "Przedmioty",
    icon: FiPackage,
    component: <AdminItems />,
  },
  {
    key: "register",
    label: "Przypisanie słuchawek",
    icon: FiHeadphones,
    component: <AdminTokenLookup />,
  },
  {
    key: "return",
    label: "Zwrot słuchawek",
    icon: FiRotateCcw,
    component: <AdminNumberLookup />,
  },
];

const AdminPanel = () => {
  const [view, setView] = useState("orders");
  const { logoutUser, get_authenticated } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  const isMobile = useBreakpointValue({ base: true, md: false });
  const tabIndex = Math.max(
    0,
    TABS.findIndex((t) => t.key === view)
  );

  const handleLogout = async () => {
    await logoutUser();
  };

  const handleTabChange = async (index) => {
    const key = TABS[index].key;
    await get_authenticated();
    setView(key);
  };

  return (
    <Container maxW={{ base: "100%", md: "container.xxl" }} py={6}>
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        gap={4}
        mb={6}
      >
        <Heading as="h1" size="lg">
          Panel Admina
        </Heading>

        <Spacer />

        <HStack spacing={2} alignSelf={{ base: "stretch", md: "center" }}>
          <Button
            as="a"
            href="http://localhost:8000/admin"
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<FiExternalLink />}
            colorScheme="blue"
            variant={isMobile ? "outline" : "solid"}
          >
            Panel Django
          </Button>

          <IconButton
          aria-label={colorMode === "light" ? "Włącz tryb ciemny" : "Włącz tryb jasny"}
          icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
          variant="ghost"
        />

          <Button
            onClick={handleLogout}
            leftIcon={<FiLogOut />}
            colorScheme="red"
            variant={isMobile ? "outline" : "ghost"}
          >
            Wyloguj
          </Button>
        </HStack>
      </Flex>

      <Box
        bg={colorMode === "light" ? "white" : "gray.800"}
        borderRadius="md"
        boxShadow="sm"
        p={{ base: 2, md: 4 }}
      >
        <Tabs
          index={tabIndex}
          onChange={handleTabChange}
          isLazy
          variant={isMobile ? "enclosed" : "soft-rounded"}
          colorScheme="blue"
        >
          <TabList overflowX="auto" py={2}>
            {TABS.map(({ key, label, icon: Icon }) => (
              <Tab key={key} fontSize={{ base: "sm", md: "md" }} gap={2}>
                <Icon /> {label}
              </Tab>
            ))}
          </TabList>

          <TabPanels mt={4}>
            {TABS.map(({ key, component }) => (
              <TabPanel key={key} px={{ base: 0, md: 2 }}>
                {component}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default AdminPanel;
