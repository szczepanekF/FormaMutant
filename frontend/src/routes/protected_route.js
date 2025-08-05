import React from "react";
import { useAuth } from "../context/auth";
import { VStack, Text, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading, get_authenticated } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if ( location.pathname !== "/login") {
      get_authenticated();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!loading && !user ) {
      nav("/login");
    }
  }, [loading, user]);

  if (loading) {
    return (
      <VStack
        height="100vh"
        width="100vw"
        justify="center"
        align="center"
        spacing={4}
      >
        <Spinner size="xl" />
        <Text fontSize="3xl" fontWeight="bold">
          Loading...
        </Text>
      </VStack>
    );
  }

  if (user) {
    return children;
  }

  return null;
};

export default ProtectedRoute;
