import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Box, Container, Image } from "@chakra-ui/react";
import "./style.css"; // Custom Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const slideData = [
  { imgSrc: "/assets/1.jpg" },
  { imgSrc: "/assets/2.jpg" },
  { imgSrc: "/assets/3.jpg" },
  { imgSrc: "/assets/4.jpg" },
  { imgSrc: "/assets/5.jpg" },
];

export default function Slider() {
  const swiperRef = useRef(null);
  const [spaceBetween, setSpaceBetween] = useState(50);
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
      slidesPerView={1.5}
      centeredSlides={true}
      pagination={{ clickable: true }}
      grabCursor={true}
      loop={true}
      speed={600}
      navigation
      style={{ height: "100%", touchAction: "pan-y" }}
      breakpoints={{
        768: { slidesPerView: 2.2 },
        1024: { slidesPerView: 2.2 },
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
              w="100%"
              h="100%"
              filter="grayscale(20%) contrast(1.05) brightness(1.1)"
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
