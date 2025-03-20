'use client';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Bounds } from '@react-three/drei';

const Model = () => {
  const gltf = useGLTF('/proyectos/mueble_closet_melamina.glb');

  return <primitive object={gltf.scene} />;
};

const ModelViewer = () => {
  return (
    <div style={{ width: '80%', height: '700px' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />

        <Suspense fallback={null}>
          <Environment preset="city" />

          {/* Bounds ajusta el encuadre automático */}
          <Bounds fit clip observe margin={1.2}>
            <Model />
            <OrbitControls makeDefault />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ModelViewer;
