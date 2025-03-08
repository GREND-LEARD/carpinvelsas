'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { FiArrowLeft, FiFilter, FiRefreshCw, FiCheckCircle, FiXCircle, FiClock, FiEdit, FiEye, FiTag, FiCalendar, FiDollarSign, FiUser, FiFileText, FiTool, FiImage, FiInfo } from 'react-icons/fi';
import Link from 'next/link';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

// Colores para los estados
const coloresEstado = {
  'pendiente': 'bg-amber-100 text-amber-700',
  'en_proceso': 'bg-blue-100 text-blue-700',
  'aceptado': 'bg-green-100 text-green-700',
  'rechazado': 'bg-red-100 text-red-700',
  'completado': 'bg-purple-100 text-purple-700'
};

// Iconos para los estados
const iconosEstado = {
  'pendiente': <FiClock />,
  'en_proceso': <FiEdit />,
  'aceptado': <FiCheckCircle />,
  'rechazado': <FiXCircle />,
  'completado': <FiCheckCircle />
};

// Texto para la descripción de los estados
const descripcionEstado = {
  'pendiente': 'Presupuesto recibido, pendiente de revisión',
  'en_proceso': 'Presupuesto en evaluación por el equipo técnico',
  'aceptado': 'Presupuesto aprobado y listo para iniciar',
  'rechazado': 'Presupuesto rechazado o cancelado',
  'completado': 'Proyecto finalizado'
};

// Datos de demostración para presupuestos
const DATOS_DEMO = [
  {
    id: 1,
    nombre: "Mesa de comedor rústica",
    descripcion: "Mesa grande para 8 personas con acabado envejecido",
    categoria: "mesa",
    material: "roble",
    acabado: "envejecido",
    dimensiones: { ancho: 180, alto: 75, profundidad: 90 },
    unidades: 1,
    comentarios: "Me gustaría que tuviera detalles tallados en las patas",
    imagenes: ["/productos/mesa-comedor.jpg", "/productos/mesa-comedor-2.jpg"],
    presupuesto: { subtotal: 1800, descuento: 0, total: 1800, tiempo_estimado: "4-6 semanas" },
    estado: "pendiente",
    fecha_creacion: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    usuarios: { nombre: "Juan Pérez", email: "juan@ejemplo.com" }
  },
  {
    id: 2,
    nombre: "Armario para dormitorio",
    descripcion: "Armario de 3 puertas con espacio para colgar ropa y cajones",
    categoria: "armario",
    material: "pino",
    acabado: "barnizado",
    dimensiones: { ancho: 150, alto: 220, profundidad: 60 },
    unidades: 1,
    comentarios: "Necesito que tenga espacio para zapatos en la parte inferior",
    imagenes: ["/productos/armario.jpg"],
    presupuesto: { subtotal: 1200, descuento: 100, total: 1100, tiempo_estimado: "3-4 semanas" },
    estado: "en_proceso",
    fecha_creacion: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    usuarios: { nombre: "María López", email: "maria@ejemplo.com" }
  },
  {
    id: 3,
    nombre: "Escritorio de oficina",
    descripcion: "Escritorio con bandeja para teclado y espacio para torre de ordenador",
    categoria: "escritorio",
    material: "haya",
    acabado: "natural",
    dimensiones: { ancho: 120, alto: 75, profundidad: 60 },
    unidades: 2,
    presupuesto: { subtotal: 900, descuento: 0, total: 900, tiempo_estimado: "2-3 semanas" },
    estado: "aceptado",
    fecha_creacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    usuarios: { nombre: "Carlos Gómez", email: "carlos@ejemplo.com" }
  },
  {
    id: 4,
    nombre: "Estantería para libros",
    descripcion: "Estantería de pared con 5 baldas",
    categoria: "estanteria",
    material: "roble",
    acabado: "lacado",
    dimensiones: { ancho: 90, alto: 180, profundidad: 30 },
    unidades: 1,
    presupuesto: { subtotal: 700, descuento: 0, total: 700, tiempo_estimado: "2 semanas" },
    estado: "completado",
    fecha_creacion: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    usuarios: { nombre: "Laura Sánchez", email: "laura@ejemplo.com" }
  },
  {
    id: 5,
    nombre: "Cama individual con cabecero",
    descripcion: "Cama de 90cm con cabecero y espacio de almacenamiento",
    categoria: "cama",
    material: "pino",
    acabado: "pintado",
    dimensiones: { ancho: 90, alto: 40, profundidad: 190 },
    unidades: 1,
    presupuesto: { subtotal: 600, descuento: 0, total: 600, tiempo_estimado: "3 semanas" },
    estado: "rechazado",
    fecha_creacion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    usuarios: { nombre: "Roberto Martín", email: "roberto@ejemplo.com" }
  }
];

function AdminPresupuestos() {
  const router = useRouter();
  const { user } = useAuth();
  const [presupuestos, setPresupuestos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [usandoDatosDemo, setUsandoDatosDemo] = useState(false);
  const [creandoTabla, setCreandoTabla] = useState(false);
  
  // Estado para gestionar mensajes y progreso
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [enviandoMensaje, setEnviandoMensaje] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [etapaActual, setEtapaActual] = useState('');
  const [fechaEstimada, setFechaEstimada] = useState('');
  const [actualizandoProgreso, setActualizandoProgreso] = useState(false);
  
  // Crear tabla de presupuestos
  const crearTablaPresupuestos = async () => {
    try {
      setCreandoTabla(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/presupuestos/crear-tabla', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.solution) {
          // Si tenemos instrucciones específicas para el usuario
          setError(`${data.message}. Sigue las instrucciones proporcionadas en la consola del navegador.`);
          console.log('='.repeat(50));
          console.log('INSTRUCCIONES PARA CREAR LA TABLA DE PRESUPUESTOS:');
          console.log(data.solution);
          console.log('='.repeat(50));
        } else {
          setError(`Error: ${data.message || response.statusText}`);
        }
        return;
      }
      
      // Si la creación fue exitosa
      alert('¡Tabla de presupuestos creada con éxito! Se cargarán los datos reales.');
      
      // Recargar presupuestos reales
      obtenerPresupuestos();
      
    } catch (error) {
      console.error('Error al crear tabla:', error);
      setError(`No se pudo crear la tabla: ${error.message}`);
    } finally {
      setCreandoTabla(false);
    }
  };
  
  // Obtener presupuestos
  const obtenerPresupuestos = async () => {
    setCargando(true);
    setError(null);
    setUsandoDatosDemo(false);
    
    try {
      // Verificar si el token existe (probar diferentes nombres de token)
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('auth_token') || 
                   localStorage.getItem('jwt_token');
                   
      if (!token) {
        setError('No se encontró el token de autenticación. Por favor, inicie sesión nuevamente.');
        setCargando(false);
        return;
      }
      
      console.log('Obteniendo presupuestos, token:', token.substring(0, 15) + '...');
      
      const url = filtroEstado === 'todos' 
        ? '/api/presupuestos/listar?limite=100' 
        : `/api/presupuestos/listar?estado=${filtroEstado}&limite=100`;
      
      console.log('URL de consulta:', url);
      
      // Intentar hacer la solicitud con más información para debug
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Procesar la respuesta (sea exitosa o no para poder examinar el contenido)
      const data = await response.json().catch(e => {
        console.error('Error al parsear respuesta JSON:', e);
        return { error: 'Formato de respuesta inválido' };
      });
      
      console.log('Respuesta completa de la API:', data);
      
      // Verificar si hay un mensaje de error en la respuesta
      if (!response.ok) {
        // Verificar si el error es porque la tabla no existe
        if (data.message && data.message.includes('tabla de presupuestos no existe')) {
          console.log('Usando datos de demostración ya que la tabla no existe aún');
          // Usar datos de demostración como solución temporal
          setUsandoDatosDemo(true);
          const datosFiltrados = filtroEstado === 'todos' 
            ? DATOS_DEMO 
            : DATOS_DEMO.filter(p => p.estado === filtroEstado);
          setPresupuestos(datosFiltrados);
          setCargando(false);
          return;
        }
        
        // Si los presupuestos están vacíos pero no es un error real, mostramos array vacío
        if (data.presupuestos && Array.isArray(data.presupuestos)) {
          console.log('La API devolvió un array vacío de presupuestos');
          setPresupuestos([]);
          setCargando(false);
          return;
        }
        
        // Mostrar un mensaje de error más específico basado en el código de estado
        if (response.status === 401) {
          throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
        } else if (response.status === 403) {
          throw new Error('Acceso denegado. No tiene permisos para ver los presupuestos.');
        } else if (response.status === 404) {
          throw new Error('El recurso solicitado no existe.');
        } else {
          throw new Error(`Error del servidor: ${data.message || response.statusText}`);
        }
      }
      
      // Verificar si hay presupuestos en la respuesta exitosa
      if (!data.presupuestos) {
        console.warn('La respuesta no contiene presupuestos válidos', data);
        
        // Intentar extraer presupuestos de diferentes estructuras posibles
        let presupuestosEncontrados = [];
        
        if (Array.isArray(data)) {
          // Si la API devolvió un array directamente
          console.log('La API devolvió un array directamente');
          presupuestosEncontrados = data;
        } else if (data.data && Array.isArray(data.data)) {
          // Si los presupuestos están en una propiedad 'data'
          console.log('Presupuestos encontrados en propiedad "data"');
          presupuestosEncontrados = data.data;
        } else if (data.presupuestos === null && data.message && data.message.includes('No se encontraron')) {
          // Si no hay presupuestos pero es una respuesta válida
          console.log('No se encontraron presupuestos (respuesta válida)');
          presupuestosEncontrados = [];
        } else {
          // Si realmente no hay presupuestos en la respuesta, usar array vacío
          console.log('No se identificó estructura válida, usando array vacío');
          presupuestosEncontrados = [];
        }
        
        setPresupuestos(presupuestosEncontrados);
      } else {
        // Estructura normal esperada
        console.log(`Presupuestos obtenidos: ${data.presupuestos.length}`);
        setPresupuestos(data.presupuestos || []);
      }
    } catch (error) {
      console.error('Error al obtener presupuestos:', error);
      
      // Si hay algún error, intentamos con datos de demostración
      console.log('Usando datos de demostración debido a un error');
      setUsandoDatosDemo(true);
      const datosFiltrados = filtroEstado === 'todos' 
        ? DATOS_DEMO 
        : DATOS_DEMO.filter(p => p.estado === filtroEstado);
      setPresupuestos(datosFiltrados);
      
      // Mostrar mensaje amigable
      setError('Usando datos de demostración. ' + error.message);
    } finally {
      setCargando(false);
    }
  };
  
  // Función para ejecutar diagnóstico
  const ejecutarDiagnostico = async () => {
    try {
      setError('Ejecutando diagnóstico, por favor espere...');
      
      // Redirigir a la página de diagnóstico
      router.push('/diagnostico-presupuestos');
      
    } catch (error) {
      console.error('Error al ejecutar diagnóstico:', error);
      setError(`No se pudo ejecutar el diagnóstico: ${error.message}`);
    }
  };
  
  // Cargar presupuestos al montar el componente
  useEffect(() => {
    obtenerPresupuestos();
  }, [filtroEstado]);
  
  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Ver detalle de presupuesto
  const verDetalle = (presupuesto) => {
    setPresupuestoSeleccionado(presupuesto);
    setMostrarDetalle(true);
  };
  
  // Volver a la lista
  const volverALista = () => {
    setMostrarDetalle(false);
    setPresupuestoSeleccionado(null);
  };
  
  // Obtener detalles completos de un presupuesto
  const obtenerPresupuestoDetalle = async (presupuestoId) => {
    // Si estamos en modo demo, no hacer nada
    if (usandoDatosDemo) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('auth_token') || 
                   localStorage.getItem('jwt_token');
                   
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      
      const response = await fetch(`/api/presupuestos/detalle?id=${presupuestoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener detalles del presupuesto');
      }
      
      const data = await response.json();
      setPresupuestoSeleccionado(data.presupuesto);
      
      // Inicializar valores de progreso si hay datos
      if (data.presupuesto.progreso) {
        setProgreso(data.presupuesto.progreso.porcentaje || 0);
        setEtapaActual(data.presupuesto.progreso.etapa_actual || '');
        setFechaEstimada(data.presupuesto.progreso.fecha_estimada || '');
      }
    } catch (error) {
      console.error('Error al obtener detalles:', error);
    }
  };
  
  // Enviar un mensaje al cliente
  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !presupuestoSeleccionado) {
      return;
    }
    
    setEnviandoMensaje(true);
    
    try {
      // Si estamos en modo demo, actualizar localmente
      if (usandoDatosDemo) {
        const mensajes = presupuestoSeleccionado.mensajes || [];
        const nuevoHistorial = [
          ...mensajes,
          {
            fecha: new Date().toISOString(),
            texto: nuevoMensaje,
            emisor: 'admin'
          }
        ];
        
        setPresupuestoSeleccionado({
          ...presupuestoSeleccionado,
          mensajes: nuevoHistorial
        });
        
        setNuevoMensaje('');
        setEnviandoMensaje(false);
        return;
      }
      
      // Código para API real
      const token = localStorage.getItem('token') || 
                    localStorage.getItem('auth_token') || 
                    localStorage.getItem('jwt_token');
                    
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      
      const response = await fetch('/api/presupuestos/mensaje', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          presupuestoId: presupuestoSeleccionado.id,
          mensaje: nuevoMensaje
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al enviar mensaje');
      }
      
      // Actualizar detalles para ver el nuevo mensaje
      await obtenerPresupuestoDetalle(presupuestoSeleccionado.id);
      setNuevoMensaje('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar el mensaje: ' + error.message);
    } finally {
      setEnviandoMensaje(false);
    }
  };
  
  // Actualizar progreso del proyecto
  const actualizarProgreso = async () => {
    if (!presupuestoSeleccionado) {
      return;
    }
    
    setActualizandoProgreso(true);
    
    try {
      // Si estamos en modo demo, actualizar localmente
      if (usandoDatosDemo) {
        setPresupuestoSeleccionado({
          ...presupuestoSeleccionado,
          progreso: {
            ...(presupuestoSeleccionado.progreso || {}),
            porcentaje: progreso,
            etapa_actual: etapaActual,
            fecha_estimada: fechaEstimada,
            fecha_actualizacion: new Date().toISOString()
          }
        });
        
        setActualizandoProgreso(false);
        return;
      }
      
      // Código para API real
      const token = localStorage.getItem('token') || 
                    localStorage.getItem('auth_token') || 
                    localStorage.getItem('jwt_token');
                    
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      
      const response = await fetch('/api/presupuestos/progreso', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          presupuestoId: presupuestoSeleccionado.id,
          progreso: {
            porcentaje: progreso,
            etapa_actual: etapaActual,
            fecha_estimada: fechaEstimada
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar progreso');
      }
      
      // Actualizar detalles
      await obtenerPresupuestoDetalle(presupuestoSeleccionado.id);
    } catch (error) {
      console.error('Error al actualizar progreso:', error);
      alert('Error al actualizar el progreso: ' + error.message);
    } finally {
      setActualizandoProgreso(false);
    }
  };
  
  // Cambiar estado de presupuesto
  const cambiarEstado = async (presupuestoId, nuevoEstado) => {
    try {
      // Si estamos usando datos de demostración, actualizamos localmente
      if (usandoDatosDemo) {
        console.log('Actualizando estado localmente (modo demo)');
        
        // Crear un mensaje automático según el nuevo estado
        const mensajeAutomatico = obtenerMensajeEstado(nuevoEstado);
        
        // Actualizar presupuesto seleccionado si está en vista detalle
        if (presupuestoSeleccionado && presupuestoSeleccionado.id === presupuestoId) {
          // Añadir mensaje al historial
          const mensajes = presupuestoSeleccionado.mensajes || [];
          const nuevoHistorial = [
            ...mensajes,
            {
              fecha: new Date().toISOString(),
              texto: mensajeAutomatico,
              emisor: 'admin'
            }
          ];
          
          // Actualizar progreso según estado
          let nuevoProgreso = 0;
          switch(nuevoEstado) {
            case 'pendiente': nuevoProgreso = 10; break;
            case 'en_proceso': nuevoProgreso = 30; break;
            case 'aceptado': nuevoProgreso = 50; break;
            case 'completado': nuevoProgreso = 100; break;
            case 'rechazado': nuevoProgreso = 0; break;
            default: nuevoProgreso = 0;
          }
          
          setPresupuestoSeleccionado({
            ...presupuestoSeleccionado,
            estado: nuevoEstado,
            mensajes: nuevoHistorial,
            progreso: {
              ...(presupuestoSeleccionado.progreso || {}),
              porcentaje: nuevoProgreso,
              etapa_actual: descripcionEstado[nuevoEstado],
              fecha_actualizacion: new Date().toISOString()
            }
          });
        }
        
        // Actualizar en la lista
        const presupuestosActualizados = presupuestos.map(p => 
          p.id === presupuestoId ? {
            ...p, 
            estado: nuevoEstado,
            // Actualizar también fecha de actualización
            fecha_actualizacion: new Date().toISOString()
          } : p
        );
        setPresupuestos(presupuestosActualizados);
        
        return;
      }
      
      // Código normal para actualizar en la API
      const token = localStorage.getItem('token') || 
                  localStorage.getItem('auth_token') || 
                  localStorage.getItem('jwt_token');
                  
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      
      // Crear un mensaje automático según el nuevo estado
      const mensajeAutomatico = obtenerMensajeEstado(nuevoEstado);
      
      const response = await fetch('/api/presupuestos/actualizar-estado', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          presupuestoId, 
          estado: nuevoEstado,
          mensaje: mensajeAutomatico,
          // Enviar progreso según estado
          progreso: nuevoEstado === 'completado' ? 100 : 
                   nuevoEstado === 'aceptado' ? 50 :
                   nuevoEstado === 'en_proceso' ? 30 : 
                   nuevoEstado === 'pendiente' ? 10 : 0
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el estado del presupuesto');
      }
      
      // Intentar obtener datos actualizados
      await obtenerPresupuestoDetalle(presupuestoId);
      
      // También actualizar en la lista
      const presupuestosActualizados = presupuestos.map(p => 
        p.id === presupuestoId ? {...p, estado: nuevoEstado} : p
      );
      setPresupuestos(presupuestosActualizados);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al actualizar el estado: ' + error.message);
    }
  };
  
  // Obtener mensaje automático según el estado
  const obtenerMensajeEstado = (estado) => {
    switch(estado) {
      case 'pendiente':
        return 'Hemos recibido tu solicitud y será revisada pronto por nuestro equipo.';
      case 'en_proceso':
        return 'Tu presupuesto está siendo evaluado por nuestro equipo técnico. Te informaremos cuando tengamos una decisión.';
      case 'aceptado':
        return 'Buenas noticias! Tu presupuesto ha sido aprobado. Nos pondremos en contacto contigo para coordinar los próximos pasos.';
      case 'completado':
        return '¡Proyecto completado con éxito! Gracias por confiar en nosotros. Esperamos que disfrutes de tu nuevo mueble.';
      case 'rechazado':
        return 'Lamentamos informarte que no podemos proceder con tu presupuesto en los términos actuales. Te invitamos a contactarnos para discutir alternativas.';
      default:
        return 'Tu presupuesto ha sido actualizado.';
    }
  };
  
  return (
    <div className="min-h-screen bg-[url('/textura-madera.jpg')] bg-cover bg-fixed">
      <div className="min-h-screen backdrop-blur-xl bg-amber-900/30 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Cabecera */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-amber-50 bg-amber-800/40 hover:bg-amber-800/60 px-4 py-2 rounded-lg mb-4"
                >
                  <FiArrowLeft />
                  Volver al Dashboard
                </motion.button>
              </Link>
              <h1 className="text-4xl font-bold text-amber-50 mb-2">
                {mostrarDetalle ? 'Detalle de Presupuesto' : 'Presupuestos de Clientes'}
              </h1>
              <p className="text-amber-200">
                {mostrarDetalle 
                  ? 'Revisa y gestiona el presupuesto seleccionado' 
                  : 'Gestiona las solicitudes de presupuestos de tus clientes'}
              </p>
            </div>
            
            {!mostrarDetalle && (
              <div className="flex gap-4">
                {/* Filtro por estado */}
                <div className="relative">
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="appearance-none bg-amber-800/40 text-amber-50 px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="en_proceso">En proceso</option>
                    <option value="aceptado">Aceptados</option>
                    <option value="rechazado">Rechazados</option>
                    <option value="completado">Completados</option>
                  </select>
                  <FiFilter className="absolute right-3 top-3 text-amber-200" />
                </div>
                
                {/* Botón para refrescar */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => obtenerPresupuestos()}
                  className="bg-amber-700 text-amber-50 p-2 rounded-lg"
                >
                  <FiRefreshCw />
                </motion.button>
              </div>
            )}
          </div>
          
          {/* Contenido */}
          <div className="bg-amber-50/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            {/* Alerta de modo demo */}
            {usandoDatosDemo && (
              <div className="mb-6 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded" role="alert">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <svg className="h-6 w-6 mr-2 flex-shrink-0 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                    </svg>
                    <div>
                      <p className="font-bold">Modo demostración</p>
                      <p className="text-sm">Estás viendo datos de ejemplo porque la tabla de presupuestos no existe aún en tu base de datos.</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm max-w-lg">Para que funcione con datos reales, necesitas crear la tabla en Supabase. Puedes hacer clic en el botón para intentar crearla automáticamente o seguir las instrucciones manuales que aparecerán en la consola.</p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={crearTablaPresupuestos}
                      disabled={creandoTabla}
                      className={`ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition-all ${creandoTabla ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {creandoTabla ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Creando tabla...
                        </>
                      ) : (
                        'Crear tabla ahora'
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Lista de presupuestos */}
            {usandoDatosDemo && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
                <p className="flex items-center text-yellow-800">
                  <FiInfo className="mr-2" /> 
                  Mostrando datos de demostración. Estos son presupuestos de ejemplo.
                </p>
              </div>
            )}
            
            {/* Panel de depuración - Siempre visible */}
            <div className="bg-white border border-amber-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-amber-800 mb-2">Información de depuración</h3>
              <p>Total de presupuestos cargados: <strong>{presupuestos?.length || 0}</strong></p>
              <p>Usando datos de demostración: <strong>{usandoDatosDemo ? 'Sí' : 'No'}</strong></p>
              <p>Filtro actual: <strong>{filtroEstado}</strong></p>
              
              <div className="mt-4 flex space-x-3">
                <button 
                  onClick={() => {
                    console.log('Presupuestos disponibles:', presupuestos);
                    alert(`Se han cargado ${presupuestos?.length || 0} presupuestos. Revisa la consola para más detalles.`);
                  }}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm"
                >
                  Mostrar detalles en consola
                </button>
                
                <button 
                  onClick={() => {
                    setPresupuestos(DATOS_DEMO);
                    setUsandoDatosDemo(true);
                    alert('Cargados 5 presupuestos de demostración');
                  }}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm"
                >
                  Cargar datos de prueba
                </button>
              </div>
            </div>
            
            {/* TABLA PRINCIPAL SIEMPRE VISIBLE */}
            <div className="overflow-x-auto border border-amber-200 rounded-lg">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Fecha</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Cliente</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Producto</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Estado</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Total</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-amber-800">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {presupuestos && presupuestos.length > 0 ? (
                    presupuestos.map((presupuesto) => (
                      <tr key={presupuesto.id || Math.random()} className="hover:bg-amber-50">
                        <td className="py-3 px-4 text-sm">
                          {presupuesto.fecha_creacion ? formatearFecha(presupuesto.fecha_creacion) : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center">
                            <FiUser className="text-amber-600 mr-2" />
                            <span className="font-medium">
                              {presupuesto.usuarios?.nombre || presupuesto.nombre_cliente || 'Cliente'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {presupuesto.usuarios?.email || presupuesto.email_cliente || 'Email no disponible'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{presupuesto.nombre || 'Producto sin nombre'}</div>
                          <div className="text-xs text-gray-500">
                            {presupuesto.material || '-'} - {presupuesto.acabado || '-'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${coloresEstado[presupuesto.estado] || 'bg-gray-100 text-gray-800'}`}>
                            {iconosEstado[presupuesto.estado] || <FiInfo className="mr-1" />}
                            <span className="ml-1 capitalize">{presupuesto.estado?.replace('_', ' ') || 'Desconocido'}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="font-medium">
                            {presupuesto.presupuesto?.total ? 
                              `$${presupuesto.presupuesto.total.toLocaleString('es-ES')}` : 
                              'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {presupuesto.presupuesto?.tiempo_estimado || 'Tiempo no especificado'}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => verDetalle(presupuesto)}
                              className="bg-amber-100 text-amber-700 p-1 rounded"
                              title="Ver detalles"
                            >
                              <FiEye />
                            </motion.button>
                            
                            {/* Solo mostrar opciones de cambio de estado si no está completado ni rechazado */}
                            {(presupuesto.estado !== 'completado' && presupuesto.estado !== 'rechazado') && (
                              <>
                                {presupuesto.estado !== 'aceptado' && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => cambiarEstado(presupuesto.id, 'aceptado')}
                                    className="bg-green-100 text-green-700 p-1 rounded"
                                    title="Aceptar presupuesto"
                                  >
                                    <FiCheckCircle />
                                  </motion.button>
                                )}
                                
                                {presupuesto.estado !== 'rechazado' && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => cambiarEstado(presupuesto.id, 'rechazado')}
                                    className="bg-red-100 text-red-700 p-1 rounded"
                                    title="Rechazar presupuesto"
                                  >
                                    <FiXCircle />
                                  </motion.button>
                                )}
                                
                                {presupuesto.estado === 'aceptado' && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => cambiarEstado(presupuesto.id, 'completado')}
                                    className="bg-purple-100 text-purple-700 p-1 rounded"
                                    title="Marcar como completado"
                                  >
                                    <FiCheckCircle />
                                  </motion.button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-4 px-4 text-center">
                        <div className="text-amber-600 font-medium">No hay presupuestos disponibles</div>
                        <div className="text-gray-500 text-sm mt-1">
                          {filtroEstado !== 'todos' 
                            ? `Prueba a cambiar el filtro de estado o crea nuevos presupuestos`
                            : `No se han encontrado presupuestos en el sistema`}
                        </div>
                        <div className="mt-4">
                          <button 
                            onClick={() => {
                              setPresupuestos(DATOS_DEMO);
                              setUsandoDatosDemo(true);
                            }}
                            className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            Cargar datos de demostración
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Vista detalle */}
            {mostrarDetalle && presupuestoSeleccionado && (
              <div className="h-full overflow-y-auto">
                {/* Cabecera y controles */}
                <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
                  {/* Barra de estado */}
                  <div className={`p-4 ${
                    presupuestoSeleccionado.estado === 'pendiente' ? 'bg-amber-100' :
                    presupuestoSeleccionado.estado === 'en_proceso' ? 'bg-blue-100' :
                    presupuestoSeleccionado.estado === 'aceptado' ? 'bg-green-100' :
                    presupuestoSeleccionado.estado === 'completado' ? 'bg-purple-100' :
                    'bg-red-100'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          presupuestoSeleccionado.estado === 'pendiente' ? 'bg-amber-600 text-white' :
                          presupuestoSeleccionado.estado === 'en_proceso' ? 'bg-blue-600 text-white' :
                          presupuestoSeleccionado.estado === 'aceptado' ? 'bg-green-600 text-white' :
                          presupuestoSeleccionado.estado === 'completado' ? 'bg-purple-600 text-white' :
                          'bg-red-600 text-white'
                        }`}>
                          {iconosEstado[presupuestoSeleccionado.estado]}
                        </span>
                        <div>
                          <h3 className="font-bold">
                            Estado: {presupuestoSeleccionado.estado.charAt(0).toUpperCase() + presupuestoSeleccionado.estado.slice(1)}
                          </h3>
                          <p className="text-sm">
                            {descripcionEstado[presupuestoSeleccionado.estado]}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={volverALista}
                        className="bg-amber-600 text-amber-50 px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <FiArrowLeft /> Volver a la lista
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Info general */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h2 className="text-2xl font-bold text-amber-900 mb-4">
                          {presupuestoSeleccionado.nombre}
                        </h2>
                        
                        {presupuestoSeleccionado.descripcion && (
                          <p className="text-gray-700 mb-4">
                            {presupuestoSeleccionado.descripcion}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center">
                            <FiTag className="mr-1" /> {presupuestoSeleccionado.categoria}
                          </span>
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center">
                            <FiFileText className="mr-1" /> {presupuestoSeleccionado.material}
                          </span>
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center">
                            <FiTool className="mr-1" /> {presupuestoSeleccionado.acabado}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-700 mb-2">
                          <FiUser className="text-amber-600" />
                          <span className="font-medium">
                            {presupuestoSeleccionado.usuarios?.nombre || 'Cliente'} 
                          </span>
                        </div>
                        
                        {presupuestoSeleccionado.usuarios?.email && (
                          <div className="flex items-center gap-2 text-gray-700 mb-2">
                            <span className="w-5"></span>
                            <span className="text-sm">{presupuestoSeleccionado.usuarios.email}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-gray-700 mb-2">
                          <FiCalendar className="text-amber-600" />
                          <span>Solicitado: {formatearFecha(presupuestoSeleccionado.fecha_creacion)}</span>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 p-6 rounded-lg">
                        <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center">
                          <FiDollarSign className="mr-2" /> Detalles del presupuesto
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">${presupuestoSeleccionado.presupuesto?.subtotal.toFixed(2) || '0.00'}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600">Descuento:</span>
                            <span className="font-medium text-green-600">
                              ${presupuestoSeleccionado.presupuesto?.descuento.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          
                          <div className="border-t pt-2 flex justify-between">
                            <span className="font-bold text-gray-800">Total:</span>
                            <span className="font-bold text-amber-800">
                              ${presupuestoSeleccionado.presupuesto?.total.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between pt-2">
                            <span className="text-gray-600">Tiempo estimado:</span>
                            <span className="font-medium">{presupuestoSeleccionado.presupuesto?.tiempo_estimado || 'No especificado'}</span>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="font-bold text-amber-800 mb-2">Dimensiones:</h4>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white p-2 rounded text-center">
                              <span className="block text-xs text-gray-500">Ancho</span>
                              <span className="font-bold">{presupuestoSeleccionado.dimensiones?.ancho || 0} cm</span>
                            </div>
                            <div className="bg-white p-2 rounded text-center">
                              <span className="block text-xs text-gray-500">Alto</span>
                              <span className="font-bold">{presupuestoSeleccionado.dimensiones?.alto || 0} cm</span>
                            </div>
                            <div className="bg-white p-2 rounded text-center">
                              <span className="block text-xs text-gray-500">Profundidad</span>
                              <span className="font-bold">{presupuestoSeleccionado.dimensiones?.profundidad || 0} cm</span>
                            </div>
                          </div>
                        </div>
                        
                        {presupuestoSeleccionado.comentarios && (
                          <div className="mt-4 bg-white p-3 rounded-lg border border-amber-200">
                            <h4 className="font-bold text-amber-800 mb-1">Comentarios del cliente:</h4>
                            <p className="text-gray-700 text-sm">{presupuestoSeleccionado.comentarios}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Acciones de estado */}
                <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-amber-800 mb-4">Cambiar estado del presupuesto</h3>
                    <div className="flex flex-wrap gap-2">{/* Botones de acción */}
                      {/* Acciones para estado pendiente */}
                      {presupuestoSeleccionado.estado === 'pendiente' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => cambiarEstado(presupuestoSeleccionado.id, 'en_proceso')}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                          >
                            <FiEdit /> Iniciar Revisión
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => cambiarEstado(presupuestoSeleccionado.id, 'rechazado')}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                          >
                            <FiXCircle /> Rechazar
                          </motion.button>
                        </>
                      )}
                      
                      {/* Acciones para estado en_proceso */}
                      {presupuestoSeleccionado.estado === 'en_proceso' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => cambiarEstado(presupuestoSeleccionado.id, 'aceptado')}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                          >
                            <FiCheckCircle /> Aprobar
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => cambiarEstado(presupuestoSeleccionado.id, 'rechazado')}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                          >
                            <FiXCircle /> Rechazar
                          </motion.button>
                        </>
                      )}
                      
                      {/* Acciones para estado aceptado */}
                      {presupuestoSeleccionado.estado === 'aceptado' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => cambiarEstado(presupuestoSeleccionado.id, 'completado')}
                          className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <FiCheckCircle /> Marcar como Completado
                        </motion.button>
                      )}
                      
                      {/* Todos los estados pueden volver a pendiente si es necesario */}
                      {presupuestoSeleccionado.estado !== 'pendiente' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => cambiarEstado(presupuestoSeleccionado.id, 'pendiente')}
                          className="bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <FiClock /> Volver a Pendiente
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Progreso del proyecto */}
                <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-amber-800 mb-4">
                      Progreso del proyecto
                    </h3>
                    
                    {/* Mostrar progreso actual */}
                    {presupuestoSeleccionado.progreso && (
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-gray-700">
                            <span className="font-bold">{presupuestoSeleccionado.progreso.porcentaje || 0}%</span> - 
                            <span className="ml-2">{presupuestoSeleccionado.progreso.etapa_actual || 'No iniciado'}</span>
                          </div>
                          <div className="text-gray-500 text-sm">
                            Última actualización: {presupuestoSeleccionado.progreso.fecha_actualizacion ? 
                              formatearFecha(presupuestoSeleccionado.progreso.fecha_actualizacion) : 'N/A'}
                          </div>
                        </div>
                        
                        {/* Barra de progreso */}
                        <div className="w-full h-4 bg-gray-200 rounded-full">
                          <div 
                            className={`h-4 rounded-full ${
                              presupuestoSeleccionado.estado === 'completado' ? 'bg-purple-500' :
                              presupuestoSeleccionado.estado === 'aceptado' ? 'bg-green-500' :
                              presupuestoSeleccionado.estado === 'en_proceso' ? 'bg-blue-500' :
                              presupuestoSeleccionado.estado === 'pendiente' ? 'bg-amber-500' :
                              'bg-gray-500'
                            }`}
                            style={{ width: `${presupuestoSeleccionado.progreso.porcentaje || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Formulario para actualizar progreso */}
                    {['en_proceso', 'aceptado'].includes(presupuestoSeleccionado.estado) && (
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-bold text-amber-800 mb-3">Actualizar progreso</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="progreso" className="block text-sm font-medium text-gray-700 mb-1">
                              Porcentaje completado: {progreso}%
                            </label>
                            <input
                              type="range"
                              id="progreso"
                              min="0"
                              max="100"
                              value={progreso}
                              onChange={(e) => setProgreso(parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="etapaActual" className="block text-sm font-medium text-gray-700 mb-1">
                              Etapa actual
                            </label>
                            <input
                              type="text"
                              id="etapaActual"
                              value={etapaActual}
                              onChange={(e) => setEtapaActual(e.target.value)}
                              placeholder="Ej: Cortando la madera"
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="fechaEstimada" className="block text-sm font-medium text-gray-700 mb-1">
                              Fecha estimada de finalización
                            </label>
                            <input
                              type="date"
                              id="fechaEstimada"
                              value={fechaEstimada}
                              onChange={(e) => setFechaEstimada(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={actualizarProgreso}
                              disabled={actualizandoProgreso}
                              className="bg-amber-600 text-white px-4 py-2 rounded-lg"
                            >
                              {actualizandoProgreso ? 'Guardando...' : 'Actualizar progreso'}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Imágenes adjuntas */}
                {presupuestoSeleccionado.imagenes && presupuestoSeleccionado.imagenes.length > 0 && (
                  <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center">
                        <FiImage className="mr-2" /> Imágenes de referencia
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {presupuestoSeleccionado.imagenes.map((imagen, index) => (
                          <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                            <img 
                              src={imagen} 
                              alt={`Imagen de referencia ${index + 1}`} 
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Comunicaciones con el cliente */}
                <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-amber-800 mb-4">
                      Comunicaciones con el cliente
                    </h3>
                    
                    {/* Historial de mensajes */}
                    <div className="mb-6 max-h-96 overflow-y-auto">
                      {presupuestoSeleccionado.mensajes && presupuestoSeleccionado.mensajes.length > 0 ? (
                        <div className="space-y-3">
                          {presupuestoSeleccionado.mensajes.map((mensaje, index) => (
                            <div 
                              key={index} 
                              className={`p-3 rounded-lg ${mensaje.emisor === 'admin' ? 
                                'bg-amber-50 border-l-4 border-amber-400' : 
                                'bg-blue-50 border-l-4 border-blue-400'
                              }`}
                            >
                              <div className="flex justify-between mb-1">
                                <span className="font-medium text-gray-700">
                                  {mensaje.emisor === 'admin' ? 'Tú (Administrador)' : 'Cliente'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatearFecha(mensaje.fecha)}
                                </span>
                              </div>
                              <p className="text-gray-700">{mensaje.texto}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          <p>No hay mensajes para mostrar</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Formulario para enviar mensaje */}
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-bold text-amber-800 mb-3">Enviar mensaje al cliente</h4>
                      <div className="mb-3">
                        <textarea
                          value={nuevoMensaje}
                          onChange={(e) => setNuevoMensaje(e.target.value)}
                          rows={3}
                          placeholder="Escribe tu mensaje para el cliente..."
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={enviarMensaje}
                          disabled={enviandoMensaje || !nuevoMensaje.trim()}
                          className={`px-4 py-2 rounded-lg ${
                            !nuevoMensaje.trim() ? 
                              'bg-gray-300 text-gray-500 cursor-not-allowed' : 
                              'bg-amber-600 text-white'
                          }`}
                        >
                          {enviandoMensaje ? 'Enviando...' : 'Enviar mensaje'}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PresupuestosAdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminPresupuestos />
    </ProtectedRoute>
  );
} 