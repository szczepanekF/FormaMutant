import React, { useRef } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// Tworzymy shader jako niestandardowy materiał
const WaveMaterial = shaderMaterial(
  {
    uTexture: null,
    uTime: 0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec3 pos = position;

      float wave = sin(uv.x * 3.14159 * 2.0 + uTime) * 0.1;
      pos.y += wave * 0.1;

      // Przekrzywienie
      pos.x += sin(uv.y * 3.14159 + uTime) * 0.05;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  `
    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main() {
      vec4 color = texture2D(uTexture, vUv);
      gl_FragColor = color;
    }
  `
);

extend({ WaveMaterial });

export function WaveImage({ url }) {
  const ref = useRef();
  const texture = useTexture(url);
  const { size, viewport } = useThree();

  // Oblicz proporcje tekstury
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;

  // Oblicz rozmiar płaszczyzny, aby wypełnić kontener z zachowaniem proporcji
  const containerHeight = size.height; // Wysokość Canvas (55vh)
  const containerWidth = size.width; // Szerokość Canvas
  const containerAspect = containerWidth / containerHeight;

  let planeWidth, planeHeight;
  if (aspect > containerAspect) {
    // Tekstura jest szersza niż kontener
    planeWidth = containerAspect / aspect;
    planeHeight = 1;
  } else {
    // Tekstura jest wyższa niż kontener
    planeWidth = 1;
    planeHeight = aspect / containerAspect;
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.uTime += state.clock.getDelta();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[planeWidth * 3, planeHeight * 2, 64, 64]} />
      <waveMaterial ref={ref} uTexture={texture} />
    </mesh>
  );
}