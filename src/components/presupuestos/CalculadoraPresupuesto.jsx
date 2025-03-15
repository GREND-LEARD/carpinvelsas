'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiPrinter, FiShare2, FiInfo, FiArrowRight, FiCheck, FiX } from 'react-icons/fi';
import ComparadorMateriales from './ComparadorMateriales';
import VisualizadorProducto from './VisualizadorProducto';
import GeneradorPDF from './GeneradorPDF';

// Datos de ejemplo para categorías de productos
const categorias = [
  { id: 'mesas', nombre: 'Mesas', imagen: '/categorias/mesas.jpg' },
  { id: 'sillas', nombre: 'Sillas', imagen: '/categorias/sillas.jpg' },
  { id: 'armarios', nombre: 'Armarios', imagen: '/categorias/armarios.jpg' },
  { id: 'camas', nombre: 'Camas', imagen: '/categorias/camas.jpg' },
  { id: 'estanterias', nombre: 'Estanterías', imagen: '/categorias/estanterias.jpg' },
  { id: 'escritorios', nombre: 'Escritorios', imagen: '/categorias/escritorios.jpg' },
  { id: 'personalizados', nombre: 'Diseños Personalizados', imagen: '/categorias/personalizados.jpg' },
];

// Datos de ejemplo para tipos de madera
const tiposMadera = [
  { id: 'roble', nombre: 'Roble', factor: 1.5, imagen: '/maderas/roble.jpg', descripcion: 'Madera dura, durable y con un hermoso veteado.' },
  { id: 'pino', nombre: 'Pino', factor: 1.0, imagen: '/maderas/pino.jpg', descripcion: 'Económica y versátil, ideal para múltiples acabados.' },
  { id: 'nogal', nombre: 'Nogal', factor: 1.8, imagen: '/maderas/nogal.jpg', descripcion: 'Elegante y oscura, perfecta para muebles de alta calidad.' },
  { id: 'cerezo', nombre: 'Cerezo', factor: 1.6, imagen: '/maderas/cerezo.jpg', descripcion: 'Tono rojizo cálido que mejora con el tiempo.' },
  { id: 'haya', nombre: 'Haya', factor: 1.3, imagen: '/maderas/haya.jpg', descripcion: 'Resistente al desgaste, ideal para muebles funcionales.' },
];

// Datos de ejemplo para acabados
const acabados = [
  { id: 'natural', nombre: 'Natural', factor: 1.0, imagen: '/acabados/natural.jpg' },
  { id: 'mate', nombre: 'Barniz Mate', factor: 1.1, imagen: '/acabados/mate.jpg' },
  { id: 'satinado', nombre: 'Barniz Satinado', factor: 1.15, imagen: '/acabados/satinado.jpg' },
  { id: 'brillante', nombre: 'Barniz Brillante', factor: 1.2, imagen: '/acabados/brillante.jpg' },
  { id: 'teñido', nombre: 'Teñido', factor: 1.25, imagen: '/acabados/tenido.jpg' },
];

// Datos de ejemplo para categoría mesas
const opcionesMesas = {
  formas: [
    { id: 'rectangular', nombre: 'Rectangular', factor: 1.0 },
    { id: 'cuadrada', nombre: 'Cuadrada', factor: 0.9 },
    { id: 'redonda', nombre: 'Redonda', factor: 1.1 },
    { id: 'ovalada', nombre: 'Ovalada', factor: 1.2 },
  ],
  tamaños: [
    { id: 'pequeña', nombre: 'Pequeña (2-4 personas)', dimensiones: '80x80 cm', factor: 0.8 },
    { id: 'mediana', nombre: 'Mediana (4-6 personas)', dimensiones: '120x80 cm', factor: 1.0 },
    { id: 'grande', nombre: 'Grande (6-8 personas)', dimensiones: '160x90 cm', factor: 1.3 },
    { id: 'extragrande', nombre: 'Extra Grande (8-12 personas)', dimensiones: '200x100 cm', factor: 1.6 },
  ],
  extras: [
    { id: 'extensible', nombre: 'Extensible', factor: 1.3, precio: 120 },
    { id: 'plegable', nombre: 'Plegable', factor: 1.2, precio: 100 },
    { id: 'cajones', nombre: 'Con cajones', factor: 1.15, precio: 80 },
    { id: 'tallada', nombre: 'Detalles tallados', factor: 1.4, precio: 150 },
  ],
  precioBase: 350
};

// Función para calcular precio basado en selecciones
const calcularPrecio = (tipo, selecciones, precioBase) => {
  let precio = precioBase;
  
  // Factor por tipo de madera
  const maderaSeleccionada = tiposMadera.find(m => m.id === selecciones.madera);
  if (maderaSeleccionada) {
    precio *= maderaSeleccionada.factor;
  }
  
  // Factor por acabado
  const acabadoSeleccionado = acabados.find(a => a.id === selecciones.acabado);
  if (acabadoSeleccionado) {
    precio *= acabadoSeleccionado.factor;
  }
  
  // Factores específicos por tipo de mueble
  if (tipo === 'mesas') {
    // Factor por forma
    const formaSeleccionada = opcionesMesas.formas.find(f => f.id === selecciones.forma);
    if (formaSeleccionada) {
      precio *= formaSeleccionada.factor;
    }
    
    // Factor por tamaño
    const tamañoSeleccionado = opcionesMesas.tamaños.find(t => t.id === selecciones.tamaño);
    if (tamañoSeleccionado) {
      precio *= tamañoSeleccionado.factor;
    }
    
    // Extras
    selecciones.extras?.forEach(extraId => {
      const extra = opcionesMesas.extras.find(e => e.id === extraId);
      if (extra) {
        precio += extra.precio;
      }
    });
  }
  
  // Dimensiones personalizadas
  if (selecciones.personalizado && selecciones.ancho && selecciones.largo) {
    const areaEstándar = 1.0; // m²
    const areaMueble = (selecciones.ancho * selecciones.largo) / 10000; // convertir cm² a m²
    precio *= (areaMueble / areaEstándar);
  }
  
  return Math.round(precio);
};

const CalculadoraPresupuesto = () => {
  const [paso, setPaso] = useState(1);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [selecciones, setSelecciones] = useState({
    madera: 'roble',
    acabado: 'natural',
    forma: 'rectangular',
    tamaño: 'mediana',
    extras: [],
    personalizado: false,
    ancho: 120,
    largo: 80,
    alto: 75,
  });
  const [precioEstimado, setPrecioEstimado] = useState(0);
  const [comparadorVisible, setComparadorVisible] = useState(false);
  const [materialAComparar, setMaterialAComparar] = useState(null);
  
  // Actualizar precio cuando cambien las selecciones
  useEffect(() => {
    if (categoriaSeleccionada) {
      setPrecioEstimado(calcularPrecio('mesas', selecciones, opcionesMesas.precioBase));
    }
  }, [categoriaSeleccionada, selecciones]);
  
  // Función para actualizar selecciones
  const actualizarSeleccion = (campo, valor) => {
    setSelecciones(prev => ({
      ...prev,
      [campo]: valor
    }));
  };
  
  // Función para manejar extras (que pueden ser múltiples)
  const manejarExtras = (extraId) => {
    setSelecciones(prev => {
      const nuevosExtras = prev.extras.includes(extraId)
        ? prev.extras.filter(id => id !== extraId)
        : [...prev.extras, extraId];
      
      return {
        ...prev,
        extras: nuevosExtras
      };
    });
  };
  
  // Abrir el comparador de materiales
  const abrirComparador = (tipo) => {
    setMaterialAComparar(tipo);
    setComparadorVisible(true);
  };
  
  // Contenido según el paso actual
  const renderizarPaso = () => {
    switch(paso) {
      case 1:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-amber-900">Selecciona una categoría de producto</h2>
            <div className="grid grid-cols-3 gap-6">
              {categorias.map((categoria) => (
                <motion.div
                  key={categoria.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-white p-6 rounded-xl shadow-md cursor-pointer border-2 ${
                    categoriaSeleccionada === categoria.id ? 'border-amber-500' : 'border-transparent'
                  }`}
                  onClick={() => setCategoriaSeleccionada(categoria.id)}
                >
                  <div className="h-40 bg-amber-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-amber-500 text-4xl">Imagen: {categoria.nombre}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-amber-900">{categoria.nombre}</h3>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!categoriaSeleccionada}
                onClick={() => setPaso(2)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
                  categoriaSeleccionada 
                    ? 'bg-amber-600 text-white hover:bg-amber-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continuar <FiArrowRight />
              </motion.button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-amber-900">Configura tu {
                categorias.find(c => c.id === categoriaSeleccionada)?.nombre.toLowerCase() || 'producto'
              }</h2>
              <button
                onClick={() => setPaso(1)}
                className="text-amber-600 hover:text-amber-800"
              >
                Cambiar categoría
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              {/* Columna de configuración */}
              <div className="space-y-6">
                {/* Selección de madera */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-amber-900">Tipo de Madera</h3>
                    <button 
                      onClick={() => abrirComparador('madera')}
                      className="text-amber-600 hover:text-amber-800 text-sm"
                    >
                      Comparar maderas
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {tiposMadera.map((madera) => (
                      <div
                        key={madera.id}
                        onClick={() => actualizarSeleccion('madera', madera.id)}
                        className={`p-3 rounded-lg cursor-pointer border ${
                          selecciones.madera === madera.id 
                            ? 'border-amber-500 bg-amber-50' 
                            : 'border-gray-200 hover:border-amber-200'
                        }`}
                      >
                        <div className="h-16 bg-amber-100 rounded mb-2 flex items-center justify-center">
                          <span className="text-amber-500 text-xs">Imagen: {madera.nombre}</span>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-amber-900">{madera.nombre}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Selección de acabado */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-amber-900">Acabado</h3>
                    <button 
                      onClick={() => abrirComparador('acabado')}
                      className="text-amber-600 hover:text-amber-800 text-sm"
                    >
                      Comparar acabados
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {acabados.map((acabado) => (
                      <div
                        key={acabado.id}
                        onClick={() => actualizarSeleccion('acabado', acabado.id)}
                        className={`p-3 rounded-lg cursor-pointer border ${
                          selecciones.acabado === acabado.id 
                            ? 'border-amber-500 bg-amber-50' 
                            : 'border-gray-200 hover:border-amber-200'
                        }`}
                      >
                        <div className="h-16 bg-amber-100 rounded mb-2 flex items-center justify-center">
                          <span className="text-amber-500 text-xs">Imagen: {acabado.nombre}</span>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-amber-900">{acabado.nombre}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Selección de forma (específico para mesas) */}
                {categoriaSeleccionada === 'mesas' && (
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-amber-900 mb-4">Forma</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {opcionesMesas.formas.map((forma) => (
                        <div
                          key={forma.id}
                          onClick={() => actualizarSeleccion('forma', forma.id)}
                          className={`p-3 rounded-lg cursor-pointer border ${
                            selecciones.forma === forma.id 
                              ? 'border-amber-500 bg-amber-50' 
                              : 'border-gray-200 hover:border-amber-200'
                          }`}
                        >
                          <div className="text-center">
                            <p className="font-medium text-amber-900">{forma.nombre}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Selección de tamaño (específico para mesas) */}
                {categoriaSeleccionada === 'mesas' && (
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-amber-900 mb-4">Tamaño</h3>
                    <div className="space-y-3">
                      {opcionesMesas.tamaños.map((tamaño) => (
                        <div
                          key={tamaño.id}
                          onClick={() => actualizarSeleccion('tamaño', tamaño.id)}
                          className={`p-3 rounded-lg cursor-pointer border ${
                            selecciones.tamaño === tamaño.id 
                              ? 'border-amber-500 bg-amber-50' 
                              : 'border-gray-200 hover:border-amber-200'
                          }`}
                        >
                          <div className="flex justify-between">
                            <p className="font-medium text-amber-900">{tamaño.nombre}</p>
                            <p className="text-amber-600">{tamaño.dimensiones}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Opción de medidas personalizadas */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          id="personalizado"
                          checked={selecciones.personalizado}
                          onChange={() => actualizarSeleccion('personalizado', !selecciones.personalizado)}
                          className="w-4 h-4 accent-amber-600"
                        />
                        <label htmlFor="personalizado" className="text-amber-900">
                          Medidas personalizadas
                        </label>
                      </div>
                      
                      {selecciones.personalizado && (
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm text-amber-700">Ancho (cm)</label>
                            <input
                              type="number"
                              min="40"
                              max="300"
                              value={selecciones.ancho}
                              onChange={(e) => actualizarSeleccion('ancho', parseInt(e.target.value))}
                              className="w-full p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-amber-700">Largo (cm)</label>
                            <input
                              type="number"
                              min="40"
                              max="300"
                              value={selecciones.largo}
                              onChange={(e) => actualizarSeleccion('largo', parseInt(e.target.value))}
                              className="w-full p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-amber-700">Alto (cm)</label>
                            <input
                              type="number"
                              min="30"
                              max="120"
                              value={selecciones.alto}
                              onChange={(e) => actualizarSeleccion('alto', parseInt(e.target.value))}
                              className="w-full p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Extras (específico para mesas) */}
                {categoriaSeleccionada === 'mesas' && (
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-amber-900 mb-4">Extras</h3>
                    <div className="space-y-3">
                      {opcionesMesas.extras.map((extra) => (
                        <div
                          key={extra.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={`extra-${extra.id}`}
                              checked={selecciones.extras.includes(extra.id)}
                              onChange={() => manejarExtras(extra.id)}
                              className="w-5 h-5 accent-amber-600"
                            />
                            <label htmlFor={`extra-${extra.id}`} className="text-amber-900">
                              {extra.nombre}
                            </label>
                          </div>
                          <span className="text-amber-700">+{extra.precio}€</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Columna de vista previa y resumen */}
              <div className="space-y-6">
                {/* Vista previa del producto */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-amber-900 mb-4">Vista Previa</h3>
                  <div className="h-64 bg-amber-50 rounded-lg mb-4 flex items-center justify-center">
                    <VisualizadorProducto 
                      tipo={categoriaSeleccionada}
                      selecciones={selecciones}
                    />
                  </div>
                  <p className="text-amber-700 text-sm text-center italic">
                    Vista previa orientativa. El producto final puede variar ligeramente.
                  </p>
                </div>
                
                {/* Resumen y precio */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold text-amber-900 mb-4">Resumen</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between py-2 border-b border-amber-100">
                      <span className="text-amber-700">Producto</span>
                      <span className="font-medium text-amber-900">
                        {categorias.find(c => c.id === categoriaSeleccionada)?.nombre || ''}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-amber-100">
                      <span className="text-amber-700">Madera</span>
                      <span className="font-medium text-amber-900">
                        {tiposMadera.find(m => m.id === selecciones.madera)?.nombre || ''}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-amber-100">
                      <span className="text-amber-700">Acabado</span>
                      <span className="font-medium text-amber-900">
                        {acabados.find(a => a.id === selecciones.acabado)?.nombre || ''}
                      </span>
                    </div>
                    {categoriaSeleccionada === 'mesas' && (
                      <>
                        <div className="flex justify-between py-2 border-b border-amber-100">
                          <span className="text-amber-700">Forma</span>
                          <span className="font-medium text-amber-900">
                            {opcionesMesas.formas.find(f => f.id === selecciones.forma)?.nombre || ''}
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-amber-100">
                          <span className="text-amber-700">Tamaño</span>
                          <span className="font-medium text-amber-900">
                            {selecciones.personalizado 
                              ? `Personalizado (${selecciones.ancho}×${selecciones.largo}×${selecciones.alto} cm)`
                              : opcionesMesas.tamaños.find(t => t.id === selecciones.tamaño)?.nombre || ''
                            }
                          </span>
                        </div>
                        {selecciones.extras.length > 0 && (
                          <div className="flex justify-between py-2 border-b border-amber-100">
                            <span className="text-amber-700">Extras</span>
                            <span className="font-medium text-amber-900">
                              {selecciones.extras.map(extraId => 
                                opcionesMesas.extras.find(e => e.id === extraId)?.nombre
                              ).join(', ')}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg text-amber-700">Precio estimado</span>
                      <span className="text-2xl font-bold text-amber-900">
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(precioEstimado)}
                      </span>
                    </div>
                    <p className="text-sm text-amber-600 mt-2">
                      IVA incluido. Entrega e instalación no incluidas.
                    </p>
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setPaso(1)}
                    className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50"
                  >
                    Atrás
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPaso(3)}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  >
                    Solicitar Presupuesto <FiArrowRight />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-amber-900">Finalizar Presupuesto</h2>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center justify-center mb-8">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl"
                >
                  <FiCheck />
                </motion.div>
              </div>
              
              <h3 className="text-xl font-semibold text-center text-amber-900 mb-4">
                Presupuesto Generado Correctamente
              </h3>
              
              <p className="text-center text-amber-700 mb-8">
                Hemos creado un presupuesto personalizado para tu {
                  categorias.find(c => c.id === categoriaSeleccionada)?.nombre.toLowerCase() || 'producto'
                }. Puedes guardarlo, imprimirlo o enviárnoslo directamente.
              </p>
              
              {/* Información del presupuesto para GeneradorPDF */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Aquí integramos el GeneradorPDF */}
                <GeneradorPDF 
                  presupuesto={{
                    id: `${Date.now()}`,
                    nombreProducto: categorias.find(c => c.id === categoriaSeleccionada)?.nombre || 'Producto',
                    descripcion: `${categorias.find(c => c.id === categoriaSeleccionada)?.nombre || 'Producto'} personalizado en madera de ${tiposMadera.find(m => m.id === selecciones.madera)?.nombre || 'roble'} con acabado ${acabados.find(a => a.id === selecciones.acabado)?.nombre || 'natural'}.`,
                    madera: tiposMadera.find(m => m.id === selecciones.madera)?.nombre || 'Roble',
                    acabado: acabados.find(a => a.id === selecciones.acabado)?.nombre || 'Natural',
                    forma: categoriaSeleccionada === 'mesas' ? opcionesMesas.formas.find(f => f.id === selecciones.forma)?.nombre || '' : '',
                    dimensiones: selecciones.personalizado 
                      ? `${selecciones.ancho}×${selecciones.largo}×${selecciones.alto} cm`
                      : categoriaSeleccionada === 'mesas' 
                        ? opcionesMesas.tamaños.find(t => t.id === selecciones.tamaño)?.dimensiones || ''
                        : '',
                    extras: selecciones.extras?.map(extraId => 
                      opcionesMesas.extras.find(e => e.id === extraId)?.nombre || ''
                    ) || [],
                    precioBase: opcionesMesas.precioBase,
                    precioExtras: selecciones.extras?.reduce((total, extraId) => {
                      const extra = opcionesMesas.extras.find(e => e.id === extraId);
                      return total + (extra?.precio || 0);
                    }, 0) || 0,
                    precioIVA: Math.round(precioEstimado * 0.21),
                    precioTotal: precioEstimado
                  }}
                  cliente={{
                    nombre: "Cliente Ejemplo",
                    email: "cliente@ejemplo.com",
                    telefono: "(123) 456-7890"
                  }}
                />
              </motion.div>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => setPaso(2)}
                className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50"
              >
                Volver a editar
              </button>
              
              <button
                onClick={() => {
                  setCategoriaSeleccionada(null);
                  setSelecciones({
                    madera: 'roble',
                    acabado: 'natural',
                    forma: 'rectangular',
                    tamaño: 'mediana',
                    extras: [],
                    personalizado: false,
                    ancho: 120,
                    largo: 80,
                    alto: 75,
                  });
                  setPaso(1);
                }}
                className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50"
              >
                Crear nuevo presupuesto
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Barra de progreso */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                paso >= stepNumber ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-400'
              }`}>
                {paso > stepNumber ? <FiCheck /> : stepNumber}
              </div>
              
              {/* Etiqueta del paso */}
              <span className={`ml-2 ${
                paso >= stepNumber ? 'text-amber-900' : 'text-amber-400'
              }`}>
                {stepNumber === 1 ? 'Selección' : 
                 stepNumber === 2 ? 'Configuración' : 'Finalización'}
              </span>
              
              {/* Línea conectora entre pasos */}
              {stepNumber < 3 && (
                <div className="w-24 sm:w-32 md:w-40 lg:w-56 h-1 mx-2 bg-amber-100">
                  <div className={`h-full bg-amber-600 transition-all ${
                    paso > stepNumber ? 'w-full' : paso === stepNumber ? 'w-1/2' : 'w-0'
                  }`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Contenido principal */}
      <motion.div
        key={paso}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderizarPaso()}
      </motion.div>
      
      {/* Modal de comparador de materiales */}
      {comparadorVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-amber-900">
                Comparador de {materialAComparar === 'madera' ? 'Maderas' : 'Acabados'}
              </h3>
              <button 
                onClick={() => setComparadorVisible(false)}
                className="text-amber-500 hover:text-amber-700 text-2xl"
              >
                <FiX />
              </button>
            </div>
            
            <ComparadorMateriales 
              tipo={materialAComparar} 
              seleccionActual={selecciones[materialAComparar]}
              onSeleccionar={(id) => {
                actualizarSeleccion(materialAComparar, id);
                setComparadorVisible(false);
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CalculadoraPresupuesto; 