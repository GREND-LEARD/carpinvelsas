'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiCheck, FiStar, FiShoppingBag, FiInfo, FiTruck, FiShield, FiImage, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import HorizontalMenu from '@/components/layout/HorizontalMenu';

// Datos de demostración (en un proyecto real vendrían de una API/backend)
const productos = [
  {
    id: 1,
    nombre: 'Mesa de Comedor Rústica',
    descripcion: 'Mesa de comedor para 6 personas tallada en roble macizo con acabados artesanales tradicionales.',
    descripcionLarga: 'Esta excepcional mesa de comedor representa el máximo exponente de la carpintería artesanal tradicional. Cada pieza está cuidadosamente seleccionada y trabajada a mano para crear un mueble que no solo es funcional, sino también una obra de arte para tu hogar. El roble macizo proporciona una durabilidad excepcional, mientras que los acabados artesanales realzan la belleza natural de la madera con sus vetas y tonalidades únicas. Ideal para familias que valoran la calidad, la tradición y la belleza atemporal.',
    precio: 1200,
    imagenes: [
      '/productos/mesa-comedor.jpg',
      '/productos/mesa-comedor-2.jpg',
      '/productos/mesa-comedor-3.jpg',
      '/productos/mesa-comedor-4.jpg'
    ],
    categoria: 'comedor',
    etiquetas: ['Roble', 'Rústico', 'Comedor'],
    disponibilidad: true,
    tiempoEntrega: '4-6 semanas',
    popularidad: 5,
    material: 'Roble',
    estilo: 'Rústico',
    dimensiones: {
      largo: 180,
      ancho: 90,
      alto: 75
    },
    opciones: {
      colores: ['Natural', 'Nogal Oscuro', 'Roble Claro'],
      acabados: ['Mate', 'Satinado', 'Brillante'],
      tamaños: ['4 personas (160cm)', '6 personas (180cm)', '8 personas (220cm)']
    },
    cuidados: [
      'Limpiar con paño suave y productos específicos para madera',
      'Evitar la exposición prolongada a la luz solar directa',
      'Utilizar posavasos para evitar marcas',
      'Reaplicar aceite o cera cada 6 meses para mantener el acabado'
    ],
    garantia: '5 años contra defectos de fabricación',
    valoraciones: 4.8
  },
  {
    id: 2,
    nombre: 'Sillón Vintage Restaurado',
    descripcion: 'Sillón antiguo cuidadosamente restaurado con tapicería de lino natural y estructura de nogal pulido.',
    descripcionLarga: 'Este magnífico sillón representa el arte de la restauración llevado a su máxima expresión. Rescatado de una antigua casona, ha sido completamente reconstruido respetando su diseño original pero aportándole una nueva vida. La estructura de nogal ha sido cuidadosamente lijada, reparada y pulida a mano para resaltar la belleza de esta noble madera. La tapicería, realizada en lino natural de la más alta calidad, ofrece una combinación perfecta de estética vintage y confort contemporáneo. Cada detalle ha sido cuidado para crear una pieza única que aporta carácter y elegancia a cualquier espacio.',
    precio: 850,
    imagenes: [
      '/productos/sillon-vintage.jpg',
      '/productos/sillon-vintage-2.jpg',
      '/productos/sillon-vintage-3.jpg'
    ],
    categoria: 'sala',
    etiquetas: ['Nogal', 'Vintage', 'Tapizado'],
    disponibilidad: true,
    tiempoEntrega: '2-3 semanas',
    popularidad: 4,
    material: 'Nogal',
    estilo: 'Vintage',
    dimensiones: {
      largo: 85,
      ancho: 90,
      alto: 95
    },
    opciones: {
      tapizados: ['Lino Natural', 'Algodón Beige', 'Terciopelo Verde'],
      acabadosMadera: ['Nogal Oscuro', 'Nogal Natural', 'Nogal Miel']
    },
    cuidados: [
      'Aspirar regularmente con boquilla para tapicería',
      'Limpiar manchas inmediatamente con un paño húmedo',
      'Evitar la exposición prolongada a la luz solar',
      'Nutrir la madera con cera natural cada 3 meses'
    ],
    garantia: '2 años en estructura, 1 año en tapicería',
    valoraciones: 4.7
  },
  {
    id: 3,
    nombre: 'Armario Contemporáneo',
    descripcion: 'Armario de dos puertas con diseño minimalista en madera de haya y detalles en latón.',
    descripcionLarga: 'Este armario contemporáneo fusiona un diseño minimalista con la calidez natural de la madera de haya de primera calidad. Sus líneas limpias y proporciones equilibradas crean una pieza que se integra perfectamente en espacios modernos mientras aporta un toque de elegancia atemporal. Los detalles en latón, aplicados en tiradores y bisagras, añaden un contraste sofisticado que realza el conjunto. En su interior, un diseño cuidadosamente planificado optimiza el espacio con estantes ajustables, barras para colgar y cajones con guías de cierre suave. Cada elemento ha sido pensado para combinar funcionalidad con estética depurada, creando un mueble que perdurará tanto en calidad como en diseño.',
    precio: 950,
    imagenes: [
      '/productos/armario-contemporaneo.jpg',
      '/productos/armario-contemporaneo-2.jpg',
      '/productos/armario-contemporaneo-3.jpg'
    ],
    categoria: 'dormitorio',
    etiquetas: ['Haya', 'Moderno', 'Minimalista'],
    disponibilidad: true,
    tiempoEntrega: '5-7 semanas',
    popularidad: 3,
    material: 'Haya',
    estilo: 'Moderno',
    dimensiones: {
      largo: 120,
      ancho: 60,
      alto: 200
    },
    opciones: {
      colores: ['Haya Natural', 'Blanco', 'Gris Ceniza'],
      tiradores: ['Latón', 'Acero Inoxidable', 'Integrado'],
      configuracionInterior: ['Básica', 'Con zapatero', 'Con joyero']
    },
    cuidados: [
      'Limpiar con paño ligeramente húmedo',
      'Utilizar productos específicos para madera',
      'Revisar y ajustar bisagras periódicamente',
      'Evitar colocar objetos muy pesados en los estantes superiores'
    ],
    garantia: '3 años contra defectos de fabricación',
    valoraciones: 4.5
  },
  // Más productos aquí...
];

// Obtener productos relacionados basados en categoría y estilo
const obtenerProductosRelacionados = (productoActual, cantidad = 4) => {
  if (!productoActual) return [];
  
  return productos
    .filter(p => p.id !== productoActual.id)
    .filter(p => p.categoria === productoActual.categoria || p.estilo === productoActual.estilo)
    .slice(0, cantidad);
};

export default function DetalleProducto() {
  const params = useParams();
  const router = useRouter();
  const [producto, setProducto] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);
  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState({});
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  
  // Efecto para cargar el producto basado en el ID de la URL
  useEffect(() => {
    // Simulamos una carga desde API
    setCargando(true);
    setTimeout(() => {
      const productoEncontrado = productos.find(p => p.id === parseInt(params.id));
      if (productoEncontrado) {
        setProducto(productoEncontrado);
        setProductosRelacionados(obtenerProductosRelacionados(productoEncontrado));
        
        // Inicializamos opciones seleccionadas con los primeros valores disponibles
        const opcionesIniciales = {};
        if (productoEncontrado.opciones) {
          Object.entries(productoEncontrado.opciones).forEach(([tipo, valores]) => {
            if (valores.length > 0) {
              opcionesIniciales[tipo] = valores[0];
            }
          });
        }
        setOpcionesSeleccionadas(opcionesIniciales);
      }
      setCargando(false);
    }, 500); // Simulamos medio segundo de carga
  }, [params.id]);
  
  // Manejar cambio en opciones seleccionadas
  const handleOpcionChange = (tipo, valor) => {
    setOpcionesSeleccionadas(prev => ({
      ...prev,
      [tipo]: valor
    }));
  };
  
  // Cambiar imagen previa
  const imagenAnterior = () => {
    if (!producto) return;
    setImagenSeleccionada(prev => 
      prev === 0 ? producto.imagenes.length - 1 : prev - 1
    );
  };
  
  // Cambiar imagen siguiente
  const imagenSiguiente = () => {
    if (!producto) return;
    setImagenSeleccionada(prev => 
      prev === producto.imagenes.length - 1 ? 0 : prev + 1
    );
  };
  
  // Función para añadir al carrito (en este ejemplo solo muestra un console.log)
  const añadirAlCarrito = () => {
    console.log('Producto añadido al carrito:', {
      producto,
      opciones: opcionesSeleccionadas,
      cantidad
    });
    // Aquí iría la lógica real para añadir al carrito
  };
  
  if (cargando) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-amber-800">Cargando producto...</p>
        </div>
      </div>
    );
  }
  
  if (!producto) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <FiInfo className="text-amber-500 text-5xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-amber-900 mb-4">Producto no encontrado</h1>
          <p className="text-amber-700 mb-6">Lo sentimos, no pudimos encontrar el producto que buscas.</p>
          <button 
            onClick={() => router.push('/productos')}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Menú horizontal */}
      <HorizontalMenu />
      
      {/* Navegación mejorada con botones para volver */}
      <div className="absolute top-6 left-6 flex items-center gap-4 z-10">
        <Link href="/productos">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/90 hover:bg-amber-500 shadow-md text-white transition-all duration-300"
          >
            <FiArrowLeft />
            <span className="hidden sm:inline">Volver al Catálogo</span>
          </motion.button>
        </Link>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 py-8 md:py-16 pt-24 md:pt-16">
        {/* Migas de pan y navegación */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-amber-800">
            <Link href="/" className="hover:text-amber-600">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href="/productos" className="hover:text-amber-600">Productos</Link>
            <span className="mx-2">/</span>
            <Link href={`/productos?categoria=${producto.categoria}`} className="hover:text-amber-600">
              {producto.categoria.charAt(0).toUpperCase() + producto.categoria.slice(1)}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-amber-600 font-medium">{producto.nombre}</span>
          </nav>
        </div>
        
        {/* Contenido principal del producto */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Galería de imágenes */}
            <div>
              <div className="relative aspect-square mb-4 bg-amber-100/30 rounded-lg overflow-hidden">
                <motion.img
                  key={imagenSeleccionada}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={producto.imagenes[imagenSeleccionada]}
                  alt={`${producto.nombre} - Imagen ${imagenSeleccionada + 1}`}
                  className="w-full h-full object-contain"
                />
                
                {producto.imagenes.length > 1 && (
                  <>
                    <button 
                      onClick={imagenAnterior}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center text-amber-800 shadow-md"
                      aria-label="Imagen anterior"
                    >
                      <FiChevronLeft className="text-xl" />
                    </button>
                    <button 
                      onClick={imagenSiguiente}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center text-amber-800 shadow-md"
                      aria-label="Imagen siguiente"
                    >
                      <FiChevronRight className="text-xl" />
                    </button>
                  </>
                )}
              </div>
              
              {producto.imagenes.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {producto.imagenes.map((imagen, index) => (
                    <button 
                      key={index}
                      onClick={() => setImagenSeleccionada(index)}
                      className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${imagenSeleccionada === index ? 'ring-2 ring-amber-500' : 'opacity-70'}`}
                    >
                      <img 
                        src={imagen} 
                        alt={`Miniatura ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Información del producto */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {producto.etiquetas.map(tag => (
                    <span key={tag} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-3xl font-bold text-amber-900 mb-2">{producto.nombre}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex text-amber-500 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={`${i < Math.floor(producto.valoraciones) ? 'fill-amber-500' : ''} ${i === Math.floor(producto.valoraciones) && producto.valoraciones % 1 > 0 ? 'fill-amber-500/50' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="text-amber-700">{producto.valoraciones} de 5</span>
                </div>
                
                <p className="text-3xl font-bold text-amber-800 mb-4">${producto.precio}</p>
                
                <p className="text-amber-700 mb-6">{producto.descripcion}</p>
                
                <div className="space-y-6">
                  {/* Opciones del producto */}
                  {producto.opciones && Object.entries(producto.opciones).map(([tipo, valores]) => (
                    <div key={tipo} className="space-y-2">
                      <h3 className="font-medium text-amber-900 capitalize">{tipo}</h3>
                      <div className="flex flex-wrap gap-2">
                        {valores.map(valor => (
                          <button
                            key={valor}
                            onClick={() => handleOpcionChange(tipo, valor)}
                            className={`px-4 py-2 rounded-full border ${opcionesSeleccionadas[tipo] === valor 
                              ? 'bg-amber-600 text-white border-amber-600' 
                              : 'border-amber-300 text-amber-800 hover:border-amber-500'}`}
                          >
                            {valor}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {/* Selector de cantidad */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-amber-900">Cantidad</h3>
                    <div className="flex items-center">
                      <button 
                        onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 rounded-l-lg bg-amber-100 flex items-center justify-center text-amber-800 hover:bg-amber-200"
                        disabled={cantidad <= 1}
                        aria-label="Reducir cantidad"
                      >
                        -
                      </button>
                      <div className="w-16 h-10 flex items-center justify-center border-t border-b border-amber-200">
                        {cantidad}
                      </div>
                      <button 
                        onClick={() => setCantidad(prev => prev + 1)}
                        className="w-10 h-10 rounded-r-lg bg-amber-100 flex items-center justify-center text-amber-800 hover:bg-amber-200"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Botón de añadir al carrito */}
                  <button 
                    onClick={añadirAlCarrito}
                    disabled={!producto.disponibilidad}
                    className={`w-full py-3 px-6 rounded-lg flex items-center justify-center gap-2 ${
                      producto.disponibilidad 
                        ? 'bg-amber-600 text-white hover:bg-amber-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FiShoppingBag />
                    {producto.disponibilidad ? 'Añadir al carrito' : 'Producto no disponible'}
                  </button>
                  
                  {/* Información de disponibilidad y envío */}
                  <div className="space-y-3 pt-4 border-t border-amber-100">
                    <div className="flex items-center gap-2 text-amber-700">
                      <FiCheck className={producto.disponibilidad ? 'text-green-500' : 'text-red-500'} />
                      <span>{producto.disponibilidad ? 'En stock' : 'Agotado'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-700">
                      <FiTruck />
                      <span>Tiempo de entrega: {producto.tiempoEntrega}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-700">
                      <FiShield />
                      <span>Garantía: {producto.garantia}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Descripción detallada, especificaciones y cuidados */}
          <div className="border-t border-amber-100 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">Descripción</h2>
                <p className="text-amber-800 whitespace-pre-line mb-6">{producto.descripcionLarga}</p>
                
                {producto.cuidados && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-amber-900 mb-4">Cuidados recomendados</h3>
                    <ul className="list-disc pl-5 space-y-2 text-amber-800">
                      {producto.cuidados.map((cuidado, idx) => (
                        <li key={idx}>{cuidado}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-amber-900 mb-4">Especificaciones</h2>
                <div className="bg-amber-50 rounded-lg p-4 space-y-3">
                  <div className="pb-2 border-b border-amber-100">
                    <span className="text-amber-600 block text-sm">Material</span>
                    <span className="text-amber-900 font-medium">{producto.material}</span>
                  </div>
                  <div className="pb-2 border-b border-amber-100">
                    <span className="text-amber-600 block text-sm">Estilo</span>
                    <span className="text-amber-900 font-medium">{producto.estilo}</span>
                  </div>
                  {producto.dimensiones && (
                    <div className="pb-2 border-b border-amber-100">
                      <span className="text-amber-600 block text-sm">Dimensiones</span>
                      <span className="text-amber-900 font-medium">
                        {producto.dimensiones.largo} × {producto.dimensiones.ancho} × {producto.dimensiones.alto} cm
                      </span>
                    </div>
                  )}
                  <div className="pb-2 border-b border-amber-100">
                    <span className="text-amber-600 block text-sm">Categoría</span>
                    <span className="text-amber-900 font-medium capitalize">{producto.categoria}</span>
                  </div>
                  <div>
                    <span className="text-amber-600 block text-sm">Garantía</span>
                    <span className="text-amber-900 font-medium">{producto.garantia}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Productos relacionados */}
        {productosRelacionados.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-serif font-bold text-amber-900 mb-8 text-center">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productosRelacionados.map((prod) => (
                <motion.div
                  key={prod.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <Link href={`/productos/${prod.id}`} className="block">
                    <div className="aspect-[4/3] relative">
                      <img
                        src={prod.imagenes ? prod.imagenes[0] : '/productos/placeholder.jpg'}
                        alt={prod.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-amber-900 mb-1">{prod.nombre}</h3>
                      <p className="text-amber-800 font-medium">${prod.precio}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 