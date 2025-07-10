// src/components/RootCanvas.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import Robot from './Robot';

export default function RootCanvas() {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 5, 2]} intensity={1} />
      <Robot position={[0, -1, 0]} />
    </Canvas>
  );
}
