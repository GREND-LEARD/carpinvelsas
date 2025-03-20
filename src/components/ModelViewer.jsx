'use client';
import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Bounds } from '@react-three/drei';

const Model = ({ modelPath }) => {
  const gltf = useGLTF(modelPath);
  
  return (
    <primitive 
      object={gltf.scene} 
      rotation={[0, Math.PI/2, 0]}
      position={[-600, 0, 0]}
      scale={0.5}
    />
  );
};

// Componente para ajustar la cámara inicial
const CameraAdjuster = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return null;
};

const ModelViewer = ({ modelPath = '/proyectos/mueble_closet_melamina.glb' }) => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas>
        <CameraAdjuster />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />

        <Suspense fallback={null}>
          <Environment preset="city" />

          <Bounds fit clip observe margin={1.2}>
            <Model modelPath={modelPath} />
            <OrbitControls 
              makeDefault 
              enableDamping 
              dampingFactor={0.05}
              target={[0, 0, 0]}
            />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewer;
