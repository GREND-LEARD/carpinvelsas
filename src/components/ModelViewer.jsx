'use client';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

const Model = () => {
  // Ruta relativa al modelo en la carpeta /public
  const gltf = useGLTF('/proyectos/mueble_closet_melamina.glb');
  
  return <primitive object={gltf.scene} scale={1} />;
};

const ModelViewer = () => {
  return (
    <div style={{ width: '80%', height: '700px' }}>
      <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Model />
        </Suspense>
        
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
};

export default ModelViewer;