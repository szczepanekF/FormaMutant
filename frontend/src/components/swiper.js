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
      grabCursor={true}
      loop={true}
      speed={600}
      navigation
      style={{ height: "100%" }}
      breakpoints={{
        768: { slidesPerView: 2.2 },
        1024: { slidesPerView: 1.8 },
      }}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onSliderMove={handleTouchStart}
    >
      {slideData.map((slide, index) => (
        <SwiperSlide key={index}>
          <Box
            h="100%"
            overflow="hidden"
            borderRadius="lg"
            boxShadow="lg"
            className={isDragging ? "dragging-box" : ""}
            transition="transform 0.5s ease"
            transform={isDragging ? "scale(0.95)" : "scale(1)"}
          >
            <Image
              src={slide.imgSrc}
              // alt={Slide ${index + 1}}
              objectFit="cover"
              w="100%"
              h="100%"
              filter="grayscale(100%)"
            />
          </Box>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
