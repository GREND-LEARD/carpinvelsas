'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiInfo } from 'react-icons/fi';

// Datos de ejemplo para tipos de madera (los mismos que en CalculadoraPresupuesto)
const tiposMadera = [
  { id: 'roble', nombre: 'Roble', factor: 1.5, imagen: '/maderas/roble.jpg', 
    descripcion: 'Madera dura, durable y con un hermoso veteado.',
    propiedades: {
      dureza: 4,
      durabilidad: 5,
      precio: 4,
      trabajabilidad: 3
    },
    detalles: 'El roble es una de las maderas más populares para muebles de alta calidad. Su grano pronunciado aporta carácter, mientras que su dureza garantiza una larga vida útil. Excelente para muebles de uso intensivo.'
  },
  { id: 'pino', nombre: 'Pino', factor: 1.0, imagen: '/maderas/pino.jpg', 
    descripcion: 'Económica y versátil, ideal para múltiples acabados.',
    propiedades: {
      dureza: 2,
      durabilidad: 3,
      precio: 1,
      trabajabilidad: 5
    },
    detalles: 'El pino es una opción económica que ofrece buena relación calidad-precio. Fácil de trabajar y con buena aceptación de tintes y barnices. Ideal para muebles rústicos o estilos escandinavos.'
  },
  { id: 'nogal', nombre: 'Nogal', factor: 1.8, imagen: '/maderas/nogal.jpg', 
    descripcion: 'Elegante y oscura, perfecta para muebles de alta calidad.',
    propiedades: {
      dureza: 4,
      durabilidad: 5,
      precio: 5,
      trabajabilidad: 3
    },
    detalles: 'El nogal es una madera premium con tonos marrones y vetas oscuras. Su elegante aspecto lo hace ideal para muebles de alta gama y piezas de exhibición. Envejece de forma hermosa, oscureciéndose ligeramente con el tiempo.'
  },
  { id: 'cerezo', nombre: 'Cerezo', factor: 1.6, imagen: '/maderas/cerezo.jpg', 
    descripcion: 'Tono rojizo cálido que mejora con el tiempo.',
    propiedades: {
      dureza: 3,
      durabilidad: 4,
      precio: 4,
      trabajabilidad: 4
    },
    detalles: 'El cerezo es apreciado por su tono rojizo-marrón que se oscurece y enriquece con el tiempo. Tiene un grano fino y uniforme que permite acabados suaves y elegantes. Ideal para muebles clásicos y tradicionales.'
  },
  { id: 'haya', nombre: 'Haya', factor: 1.3, imagen: '/maderas/haya.jpg', 
    descripcion: 'Resistente al desgaste, ideal para muebles funcionales.',
    propiedades: {
      dureza: 4,
      durabilidad: 3,
      precio: 3,
      trabajabilidad: 4
    },
    detalles: 'La haya es una madera dura de color claro con un grano suave y uniforme. Tiene buena resistencia al desgaste y se trabaja fácilmente. Excelente opción para muebles funcionales en espacios contemporáneos.'
  },
];

// Datos de ejemplo para acabados (los mismos que en CalculadoraPresupuesto)
const acabados = [
  { id: 'natural', nombre: 'Natural', factor: 1.0, imagen: '/acabados/natural.jpg',
    descripcion: 'Acabado que protege la madera manteniendo su aspecto natural.',
    propiedades: {
      durabilidad: 3,
      mantenimiento: 3,
      aspecto: 'Natural',
      aplicacion: 'Fácil'
    },
    detalles: 'El acabado natural consiste en aplicar una capa protectora transparente que conserva el aspecto original de la madera. Ideal para apreciar el color y el grano naturales.'
  },
  { id: 'mate', nombre: 'Barniz Mate', factor: 1.1, imagen: '/acabados/mate.jpg',
    descripcion: 'Acabado sin brillo que aporta elegancia sutil y discreta.',
    propiedades: {
      durabilidad: 4,
      mantenimiento: 4,
      aspecto: 'Sin brillo',
      aplicacion: 'Media'
    },
    detalles: 'El barniz mate ofrece protección sin añadir brillo, creando una superficie suave y no reflectante. Ideal para estilos contemporáneos y nórdicos.'
  },
  { id: 'satinado', nombre: 'Barniz Satinado', factor: 1.15, imagen: '/acabados/satinado.jpg',
    descripcion: 'Acabado con brillo suave que equilibra elegancia y naturalidad.',
    propiedades: {
      durabilidad: 4,
      mantenimiento: 3,
      aspecto: 'Semi-brillante',
      aplicacion: 'Media'
    },
    detalles: 'El acabado satinado proporciona un brillo sutil que realza la madera sin resultar demasiado brillante. Buena opción para la mayoría de los muebles y estilos decorativos.'
  },
  { id: 'brillante', nombre: 'Barniz Brillante', factor: 1.2, imagen: '/acabados/brillante.jpg',
    descripcion: 'Acabado con alto brillo para un aspecto lujoso y llamativo.',
    propiedades: {
      durabilidad: 5,
      mantenimiento: 2,
      aspecto: 'Muy brillante',
      aplicacion: 'Difícil'
    },
    detalles: 'El barniz brillante crea una superficie muy reflectante que resalta el color y la profundidad de la madera. Ideal para muebles de estilo clásico o piezas destacadas.'
  },
  { id: 'teñido', nombre: 'Teñido', factor: 1.25, imagen: '/acabados/tenido.jpg',
    descripcion: 'Tinte que altera el color de la madera manteniendo visible su veta.',
    propiedades: {
      durabilidad: 4,
      mantenimiento: 3,
      aspecto: 'Coloreado',
      aplicacion: 'Media-Difícil'
    },
    detalles: 'El teñido permite cambiar el color de la madera mientras se mantiene visible su textura y veteado natural. Disponible en múltiples tonos, desde claros hasta oscuros.'
  },
];

// Componente visual para mostrar el nivel de una propiedad
const PropiedadMedidor = ({ nivel, nombre, escala = 5 }) => {
  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-amber-700">{nombre}</span>
        <span className="text-sm font-medium text-amber-900">{nivel}/{escala}</span>
      </div>
      <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-amber-500 rounded-full"
          style={{ width: `${(nivel / escala) * 100}%` }}
        />
      </div>
    </div>
  );
};

const ComparadorMateriales = ({ tipo = 'madera', seleccionActual, onSeleccionar }) => {
  const [itemsComparados, setItemsComparados] = useState([seleccionActual]);
  const [infoDetalle, setInfoDetalle] = useState(null);
  
  // Determinar qué conjunto de datos usar
  const datos = tipo === 'madera' ? tiposMadera : acabados;
  
  // Añadir o quitar un item de la comparación
  const toggleComparar = (id) => {
    if (itemsComparados.includes(id)) {
      // No permitir quitar el último item
      if (itemsComparados.length > 1) {
        setItemsComparados(itemsComparados.filter(itemId => itemId !== id));
      }
    } else {
      // Limitar a 3 items para comparar
      if (itemsComparados.length < 3) {
        setItemsComparados([...itemsComparados, id]);
      }
    }
  };
  
  // Mostrar panel de información detallada
  const mostrarDetalle = (id) => {
    setInfoDetalle(id);
  };
  
  return (
    <div className="space-y-8">
      {/* Sección de selección */}
      <div>
        <h4 className="text-lg font-semibold text-amber-900 mb-3">Selecciona hasta 3 para comparar</h4>
        <div className="grid grid-cols-5 gap-3">
          {datos.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-lg cursor-pointer border-2 relative ${
                itemsComparados.includes(item.id) 
                  ? 'border-amber-500 bg-amber-50' 
                  : 'border-gray-200 hover:border-amber-200'
              }`}
              onClick={() => toggleComparar(item.id)}
            >
              {itemsComparados.includes(item.id) && (
                <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <FiCheck />
                </div>
              )}
              <div className="h-24 bg-amber-100 rounded mb-3 flex items-center justify-center">
                <span className="text-amber-500 text-xs">Imagen: {item.nombre}</span>
              </div>
              <div className="text-center">
                <p className="font-medium text-amber-900">{item.nombre}</p>
                <p className="text-xs text-amber-600 mt-1">
                  {new Intl.NumberFormat('es-ES', { 
                    style: 'currency', 
                    currency: 'EUR',
                    maximumFractionDigits: 0
                  }).format(item.factor * 100)}
                  /m²
                </p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  mostrarDetalle(item.id);
                }}
                className="mt-2 text-amber-600 hover:text-amber-800 text-sm flex items-center justify-center w-full"
              >
                <FiInfo className="mr-1" /> Detalles
              </button>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Tabla comparativa */}
      {itemsComparados.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-amber-900 mb-3">Comparativa</h4>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-amber-100">
                <tr>
                  <th className="py-3 px-4 text-left text-amber-900 font-semibold"></th>
                  {itemsComparados.map(id => {
                    const item = datos.find(d => d.id === id);
                    return (
                      <th key={id} className="py-3 px-4 text-center text-amber-900 font-semibold">
                        {item?.nombre}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-amber-100">
                  <td className="py-3 px-4 text-amber-700 font-medium">Descripción</td>
                  {itemsComparados.map(id => {
                    const item = datos.find(d => d.id === id);
                    return (
                      <td key={id} className="py-3 px-4 text-center text-amber-700">
                        {item?.descripcion}
                      </td>
                    );
                  })}
                </tr>
                
                <tr className="border-b border-amber-100">
                  <td className="py-3 px-4 text-amber-700 font-medium">Factor de precio</td>
                  {itemsComparados.map(id => {
                    const item = datos.find(d => d.id === id);
                    return (
                      <td key={id} className="py-3 px-4 text-center text-amber-700">
                        {item?.factor.toFixed(2)}x
                      </td>
                    );
                  })}
                </tr>
                
                {/* Propiedades específicas para maderas */}
                {tipo === 'madera' && (
                  <>
                    <tr className="border-b border-amber-100">
                      <td className="py-3 px-4 text-amber-700 font-medium">Dureza</td>
                      {itemsComparados.map(id => {
                        const item = datos.find(d => d.id === id);
                        return (
                          <td key={id} className="py-3 px-4 text-center">
                            <div className="flex justify-center">
                              <div className="w-32">
                                <PropiedadMedidor nivel={item?.propiedades.dureza} nombre="" />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    
                    <tr className="border-b border-amber-100">
                      <td className="py-3 px-4 text-amber-700 font-medium">Durabilidad</td>
                      {itemsComparados.map(id => {
                        const item = datos.find(d => d.id === id);
                        return (
                          <td key={id} className="py-3 px-4 text-center">
                            <div className="flex justify-center">
                              <div className="w-32">
                                <PropiedadMedidor nivel={item?.propiedades.durabilidad} nombre="" />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    
                    <tr className="border-b border-amber-100">
                      <td className="py-3 px-4 text-amber-700 font-medium">Trabajabilidad</td>
                      {itemsComparados.map(id => {
                        const item = datos.find(d => d.id === id);
                        return (
                          <td key={id} className="py-3 px-4 text-center">
                            <div className="flex justify-center">
                              <div className="w-32">
                                <PropiedadMedidor nivel={item?.propiedades.trabajabilidad} nombre="" />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </>
                )}
                
                {/* Propiedades específicas para acabados */}
                {tipo === 'acabado' && (
                  <>
                    <tr className="border-b border-amber-100">
                      <td className="py-3 px-4 text-amber-700 font-medium">Durabilidad</td>
                      {itemsComparados.map(id => {
                        const item = datos.find(d => d.id === id);
                        return (
                          <td key={id} className="py-3 px-4 text-center">
                            <div className="flex justify-center">
                              <div className="w-32">
                                <PropiedadMedidor nivel={item?.propiedades.durabilidad} nombre="" />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    
                    <tr className="border-b border-amber-100">
                      <td className="py-3 px-4 text-amber-700 font-medium">Mantenimiento</td>
                      {itemsComparados.map(id => {
                        const item = datos.find(d => d.id === id);
                        return (
                          <td key={id} className="py-3 px-4 text-center">
                            <div className="flex justify-center">
                              <div className="w-32">
                                <PropiedadMedidor nivel={item?.propiedades.mantenimiento} nombre="" />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    
                    <tr className="border-b border-amber-100">
                      <td className="py-3 px-4 text-amber-700 font-medium">Aspecto</td>
                      {itemsComparados.map(id => {
                        const item = datos.find(d => d.id === id);
                        return (
                          <td key={id} className="py-3 px-4 text-center text-amber-700">
                            {item?.propiedades.aspecto}
                          </td>
                        );
                      })}
                    </tr>
                  </>
                )}
                
                <tr>
                  <td className="py-3 px-4 text-amber-700 font-medium">Acciones</td>
                  {itemsComparados.map(id => {
                    return (
                      <td key={id} className="py-3 px-4 text-center">
                        <button
                          onClick={() => onSeleccionar(id)}
                          className={`px-4 py-2 rounded-lg ${
                            id === seleccionActual
                              ? 'bg-amber-200 text-amber-800'
                              : 'bg-amber-600 text-white hover:bg-amber-700'
                          }`}
                        >
                          {id === seleccionActual ? 'Seleccionado' : 'Seleccionar'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Panel de información detallada */}
      {infoDetalle && (
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-semibold text-amber-900">
              {datos.find(d => d.id === infoDetalle)?.nombre}
            </h4>
            <button 
              onClick={() => setInfoDetalle(null)}
              className="text-amber-500 hover:text-amber-700"
            >
              &times;
            </button>
          </div>
          
          <p className="text-amber-700 mb-4">
            {datos.find(d => d.id === infoDetalle)?.detalles}
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-amber-900 mb-2">Propiedades</h5>
              {tipo === 'madera' ? (
                <div className="space-y-3">
                  <PropiedadMedidor 
                    nivel={datos.find(d => d.id === infoDetalle)?.propiedades.dureza} 
                    nombre="Dureza" 
                  />
                  <PropiedadMedidor 
                    nivel={datos.find(d => d.id === infoDetalle)?.propiedades.durabilidad} 
                    nombre="Durabilidad" 
                  />
                  <PropiedadMedidor 
                    nivel={datos.find(d => d.id === infoDetalle)?.propiedades.precio} 
                    nombre="Precio" 
                  />
                  <PropiedadMedidor 
                    nivel={datos.find(d => d.id === infoDetalle)?.propiedades.trabajabilidad} 
                    nombre="Trabajabilidad" 
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <PropiedadMedidor 
                    nivel={datos.find(d => d.id === infoDetalle)?.propiedades.durabilidad} 
                    nombre="Durabilidad" 
                  />
                  <PropiedadMedidor 
                    nivel={datos.find(d => d.id === infoDetalle)?.propiedades.mantenimiento} 
                    nombre="Facilidad de mantenimiento" 
                  />
                  <p className="text-sm text-amber-700">
                    <span className="font-medium">Aspecto:</span> {
                      datos.find(d => d.id === infoDetalle)?.propiedades.aspecto
                    }
                  </p>
                  <p className="text-sm text-amber-700">
                    <span className="font-medium">Aplicación:</span> {
                      datos.find(d => d.id === infoDetalle)?.propiedades.aplicacion
                    }
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <h5 className="font-medium text-amber-900 mb-2">Imagen de muestra</h5>
              <div className="h-48 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-amber-500">
                  Imagen: {datos.find(d => d.id === infoDetalle)?.nombre}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => onSeleccionar(infoDetalle)}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Seleccionar este {tipo}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparadorMateriales; 