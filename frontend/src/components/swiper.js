import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Box, Container, Image } from "@chakra-ui/react";
import "./style.css"; // Custom Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { useBreakpointValue } from "@chakra-ui/react";

const slideData = [
  { imgSrc: "/assets/IMG_3.webp" },
  { imgSrc: "/assets/IMG_2.webp" },
  { imgSrc: "/assets/IMG_1.webp", position: "center 18%" },
  // { imgSrc: "/assets/IMG_3.webp" },
  { imgSrc: "/assets/IMG_4.webp" },
  { imgSrc: "/assets/IMG_5.webp" },
  { imgSrc: "/assets/IMG_6.webp" },
  { imgSrc: "/assets/IMG_7.webp", position: "center 20%"},
  { imgSrc: "/assets/IMG_8.webp" },
  { imgSrc: "/assets/IMG_9.webp", position: "center 15%" },
  { imgSrc: "/assets/IMG_10.webp" }
  
  
];

export default function Slider() {
  const swiperRef = useRef(null);
  const spaceBetween = useBreakpointValue({
    base: 20, // dla telefonów
    sm: 30, // małe tablety
    md: 30, // średnie ekrany
    lg: 40, // duże ekrany
    xl: 50, // bardzo duże ekrany
  });
  const slidesPerView = useBreakpointValue({
    base: 1.3, // telefony
    sm: 1.3, // małe tablety
    md: 1.5, // średnie ekrany
    lg: 1.7, // duże ekrany
    xl: 2.0, // bardzo duże ekrany
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = () => {
    // console.log("Touch start");
    // setSpaceBetween(50);
    swiperRef.current?.el?.classList.add("dragging");
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    // console.log("Touch end");
    // setSpaceBetween(85);
    swiperRef.current?.el?.classList.remove("dragging");
    // setSpaceBetween(1);
    setIsDragging(false);
  };

  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      centeredSlides={true}
      pagination={{ clickable: true }}
      grabCursor={true}
      loop={true}
      speed={800}
      touchReleaseOnEdges={true}
      threshold={10}
      resistanceRatio={0.7} 
      // followFinger={false}
      navigation
      style={{
        height: "100%",
        touchAction: "pan-y",
      }}
      breakpoints={{
        480: {
          slidesPerView: 1.5,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 1.5,
        },
        1024: {
          slidesPerView: 1.7,
        },
      }}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onSliderMove={handleTouchStart}
    >
      {slideData.map((slide, index) => (
        <SwiperSlide key={index}>
          <Box
            position="relative"
            h="100%"
            overflow="hidden"
            borderRadius="2xl"
            boxShadow="md"
            border="1px solid rgba(255, 255, 255, 0.1)"
            className={isDragging ? "dragging-box" : ""}
            transition="transform 0.3s ease"
            transform={isDragging ? "scale(0.95)" : "scale(1)"}
            _hover={{ transform: "scale(1.03)" }}
          >
            <Image
              src={slide.imgSrc}
              objectFit="cover"
              h={{ base: "40vh", md: "65vh" }}
              objectPosition = {slide.position || "center"} 
              w="100%"
              // filter="grayscale(20%) contrast(1.05) brightness(1.1)"
              loading="lazy"
            />
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bgGradient="linear(to-t, rgba(0,0,0,0.2), rgba(0,0,0,0))"
            />
          </Box>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
