import React from 'react';
import ModelViewer from '../../components/ModelViewer';

const Modelo3DPage = () => {
  // Array de modelos con sus títulos
  const modelos = [
    { id: 1, titulo: "Closet de Melamina", ruta: "/proyectos/mueble_closet_melamina.glb" },
    { id: 2, titulo: "Escritorio Moderno", ruta: "/proyectos/mueble_closet_melamina.glb" },
    { id: 3, titulo: "Estantería Flotante", ruta: "/proyectos/mueble_closet_melamina.glb" },
    { id: 4, titulo: "Mueble TV", ruta: "/proyectos/mueble_closet_melamina.glb" },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-amber-800 mb-8 text-center">Galería de Modelos 3D</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modelos.map((modelo) => (
          <div key={modelo.id} className="bg-amber-50 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 bg-amber-800 text-amber-50">
              <h2 className="text-xl font-semibold">{modelo.titulo}</h2>
            </div>
            <div className="p-4">
              <ModelViewer modelPath={modelo.ruta} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Modelo3DPage;