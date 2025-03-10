import React from 'react';
import ModelViewer from '../../components/ModelViewer';

const Modelo3DPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-amber-800 mb-6">Visualizador de Modelo 3D</h1>
      <div className="bg-amber-50 rounded-lg shadow-lg p-4">
        <ModelViewer />
      </div>
    </div>
  );
};

export default Modelo3DPage;