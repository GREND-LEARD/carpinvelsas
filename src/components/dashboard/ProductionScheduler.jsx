'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiTool, FiUser, FiAlertTriangle, FiArrowRight, FiCheck, FiPlus, FiX, FiEdit } from 'react-icons/fi';

// Datos de ejemplo para proyectos
const initialProjects = [
  {
    id: 1,
    nombre: 'Comedor Familia Rodríguez',
    cliente: 'Familia Rodríguez',
    fechaInicio: '2023-11-20',
    fechaFin: '2023-12-15',
    estado: 'en_proceso',
    prioridad: 'alta',
    completado: 85,
    artesanos: ['Juan Pérez', 'Ana García'],
    complejidad: 'media',
    materiales: ['Madera de Roble', 'Barniz Mate', 'Bisagras Premium'],
    descripcion: 'Mesa de comedor y 6 sillas en roble con acabado mate',
    riesgo: 'bajo'
  },
  {
    id: 2,
    nombre: 'Biblioteca Clásica',
    cliente: 'Dr. Martínez',
    fechaInicio: '2023-12-01',
    fechaFin: '2024-01-22',
    estado: 'en_proceso',
    prioridad: 'media',
    completado: 60,
    artesanos: ['Miguel López'],
    complejidad: 'alta',
    materiales: ['Madera de Nogal', 'Barniz Brillante', 'Tornillos 30mm'],
    descripcion: 'Biblioteca empotrada con molduras clásicas y puertas de vidrio',
    riesgo: 'medio'
  },
  {
    id: 3,
    nombre: 'Mueble de Jardín',
    cliente: 'Hotel Paraíso',
    fechaInicio: '2023-12-20',
    fechaFin: '2024-02-10',
    estado: 'no_iniciado',
    prioridad: 'baja',
    completado: 0,
    artesanos: ['Ana García', 'Carlos Sánchez'],
    complejidad: 'media',
    materiales: ['Madera de Pino', 'Barniz para Exteriores', 'Herrajes Inoxidables'],
    descripcion: 'Conjunto de mesa y 4 sillas para terraza con tratamiento para exteriores',
    riesgo: 'bajo'
  },
  {
    id: 4,
    nombre: 'Cocina Integral',
    cliente: 'Apartamentos Vista',
    fechaInicio: '2023-11-15',
    fechaFin: '2024-01-30',
    estado: 'en_proceso',
    prioridad: 'alta',
    completado: 40,
    artesanos: ['Juan Pérez', 'Miguel López', 'Carlos Sánchez'],
    complejidad: 'alta',
    materiales: ['Madera de Roble', 'Laminado Blanco', 'Herrajes Premium', 'Granito'],
    descripcion: 'Cocina completa con isla, alacenas y muebles bajos en dos tonos',
    riesgo: 'alto'
  },
  {
    id: 5,
    nombre: 'Restauración Armario Antiguo',
    cliente: 'Sra. Fernández',
    fechaInicio: '2024-01-10',
    fechaFin: '2024-02-15',
    estado: 'no_iniciado',
    prioridad: 'media',
    completado: 0,
    artesanos: ['Ana García'],
    complejidad: 'alta',
    materiales: ['Tinte para Madera', 'Barniz Antiguo', 'Herrajes de Época'],
    descripcion: 'Restauración de armario del siglo XIX manteniendo su estilo original',
    riesgo: 'medio'
  }
];

// Artesanos disponibles
const artesanos = [
  { id: 1, nombre: 'Juan Pérez', especialidad: 'Carpintería general', proyectosActivos: 2 },
  { id: 2, nombre: 'Ana García', especialidad: 'Acabados y restauración', proyectosActivos: 2 },
  { id: 3, nombre: 'Miguel López', especialidad: 'Ebanistería fina', proyectosActivos: 2 },
  { id: 4, nombre: 'Carlos Sánchez', especialidad: 'Tallado y torneado', proyectosActivos: 2 },
  { id: 5, nombre: 'Laura Martínez', especialidad: 'Tapicería', proyectosActivos: 0 },
];

// Función para calcular la carga de trabajo
const calcularCargaTrabajo = (artesano, projects) => {
  const proyectosDelArtesano = projects.filter(p => 
    p.artesanos.includes(artesano.nombre) && 
    (p.estado === 'en_proceso' || p.estado === 'no_iniciado')
  );
  
  return {
    totalProyectos: proyectosDelArtesano.length,
    horasEstimadas: proyectosDelArtesano.length * 40, // Estimación simple para la demo
    sobrecargado: proyectosDelArtesano.length > 2
  };
};

// Definir posibles estados del proyecto
const ESTADOS_PROYECTO = [
  { id: 'pendiente', nombre: 'Pendiente', color: 'bg-gray-100 text-gray-800' },
  { id: 'aprobado', nombre: 'Aprobado', color: 'bg-blue-100 text-blue-800' },
  { id: 'en_progreso', nombre: 'En Progreso', color: 'bg-amber-100 text-amber-800' },
  { id: 'pausado', nombre: 'Pausado', color: 'bg-orange-100 text-orange-800' },
  { id: 'completado', nombre: 'Completado', color: 'bg-green-100 text-green-800' },
  { id: 'rechazado', nombre: 'Rechazado', color: 'bg-red-100 text-red-800' }
];

// Componente principal
const ProductionScheduler = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estadoProyecto, setEstadoProyecto] = useState('');
  const [actualizando, setActualizando] = useState(false);
  const [mensajeActualizacion, setMensajeActualizacion] = useState({ texto: '', tipo: '' });
  
  // Cargar las solicitudes de proyecto reales
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/proyectos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error al cargar proyectos');
        }
        
        // Transformar los datos al formato esperado por el componente
        const formattedProjects = data.proyectos.map(p => ({
          id: p.id,
          nombre: p.titulo,
          cliente: p.cliente ? `${p.cliente.nombre} ${p.cliente.apellidos}` : 'Cliente sin nombre',
          fechaInicio: p.fecha_solicitud,
          fechaFin: p.fecha_entrega || p.fecha_deseada,
          estado: p.estado === 'pendiente' ? 'no_iniciado' : 
                  p.estado === 'en_progreso' ? 'en_proceso' : p.estado,
          prioridad: p.prioridad || 'normal',
          completado: p.estado === 'completado' ? 100 : 
                     p.estado === 'en_progreso' ? 50 : 
                     p.estado === 'pendiente' ? 0 : 25,
          artesanos: ['Pendiente de asignar'], // Por ahora no tenemos esta información
          complejidad: 'media', // Valor por defecto
          materiales: p.materiales_preferidos || ['No especificado'],
          descripcion: p.descripcion,
          tipo_proyecto: p.tipo_proyecto,
          riesgo: 'bajo'
        }));
        
        setProjects(formattedProjects.length > 0 ? formattedProjects : initialProjects);
        
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        setError(error.message || 'Error al cargar proyectos');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Actualizar estado del proyecto
  const actualizarEstadoProyecto = async () => {
    if (!currentProject || !estadoProyecto || estadoProyecto === currentProject.estado) return;
    
    setActualizando(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/actualizar-proyecto', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: currentProject.id,
          estado: estadoProyecto,
          notificarCliente: true
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el proyecto');
      }
      
      // Actualizar el proyecto en la lista
      setProjects(prev => prev.map(p => 
        p.id === currentProject.id 
          ? { 
              ...p, 
              estado: estadoProyecto === 'pendiente' ? 'no_iniciado' : 
                    estadoProyecto === 'en_proceso' ? 'en_proceso' : estadoProyecto,
              completado: estadoProyecto === 'completado' ? 100 : 
                        estadoProyecto === 'en_proceso' ? 50 : 
                        estadoProyecto === 'pendiente' ? 0 : 25
            } 
          : p
      ));
      
      setMensajeActualizacion({
        texto: 'Estado actualizado correctamente',
        tipo: 'success'
      });
      
      setTimeout(() => {
        setMensajeActualizacion({ texto: '', tipo: '' });
        setIsDetailsModalOpen(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      setMensajeActualizacion({
        texto: error.message || 'Error al actualizar el estado',
        tipo: 'error'
      });
    } finally {
      setActualizando(false);
    }
  };
  
  // Filtrar proyectos por estado
  const filteredProjects = selectedStatus === 'todos' 
    ? projects 
    : projects.filter(p => p.estado === selectedStatus);

  // Estados de los proyectos
  const projectStatuses = [
    { value: 'todos', label: 'Todos', count: projects.length },
    { value: 'no_iniciado', label: 'No Iniciados', count: projects.filter(p => p.estado === 'no_iniciado').length },
    { value: 'en_proceso', label: 'En Proceso', count: projects.filter(p => p.estado === 'en_proceso').length },
    { value: 'pausado', label: 'Pausados', count: projects.filter(p => p.estado === 'pausado').length },
    { value: 'completado', label: 'Completados', count: projects.filter(p => p.estado === 'completado').length },
  ];

  // Función para mostrar detalles del proyecto
  const showProjectDetails = (project) => {
    setCurrentProject(project);
    setEstadoProyecto(project.estado === 'no_iniciado' ? 'pendiente' : 
                     project.estado === 'en_proceso' ? 'en_progreso' : project.estado);
    setIsDetailsModalOpen(true);
  };

  // Verificar si hay artesanos sobrecargados
  const artesanosSobrecargados = artesanos.filter(a => 
    calcularCargaTrabajo(a, projects).sobrecargado
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-amber-50/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-900">Planificación de Producción</h2>
        <a href="/client-portal/proyectos">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
          >
            <FiPlus /> Nuevo Proyecto
          </motion.button>
        </a>
      </div>

      {/* Mensajes de error o cargando */}
      {isLoading && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-3"></div>
            <p className="text-blue-700">Cargando proyectos...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-red-500 text-xl" />
            <div>
              <p className="text-red-800 font-bold">Error al cargar proyectos</p>
              <p className="text-red-700">{error}</p>
              <p className="text-sm text-red-600 mt-2">
                Asegúrate de que la tabla solicitudes_proyectos existe en tu base de datos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alerta de sobrecarga */}
      {artesanosSobrecargados.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-amber-100 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6"
        >
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-amber-500 text-xl" />
            <div>
              <p className="text-amber-800 font-bold">Alerta de sobrecarga de trabajo</p>
              <p className="text-amber-700">
                {artesanosSobrecargados.length} artesanos tienen demasiados proyectos asignados simultaneamente.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filtro de estado de proyectos */}
      <div className="flex space-x-2 mb-6 bg-white p-2 rounded-xl overflow-x-auto">
        {projectStatuses.map(status => (
          <button
            key={status.value}
            onClick={() => setSelectedStatus(status.value)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap ${
              selectedStatus === status.value 
                ? 'bg-amber-500 text-white' 
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            {status.label}
            <span className="bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full">
              {status.count}
            </span>
          </button>
        ))}
      </div>

      {/* Mensaje de no hay proyectos */}
      {filteredProjects.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTool className="text-amber-600 w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-amber-900 mb-2">No hay proyectos {selectedStatus !== 'todos' ? `en estado "${selectedStatus}"` : ''}</h3>
          <p className="text-amber-700 mb-4">
            {selectedStatus === 'todos' 
              ? 'Aún no se ha registrado ningún proyecto en el sistema.' 
              : `No hay proyectos que se encuentren actualmente en estado "${selectedStatus}".`}
          </p>
          <a href="/client-portal/proyectos">
            <button className="bg-amber-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
              <FiPlus /> Crear Nuevo Proyecto
            </button>
          </a>
        </div>
      )}

      {/* Proyectos */}
      {!isLoading && filteredProjects.length > 0 && (
        <div className="space-y-4">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-amber-900">{project.nombre}</h3>
                  <p className="text-amber-700">{project.cliente}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  project.prioridad === 'alta' ? 'bg-red-100 text-red-700' :
                  project.prioridad === 'media' ? 'bg-amber-100 text-amber-700' :
                  project.prioridad === 'baja' ? 'bg-green-100 text-green-700' : 
                  'bg-gray-100 text-gray-700'
                }`}>
                  {project.prioridad === 'alta' ? 'Prioridad Alta' :
                   project.prioridad === 'media' ? 'Prioridad Media' :
                   project.prioridad === 'baja' ? 'Prioridad Baja' : 
                   'Prioridad Normal'}
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-amber-500" />
                  <div>
                    <p className="text-xs text-amber-500">Fecha deseada</p>
                    <p className="text-sm font-medium text-amber-800">
                      {project.fechaFin ? new Date(project.fechaFin).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : 'No especificada'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FiTool className="text-amber-500" />
                  <div>
                    <p className="text-xs text-amber-500">Tipo de proyecto</p>
                    <p className="text-sm font-medium text-amber-800 capitalize">
                      {project.tipo_proyecto || 'Personalizado'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FiUser className="text-amber-500" />
                  <div>
                    <p className="text-xs text-amber-500">Artesanos</p>
                    <p className="text-sm font-medium text-amber-800">
                      {project.artesanos && project.artesanos.length > 0 
                        ? project.artesanos.slice(0, 2).join(', ') + (project.artesanos.length > 2 ? '...' : '')
                        : 'Sin asignar'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">
                    <FiClock />
                  </span>
                  <div>
                    <p className="text-xs text-amber-500">Estado</p>
                    <p className="text-sm font-medium text-amber-800 capitalize">
                      {project.estado === 'no_iniciado' ? 'No iniciado' :
                       project.estado === 'en_proceso' ? 'En proceso' :
                       project.estado === 'pausado' ? 'Pausado' :
                       project.estado === 'completado' ? 'Completado' : project.estado}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-amber-900">Progreso</span>
                  <span className="text-sm text-amber-600">{project.completado}%</span>
                </div>
                <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.completado}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${
                      project.completado < 30 ? 'bg-amber-300' :
                      project.completado < 70 ? 'bg-amber-500' :
                      'bg-amber-600'
                    }`}
                  />
                </div>
              </div>
              
              {project.materiales && project.materiales.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.materiales.map((material, i) => (
                    <span key={i} className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs">
                      {material}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => showProjectDetails(project)}
                  className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-amber-200"
                >
                  Ver detalles <FiArrowRight />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Sección de Artesanos */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-amber-900 mb-4">Carga de Trabajo por Artesano</h3>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-amber-100">
              <tr>
                <th className="py-3 px-4 text-left text-amber-900 font-semibold">Artesano</th>
                <th className="py-3 px-4 text-left text-amber-900 font-semibold">Especialidad</th>
                <th className="py-3 px-4 text-center text-amber-900 font-semibold">Proyectos Activos</th>
                <th className="py-3 px-4 text-center text-amber-900 font-semibold">Carga de Trabajo</th>
                <th className="py-3 px-4 text-center text-amber-900 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {artesanos.map((artesano, index) => {
                const cargaTrabajo = calcularCargaTrabajo(artesano, projects);
                return (
                  <motion.tr 
                    key={artesano.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-amber-100"
                  >
                    <td className="py-3 px-4 text-amber-900 font-medium">{artesano.nombre}</td>
                    <td className="py-3 px-4 text-amber-700">{artesano.especialidad}</td>
                    <td className="py-3 px-4 text-center text-amber-700">{cargaTrabajo.totalProyectos}</td>
                    <td className="py-3 px-4 text-center text-amber-700">~{cargaTrabajo.horasEstimadas}h</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cargaTrabajo.sobrecargado 
                          ? 'bg-red-100 text-red-800' 
                          : cargaTrabajo.totalProyectos > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {cargaTrabajo.sobrecargado 
                          ? 'Sobrecargado' 
                          : cargaTrabajo.totalProyectos > 0
                            ? 'Ocupado'
                            : 'Disponible'
                        }
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalles */}
      {isDetailsModalOpen && currentProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Cabecera del modal */}
            <div className="bg-amber-500 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Detalles del Proyecto</h3>
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-white hover:text-amber-100"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            {/* Contenido del modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna 1: Información básica */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-amber-900 mb-1">{currentProject.nombre}</h2>
                    <p className="text-amber-700 text-lg">{currentProject.cliente}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-amber-600 mb-1">Tipo de Proyecto</h4>
                      <p className="text-amber-900 capitalize">{currentProject.tipo_proyecto || 'Personalizado'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-amber-600 mb-1">Estado Actual</h4>
                      <p className="text-amber-900 capitalize">{
                        currentProject.estado === 'no_iniciado' ? 'Pendiente' :
                        currentProject.estado === 'en_proceso' ? 'En progreso' :
                        currentProject.estado
                      }</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-amber-600 mb-1">Fecha de Solicitud</h4>
                      <p className="text-amber-900">{currentProject.fechaInicio ? new Date(currentProject.fechaInicio).toLocaleDateString('es-ES') : 'No disponible'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-amber-600 mb-1">Fecha Deseada de Entrega</h4>
                      <p className="text-amber-900">{currentProject.fechaFin ? new Date(currentProject.fechaFin).toLocaleDateString('es-ES') : 'No especificada'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-amber-600 mb-1">Descripción</h4>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <p className="text-amber-900 whitespace-pre-line">{currentProject.descripcion}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-amber-600 mb-1">Materiales Preferidos</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.materiales && currentProject.materiales.length > 0 ? (
                        currentProject.materiales.map((material, i) => (
                          <span key={i} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                            {material}
                          </span>
                        ))
                      ) : (
                        <p className="text-amber-700">No se han especificado materiales</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Columna 2: Gestión y estado */}
                <div className="space-y-6">
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-bold text-amber-900 mb-3">Gestión del Proyecto</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-amber-700 mb-1">
                          Cambiar Estado
                        </label>
                        <select
                          value={estadoProyecto || (
                            currentProject.estado === 'no_iniciado' ? 'pendiente' : 
                            currentProject.estado === 'en_proceso' ? 'en_progreso' : 
                            currentProject.estado
                          )}
                          onChange={(e) => setEstadoProyecto(e.target.value)}
                          className="w-full p-2 border border-amber-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          {ESTADOS_PROYECTO.map(estado => (
                            <option key={estado.id} value={estado.id}>
                              {estado.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {mensajeActualizacion.texto && (
                        <div className={`p-3 rounded-lg ${
                          mensajeActualizacion.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {mensajeActualizacion.texto}
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <button
                          onClick={actualizarEstadoProyecto}
                          disabled={actualizando || !estadoProyecto || estadoProyecto === currentProject.estado}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            actualizando || !estadoProyecto || estadoProyecto === currentProject.estado
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-amber-600 text-white hover:bg-amber-700'
                          }`}
                        >
                          {actualizando ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                              Actualizando...
                            </>
                          ) : (
                            <>
                              <FiCheck /> Actualizar Estado
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-bold text-amber-900 mb-3">Información del Cliente</h4>
                    <div className="space-y-2">
                      <p className="text-amber-900">
                        <strong className="text-amber-700">Cliente:</strong> {currentProject.cliente}
                      </p>
                      {/* Puedes añadir más información de contacto si está disponible */}
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <a 
                      href={`/admin/proyectos/editar/${currentProject.id}`}
                      className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 inline-flex items-center gap-2"
                    >
                      <FiEdit /> Editar Proyecto Completo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductionScheduler; 