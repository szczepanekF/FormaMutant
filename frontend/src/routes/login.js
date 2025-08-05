import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  Heading,
  IconButton,
  InputGroup,
  InputRightElement,
  Image,Container,VStack,
  useColorModeValue,
  Flex,
  Box,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import GradientBackground from "../components/gradientBackground";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser, user } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    await loginUser(username, password);
    setLoading(false);
  };
  useEffect(() => {
    if (user) {
      nav("/admin");
    }
  }, [user]);

  return (
   <>
      <Box position="fixed" w="100%" h="100%" zIndex={1}>
        <GradientBackground />
      </Box>
      
      {/* Logo w lewym górnym rogu */}
      <Box
        position="fixed"
        top="20px"
        left="20px"
        zIndex={3}
        p={2}
        bg="rgba(255, 255, 255, 0)"
        borderRadius="md"
        backdropFilter="blur(4px)"
        _hover={{
          bg: "rgba(255, 255, 255, 0)",
        }}
      >
        <Image
          src="/assets/logo.png"
          alt="Logo"
          maxH="100px"
          onClick={() => nav("/menu")}
          cursor="pointer"
        />
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
        <Flex minH="100vh" w="100%" align="center" justify="center">
          <Container maxW="container.md" px={6}>
            <VStack spacing={8} w="full">
              <Stack align="center">
                <Heading
                  fontSize="4xl"
                  sx={{
                    background:
                      "linear-gradient(90deg, rgb(130, 70, 190), rgb(227,11,78), rgb(249,72,38))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                  }}
                >
                  Zaloguj się do panelu admina
                </Heading>
              </Stack>

              <Box
                rounded="lg"
                w="full"
                p={8}
                sx={{
                  background:
                    "linear-gradient(135deg, rgba(130, 70, 190, 0.15), rgba(227, 11, 78, 0.15))",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <Stack spacing={4}>
                  <FormControl id="email">
                    <FormLabel color="white">Login</FormLabel>
                    <Input
                      color="white"
                      bg="rgba(255, 255, 255, 0.1)"
                      borderColor="rgba(255, 255, 255, 0.2)"
                      _hover={{
                        borderColor: "rgba(255, 255, 255, 0.4)",
                      }}
                      _focus={{
                        borderColor: "rgba(255, 255, 255, 0.6)",
                        boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.6)",
                      }}
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                      type="text"
                    />
                  </FormControl>
                  
                  <FormControl id="password">
                    <FormLabel color="white">Hasło</FormLabel>
                    <InputGroup>
                      <Input
                        color="white"
                        bg="rgba(255, 255, 255, 0.1)"
                        borderColor="rgba(255, 255, 255, 0.2)"
                        _hover={{
                          borderColor: "rgba(255, 255, 255, 0.4)",
                        }}
                        _focus={{
                          borderColor: "rgba(255, 255, 255, 0.6)",
                          boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.6)",
                        }}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type={showPassword ? "text" : "password"}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={() => setShowPassword((prev) => !prev)}
                          variant="ghost"
                          color="white"
                          _hover={{
                            bg: "rgba(255, 255, 255, 0.2)",
                          }}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Stack spacing={10} pt={2}>
                    <Button
                      isLoading={loading}
                      onClick={handleLogin}
                      bg="rgba(255, 255, 255, 0.15)"
                      color="white"
                      backdropFilter="blur(4px)"
                      border="1px solid rgba(255, 255, 255, 0.2)"
                      _hover={{
                        bg: "rgba(255, 255, 255, 0.25)",
                        borderColor: "rgba(255, 255, 255, 0.4)",
                      }}
                      h="50px"
                      fontWeight="bold"
                      transition="all 0.2s"
                    >
                      Zaloguj się
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </VStack>
          </Container>
        </Flex>
      </Box>
    </>
  );
};

export default Login;
