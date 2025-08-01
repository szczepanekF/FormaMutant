import React, { useEffect, useRef } from "react";

function NoiseBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const generateNoise = () => {
      const width = canvas.width;
      const height = canvas.height;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      const color = { r: 40, g: 20, b: 60 }; // niebieski kolor bazowy

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = (value * color.r) / 255; // R
        data[i + 1] = (value * color.g) / 255; // G
        data[i + 2] = (value * color.b) / 255; // B
        data[i + 3] = 255; // A
      }

      ctx.putImageData(imageData, 0, 0);
    };
    let frameCount = 0;
    const animate = () => {
      frameCount++;
      if (frameCount % 5 === 0) {
        generateNoise();
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const canvasStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: -1,
    opacity: 0.95,
    width: "100%",
    height: "100%",
  };

  return <canvas ref={canvasRef} style={canvasStyle} />;
}

export default NoiseBackground;
