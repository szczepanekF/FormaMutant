import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'Hubot Sans', sans-serif`,
    body: `'Hubot Sans', sans-serif`,
  },
  components: {
    Modal: {
      baseStyle: {
        dialog: {
          overflowY: "auto",
          maxHeight: "calc(100vh - 40px)",
        },
      },
    },
  },
  
});

export default theme;
