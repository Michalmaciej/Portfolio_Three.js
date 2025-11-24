import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader"; // Zakładamy, że ten import jest poprawny

// --- 1. Komponent Modelu Komputera ---
const Computers = ({ isMobile }) => {
  // Komponent używający logiki @react-three/fiber do wyświetlenia modelu
  const computer = useGLTF("./desktop_pc/scene.glb");

  return (
    <mesh>
      {/* Światła */}
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      
      {/* Model 3D */}
      <primitive
        object={computer.scene}
        scale={isMobile ? 10.7 : 10.75}
        position={isMobile ? [0, -3, -1.2] : [0, -3.25, -0.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

// --- 2. Komponent Płótna (Canvas) z obsługą RWD ---
const ComputersCanvas = () => {
  // Logika wykrywania, czy urządzenie jest mobilne
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Listener dla zmian rozmiaru ekranu (do 500px)
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Ustawienie wartości początkowej
    setIsMobile(mediaQuery.matches);

    // Callback do obsługi zmian
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Dodanie słuchacza
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Czyszczenie (cleanup)
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 2]}
      camera={{ position: [22, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      {/* Suspense z loaderem na czas ładowania modelu 3D */}
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        {/* Renderowanie modelu 3D z propsem isMobile */}
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

// --- 3. Eksport Główny ---
export default ComputersCanvas;