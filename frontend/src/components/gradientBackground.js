import { Box } from "@chakra-ui/react";

const GradientBackground = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      zIndex={-1}
      bg="linear-gradient(135deg, rgb(70, 12, 109), rgb(227, 11, 78), rgb(249, 72, 38))"
    />
  );
};

export default GradientBackground;
