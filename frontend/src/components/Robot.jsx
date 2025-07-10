import React, { useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function Robot(props) {
  const { scene } = useGLTF('/models/robot.gltf');
  const robotRef = useRef();
  const headRef = useRef(); // now rotating just 'head' parent
  const initialRotation = useRef({ x: 0, y: 0 });
  const [headFound, setHeadFound] = useState(false);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === 'head') {
        console.log('✅ Found main head parent:', child.name);
        headRef.current = child;
        initialRotation.current = {
          x: child.rotation.x,
          y: child.rotation.y,
        };
        setHeadFound(true);
      }
    });

    if (!headRef.current) {
      console.warn('⚠️ Head parent not found. Check name casing.');
    }
  }, [scene]);

  useFrame(({ mouse }) => {
    if (headRef.current && headFound) {
      const maxYRotation = 0.5;
      const mouseX = Math.max(-1, Math.min(1, mouse.x));
      const targetY = initialRotation.current.y + mouseX * maxYRotation;

      // Smooth rotate Y
      headRef.current.rotation.y += (targetY - headRef.current.rotation.y) * 0.1;

      // Lock X
      headRef.current.rotation.x = initialRotation.current.x;
    }
  });

  return (
    <primitive
      ref={robotRef}
      object={scene}
      scale={10}
      rotation={[0, 11, 0]}
      position={[0, -1, 0]}
      {...props}
    />
  );
}

useGLTF.preload('/models/robot.gltf');
