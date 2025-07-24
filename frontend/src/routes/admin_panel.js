import React, { useState } from "react";
import { Button, ButtonGroup, Box, Heading } from "@chakra-ui/react";
import AdminItems from "./admin_site_items";
import AdminOrders from "./admin_site_orders";
import AdminTokenLookup from "./admin_site_register";
import AdminNumberLookup from "./admin_site_return";
import { useAuth } from "../context/auth";

const AdminPanel = () => {
  const [view, setView] = useState("orders");
  const { logoutUser, refresh, get_authenticated } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
  };
  const renderView = () => {
    switch (view) {
      case "items":
        return <AdminItems />;
      case "orders":
        return <AdminOrders />;
      case "register":
        return <AdminTokenLookup />;
      case "return":
        return <AdminNumberLookup />;
      default:
        return null;
    }
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={6}>
        Panel Admina
      </Heading>

      <Button
        as="a"
        href="http://localhost:8000/admin"
        target="_blank"
        rel="noopener noreferrer"
        bg="#507DBC"
        _hover={{ bg: "blue.700" }}
        color="white"
        mr={4}
      >
        Przejdź do panelu Django
      </Button>

      <Button
        onClick={handleLogout}
        bg="#507DBC"
        _hover={{ bg: "blue.700" }}
        color="white"
      >
        Logout
      </Button>
      <ButtonGroup mb={6} spacing={4}>
        <Button
          onClick={async () => {
            await get_authenticated();
            setView("items");
          }}
          colorScheme={view === "items" ? "blue" : "gray"}
        >
          Przedmioty
        </Button>
        <Button
          onClick={async () => {
            await get_authenticated();
            setView("orders");
          }}
          colorScheme={view === "orders" ? "blue" : "gray"}
        >
          Zamówienia
        </Button>
        <Button
          onClick={async () => {
            await get_authenticated();
            setView("register");
          }}
          colorScheme={view === "register" ? "blue" : "gray"}
        >
          Przypisanie słuchawek
        </Button>
        <Button
          onClick={async () => {
            await get_authenticated();
            setView("return");
          }}
          colorScheme={view === "return" ? "blue" : "gray"}
        >
          Zwrot słuchawek
        </Button>
      </ButtonGroup>
      {renderView()}
    </Box>
  );
};

export default AdminPanel;
