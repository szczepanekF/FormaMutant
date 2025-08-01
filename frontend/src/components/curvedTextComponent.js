import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import CurvedText from "react-curved-text";

const MotionCurvedText = motion(Box); // Opakowujemy w motion

const CurvedTextComponent = ({ textRef }) => (
  <MotionCurvedText
    ref={textRef}
    position="fixed"
    top="50%"
    left="50%"
    transform="translate(-50%, -50%)"
    zIndex="10"
    initial={{
      opacity: 0,
      scale: 10,
      top: "calc(50% + 500px)",
      left: "50%",
      x: "-50%",
      y: "-50%",
    }}
    // animate={{
    //   opacity: [0, 1, 0],
    //   scale: [10, 1],
    //   y: ["-50%", "0%"]
    // }}
    // transition={{
    //   duration: 2,
    //   ease: "easeInOut"
    // }}
  >
    <CurvedText
      width={200}
      height={200}
      cx={99}
      cy={75}
      rx={100}
      ry={100}
      startOffset={56}
      reversed={false}
      text="PLANETA LUZU ZAPRASZA"
      textProps={{
        style: {
          fontSize: "15px",
          fontWeight: "bold",
          fill: "white",
          textShadow: "0 0 10px rgba(0,0,0,0.7)",
        },
      }}
    />
  </MotionCurvedText>
);

export default CurvedTextComponent;
