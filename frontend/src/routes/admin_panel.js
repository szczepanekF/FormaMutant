import { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import {
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
import { useOrdersContext } from "../context/ordersContext";
import GradientBackground from "../components/gradientBackground";
import { useItemsContext } from "../context/itemsContext";
import ToastNotification from "../components/toast";

const AdminPanel = () => {
  const [view, setView] = useState("orders");
  const { logoutUser, get_authenticated, withErrorHandler } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  const { loadOrders, setOrders } = useOrdersContext();
  const { loadItems, setItems } = useItemsContext();
  useEffect(() => {
    if (colorMode === "light") {
      toggleColorMode();
    }
    withErrorHandler(
      async () => loadOrders(),
      () => {
        setOrders([]);
      }
    );

    withErrorHandler(
      async () => loadItems(),
      () => {
        setItems([]);
      }
    );
  }, []);

  const [toastConfig, setToastConfig] = useState({
    show: false,
    variant: "success",
    message: "",
  });

  const showToast = (variant, message) => {
    setToastConfig({
      show: true,
      variant,
      message,
    });
  };
  const TABS = [
    {
      key: "orders",
      label: "Zamówienia",
      icon: FiShoppingCart,
      component: <AdminOrders showToast={showToast} />,
    },
    {
      key: "items",
      label: "Słuchawki",
      icon: FiPackage,
      component: <AdminItems showToast={showToast} />,
    },
    {
      key: "register",
      label: "Przypisanie słuchawek",
      icon: FiHeadphones,
      component: <AdminTokenLookup showToast={showToast} />,
    },
    {
      key: "return",
      label: "Zwrot słuchawek",
      icon: FiRotateCcw,
      component: <AdminNumberLookup showToast={showToast} />,
    },
  ];
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = async () => {
    await logoutUser();
  };

  const handleTabChange = async (index) => {
    const key = TABS[index].key;
    await get_authenticated();
    setView(key);
  };

  return (
    <>
      <Box position="fixed" w="100%" h="100%" zIndex={1}>
        <GradientBackground />
      </Box>

      <Box
        position="relative"
        zIndex={2}
        h="100vh"
        w="100vw"
        overflowX="hidden"
        sx={{
          scrollbarGutter: "stable",
          "&::-webkit-scrollbar": {
            width: "12px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0,0,0,0.05)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "6px",
            border: "3px solid transparent",
            backgroundClip: "content-box",
          },
        }}
      >
        <Container maxW={{ base: "100%", md: "container.xxl" }} py={6}>
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "flex-start", md: "center" }}
            gap={4}
            mb={6}
          >
            <Heading
              as="h1"
              size="lg"
              sx={{
                background:
                  "linear-gradient(90deg, rgb(130, 70, 190), rgb(227,11,78), rgb(249,72,38))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              Panel Admina
            </Heading>

            <HStack
              spacing={2}
              alignSelf={{ base: "stretch", md: "center" }}
              ml={{ md: "auto" }}
            >
              <Button
                onClick={handleLogout}
                leftIcon={<FiLogOut />}
                bg="rgba(255, 0, 0, 0.2)"
                color="white"
                backdropFilter="blur(4px)"
                border="1px solid rgba(255, 0, 0, 0.3)"
                _hover={{
                  bg: "rgba(255, 0, 0, 0.3)",
                  borderColor: "rgba(255, 0, 0, 0.5)",
                }}
                variant={isMobile ? "outline" : "ghost"}
              >
                Wyloguj
              </Button>
            </HStack>
          </Flex>

          <Box
            borderRadius="md"
            p={{ base: 2, md: 4 }}
            sx={{
              background:
                "linear-gradient(135deg, rgba(130, 70, 190, 0.15), rgba(227, 11, 78, 0.15))",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Tabs
              onChange={handleTabChange}
              isLazy
              variant={isMobile ? "enclosed" : "soft-rounded"}
            >
              <TabList overflowX="auto" py={2}>
                {TABS.map(({ key, label, icon: Icon }) => (
                  <Tab
                    key={key}
                    fontSize={{ base: "sm", md: "md" }}
                    gap={2}
                    color="white"
                    _selected={{
                      bg: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                    }}
                    _hover={{
                      bg: "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <Icon /> {label}
                  </Tab>
                ))}
              </TabList>

              <TabPanels mt={4}>
                {TABS.map(({ key, component }) => (
                  <TabPanel key={key} px={{ base: 0, md: 2 }} color="white">
                    {component}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Box>
        </Container>
      </Box>
      {toastConfig.show && (
        <ToastNotification
          variant={toastConfig.variant}
          message={toastConfig.message}
          open={toastConfig.show}
          onClose={() => setToastConfig((prev) => ({ ...prev, show: false }))}
        />
      )}
    </>
  );
};

export default AdminPanel;
