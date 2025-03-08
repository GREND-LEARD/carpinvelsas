'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiFilter, FiChevronDown, FiChevronUp, FiX, FiSearch, FiGrid, FiList } from 'react-icons/fi';
import VerticalMenu from '@/components/layout/VerticalMenu';

// Datos de categorías (en un proyecto real esto vendría de una API o base de datos)
const categorias = [
  { id: 'comedor', nombre: 'Comedores', imagen: '/categorias/comedor.jpg', descripcion: 'Mesas, sillas y buffets para crear espacios de reunión inolvidables' },
  { id: 'dormitorio', nombre: 'Dormitorio', imagen: '/categorias/dormitorio.jpg', descripcion: 'Camas, armarios y mesitas de noche con elegancia y funcionalidad' },
  { id: 'sala', nombre: 'Sala de Estar', imagen: '/categorias/sala.jpg', descripcion: 'Sofás, mesas de centro y muebles de TV para espacios acogedores' },
  { id: 'oficina', nombre: 'Oficina', imagen: '/categorias/oficina.jpg', descripcion: 'Escritorios, librerías y sillas para un espacio de trabajo productivo' },
  { id: 'exteriores', nombre: 'Exteriores', imagen: '/categorias/exterior.jpg', descripcion: 'Muebles de jardín y terraza resistentes y con estilo' },
  { id: 'decoracion', nombre: 'Decoración', imagen: '/categorias/decoracion.jpg', descripcion: 'Elementos decorativos que añaden carácter a cualquier espacio' },
];

// Datos de productos (en un proyecto real esto vendría de una API o base de datos)
const productos = [
  {
    id: 1,
    nombre: 'Mesa de Comedor Rústica',
    descripcion: 'Mesa de comedor para 6 personas tallada en roble macizo con acabados artesanales tradicionales.',
    precio: 1200,
    imagen: '/productos/mesa-comedor.jpg',
    categoria: 'comedor',
    etiquetas: ['Roble', 'Rústico', 'Comedor'],
    disponibilidad: true,
    tiempoEntrega: '4-6 semanas',
    popularidad: 5,
    material: 'Roble',
    estilo: 'Rústico'
  },
  {
    id: 2,
    nombre: 'Sillón Vintage Restaurado',
    descripcion: 'Sillón antiguo cuidadosamente restaurado con tapicería de lino natural y estructura de nogal pulido.',
    precio: 850,
    imagen: '/productos/sillon-vintage.jpg',
    categoria: 'sala',
    etiquetas: ['Nogal', 'Vintage', 'Tapizado'],
    disponibilidad: true,
    tiempoEntrega: '2-3 semanas',
    popularidad: 4,
    material: 'Nogal',
    estilo: 'Vintage'
  },
  {
    id: 3,
    nombre: 'Armario Contemporáneo',
    descripcion: 'Armario de dos puertas con diseño minimalista en madera de haya y detalles en latón.',
    precio: 950,
    imagen: '/productos/armario-contemporaneo.jpg',
    categoria: 'dormitorio',
    etiquetas: ['Haya', 'Moderno', 'Minimalista'],
    disponibilidad: true,
    tiempoEntrega: '5-7 semanas',
    popularidad: 3,
    material: 'Haya',
    estilo: 'Moderno'
  },
  {
    id: 4,
    nombre: 'Escritorio Industrial',
    descripcion: 'Escritorio con estructura de hierro forjado y tablero de madera de pino reciclada.',
    precio: 720,
    imagen: '/productos/escritorio-industrial.jpg',
    categoria: 'oficina',
    etiquetas: ['Hierro', 'Pino', 'Industrial'],
    disponibilidad: false,
    tiempoEntrega: '3-4 semanas',
    popularidad: 5,
    material: 'Pino',
    estilo: 'Industrial'
  },
  {
    id: 5,
    nombre: 'Mesa de Centro Minimalista',
    descripcion: 'Mesa de centro con diseño geométrico en madera de cerezo y cristal templado.',
    precio: 580,
    imagen: '/productos/mesa-centro.jpg',
    categoria: 'sala',
    etiquetas: ['Cerezo', 'Cristal', 'Minimalista'],
    disponibilidad: true,
    tiempoEntrega: '2-3 semanas',
    popularidad: 4,
    material: 'Cerezo',
    estilo: 'Minimalista'
  },
  {
    id: 6,
    nombre: 'Cama con Dosel Tallada',
    descripcion: 'Cama king size con dosel tallado a mano con motivos florales en madera de nogal.',
    precio: 1850,
    imagen: '/productos/cama-dosel.jpg',
    categoria: 'dormitorio',
    etiquetas: ['Nogal', 'Tallado', 'Clásico'],
    disponibilidad: true,
    tiempoEntrega: '6-8 semanas',
    popularidad: 5,
    material: 'Nogal',
    estilo: 'Clásico'
  },
  {
    id: 7,
    nombre: 'Estantería Modular',
    descripcion: 'Sistema de estanterías modulares en roble y acero que se adapta a cualquier espacio.',
    precio: 420,
    imagen: '/productos/estanteria-modular.jpg',
    categoria: 'oficina',
    etiquetas: ['Roble', 'Acero', 'Modular'],
    disponibilidad: true,
    tiempoEntrega: '2-3 semanas',
    popularidad: 4,
    material: 'Roble',
    estilo: 'Moderno'
  },
  {
    id: 8,
    nombre: 'Juego de Jardín',
    descripcion: 'Conjunto de mesa y 4 sillas para exterior en teca tratada con aceites naturales.',
    precio: 1100,
    imagen: '/productos/juego-jardin.jpg',
    categoria: 'exteriores',
    etiquetas: ['Teca', 'Exterior', 'Resistente'],
    disponibilidad: true,
    tiempoEntrega: '3-4 semanas',
    popularidad: 3,
    material: 'Teca',
    estilo: 'Rústico'
  },
];

// Obtener todos los materiales únicos
const materiales = [...new Set(productos.map(producto => producto.material))];
// Obtener todos los estilos únicos
const estilos = [...new Set(productos.map(producto => producto.estilo))];

export default function Catalogo() {
  // Estados para filtros y vista
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [vistaGrilla, setVistaGrilla] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtrosMateriales, setFiltrosMateriales] = useState([]);
  const [filtrosEstilos, setFiltrosEstilos] = useState([]);
  const [rangoPrecios, setRangoPrecios] = useState([0, 2000]);
  const [productosVisibles, setProductosVisibles] = useState([]);

  // Ordenar por relevancia (para búsqueda) o por popularidad
  const [ordenarPor, setOrdenarPor] = useState('popularidad');

  // Función de búsqueda y filtrado
  useEffect(() => {
    let resultado = [...productos];
    
    // Filtrar por categoría
    if (categoriaSeleccionada !== 'todos') {
      resultado = resultado.filter(producto => producto.categoria === categoriaSeleccionada);
    }
    
    // Filtrar por búsqueda
    if (busqueda) {
      const terminoBusqueda = busqueda.toLowerCase();
      resultado = resultado.filter(producto => 
        producto.nombre.toLowerCase().includes(terminoBusqueda) || 
        producto.descripcion.toLowerCase().includes(terminoBusqueda) ||
        producto.etiquetas.some(tag => tag.toLowerCase().includes(terminoBusqueda))
      );
    }
    
    // Filtrar por materiales
    if (filtrosMateriales.length > 0) {
      resultado = resultado.filter(producto => filtrosMateriales.includes(producto.material));
    }
    
    // Filtrar por estilos
    if (filtrosEstilos.length > 0) {
      resultado = resultado.filter(producto => filtrosEstilos.includes(producto.estilo));
    }
    
    // Filtrar por rango de precio
    resultado = resultado.filter(producto => 
      producto.precio >= rangoPrecios[0] && producto.precio <= rangoPrecios[1]
    );
    
    // Ordenar resultados
    if (ordenarPor === 'precio-asc') {
      resultado.sort((a, b) => a.precio - b.precio);
    } else if (ordenarPor === 'precio-desc') {
      resultado.sort((a, b) => b.precio - a.precio);
    } else if (ordenarPor === 'popularidad') {
      resultado.sort((a, b) => b.popularidad - a.popularidad);
    }
    
    setProductosVisibles(resultado);
  }, [categoriaSeleccionada, busqueda, filtrosMateriales, filtrosEstilos, rangoPrecios, ordenarPor]);

  // Manejar cambios en filtros de material
  const manejarCambioMaterial = (material) => {
    if (filtrosMateriales.includes(material)) {
      setFiltrosMateriales(filtrosMateriales.filter(m => m !== material));
    } else {
      setFiltrosMateriales([...filtrosMateriales, material]);
    }
  };

  // Manejar cambios en filtros de estilo
  const manejarCambioEstilo = (estilo) => {
    if (filtrosEstilos.includes(estilo)) {
      setFiltrosEstilos(filtrosEstilos.filter(e => e !== estilo));
    } else {
      setFiltrosEstilos([...filtrosEstilos, estilo]);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Menú vertical */}
      <VerticalMenu />
      
      {/* Hero del catálogo */}
      <div className="relative h-64 md:h-80 bg-[url('/taller-bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-amber-900/70 flex items-center justify-center">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-serif font-bold text-amber-50 mb-4"
            >
              Nuestro Catálogo
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-amber-100 max-w-2xl mx-auto px-4"
            >
              Descubre nuestra amplia selección de muebles artesanales creados con pasión y maestría
            </motion.p>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Barra de búsqueda y controles */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-800" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Buscar productos"
            />
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 px-4 py-3 rounded-lg transition-colors"
              aria-expanded={mostrarFiltros}
              aria-controls="panel-filtros"
            >
              <FiFilter /> 
              <span className="hidden md:inline">Filtros</span>
              {mostrarFiltros ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            <div className="flex border border-amber-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => setVistaGrilla(true)} 
                className={`p-3 ${vistaGrilla ? 'bg-amber-500 text-white' : 'bg-amber-100'}`}
                aria-label="Ver en cuadrícula"
                aria-pressed={vistaGrilla}
              >
                <FiGrid />
              </button>
              <button 
                onClick={() => setVistaGrilla(false)} 
                className={`p-3 ${!vistaGrilla ? 'bg-amber-500 text-white' : 'bg-amber-100'}`}
                aria-label="Ver en lista"
                aria-pressed={!vistaGrilla}
              >
                <FiList />
              </button>
            </div>
            
            <select 
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
              className="p-3 rounded-lg border border-amber-200 bg-white"
              aria-label="Ordenar por"
            >
              <option value="popularidad">Más populares</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>
        
        {/* Panel de filtros */}
        {mostrarFiltros && (
          <motion.div 
            id="panel-filtros"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 bg-amber-100/50 rounded-lg p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-amber-900">Filtros</h2>
              <button 
                onClick={() => {
                  setCategoriaSeleccionada('todos');
                  setFiltrosMateriales([]);
                  setFiltrosEstilos([]);
                  setRangoPrecios([0, 2000]);
                  setBusqueda('');
                }}
                className="text-amber-600 hover:text-amber-800"
                aria-label="Limpiar todos los filtros"
              >
                Limpiar filtros
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Filtro de categorías */}
              <div>
                <h3 className="font-medium text-amber-900 mb-3">Categorías</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cat-todos"
                      name="categoria"
                      checked={categoriaSeleccionada === 'todos'}
                      onChange={() => setCategoriaSeleccionada('todos')}
                      className="mr-2 accent-amber-600"
                    />
                    <label htmlFor="cat-todos" className="text-amber-800">Todas las categorías</label>
                  </div>
                  {categorias.map((cat) => (
                    <div key={cat.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`cat-${cat.id}`}
                        name="categoria"
                        checked={categoriaSeleccionada === cat.id}
                        onChange={() => setCategoriaSeleccionada(cat.id)}
                        className="mr-2 accent-amber-600"
                      />
                      <label htmlFor={`cat-${cat.id}`} className="text-amber-800">{cat.nombre}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Filtro de materiales */}
              <div>
                <h3 className="font-medium text-amber-900 mb-3">Materiales</h3>
                <div className="space-y-2">
                  {materiales.map((material) => (
                    <div key={material} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`mat-${material}`}
                        checked={filtrosMateriales.includes(material)}
                        onChange={() => manejarCambioMaterial(material)}
                        className="mr-2 accent-amber-600"
                      />
                      <label htmlFor={`mat-${material}`} className="text-amber-800">{material}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Filtro de estilos */}
              <div>
                <h3 className="font-medium text-amber-900 mb-3">Estilos</h3>
                <div className="space-y-2">
                  {estilos.map((estilo) => (
                    <div key={estilo} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`est-${estilo}`}
                        checked={filtrosEstilos.includes(estilo)}
                        onChange={() => manejarCambioEstilo(estilo)}
                        className="mr-2 accent-amber-600"
                      />
                      <label htmlFor={`est-${estilo}`} className="text-amber-800">{estilo}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Filtro de precio */}
              <div className="md:col-span-3">
                <h3 className="font-medium text-amber-900 mb-3">
                  Rango de precio: ${rangoPrecios[0]} - ${rangoPrecios[1]}
                </h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={rangoPrecios[1]}
                    onChange={(e) => setRangoPrecios([rangoPrecios[0], parseInt(e.target.value)])}
                    className="w-full accent-amber-600"
                    aria-label="Precio máximo"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Categorías destacadas (solo visible si no hay filtros activos) */}
        {categoriaSeleccionada === 'todos' && !busqueda && filtrosMateriales.length === 0 && filtrosEstilos.length === 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-amber-900 mb-6 text-center">Categorías</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorias.map((categoria) => (
                <motion.div
                  key={categoria.id}
                  whileHover={{ y: -5 }}
                  className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                  onClick={() => setCategoriaSeleccionada(categoria.id)}
                >
                  <div className="aspect-[4/3] relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 to-transparent z-10" />
                    <img
                      src={categoria.imagen}
                      alt={categoria.nombre}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-xl font-bold text-white mb-2">{categoria.nombre}</h3>
                    <p className="text-amber-100 text-sm">{categoria.descripcion}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {/* Productos */}
        <h2 className="text-3xl font-serif font-bold text-amber-900 mb-6 text-center">
          {categoriaSeleccionada !== 'todos' 
            ? `${categorias.find(c => c.id === categoriaSeleccionada)?.nombre || 'Productos'}`
            : 'Todos los Productos'}
        </h2>
        
        {productosVisibles.length > 0 ? (
          <div className={vistaGrilla 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-6"
          }>
            {productosVisibles.map((producto) => (
              vistaGrilla ? (
                <motion.div
                  key={producto.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <Link href={`/productos/${producto.id}`} className="block">
                    <div className="aspect-[4/3] relative">
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                      />
                      {!producto.disponibilidad && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-sm font-medium">
                          Agotado
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {producto.etiquetas.map(tag => (
                          <span key={tag} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg font-bold text-amber-900 mb-1">{producto.nombre}</h3>
                      <p className="text-amber-800 font-medium mb-2">${producto.precio}</p>
                      <p className="text-amber-700 text-sm line-clamp-2">{producto.descripcion}</p>
                      <div className="mt-3 text-sm text-amber-600">
                        Entrega: {producto.tiempoEntrega}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key={producto.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow flex"
                >
                  <Link href={`/productos/${producto.id}`} className="flex flex-col md:flex-row w-full">
                    <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-auto relative">
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                      />
                      {!producto.disponibilidad && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-sm font-medium">
                          Agotado
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {producto.etiquetas.map(tag => (
                            <span key={tag} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-amber-900 mb-2">{producto.nombre}</h3>
                        <p className="text-amber-700 mb-4">{producto.descripcion}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-amber-700">
                          <span>Material: {producto.material}</span>
                          <span>Estilo: {producto.estilo}</span>
                          <span>Entrega: {producto.tiempoEntrega}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xl font-bold text-amber-900">${producto.precio}</span>
                        <span className="text-amber-600 underline">Ver detalles</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-amber-50/50 rounded-lg">
            <FiX className="text-amber-400 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-medium text-amber-800 mb-2">No se encontraron productos</h3>
            <p className="text-amber-700">Prueba con otros filtros o términos de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
} 