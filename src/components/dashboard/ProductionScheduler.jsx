'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiTool, FiUser, FiAlertTriangle, FiArrowRight, FiCheck, FiPlus } from 'react-icons/fi';

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

// Componente principal
const ProductionScheduler = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
        >
          <FiPlus /> Nuevo Proyecto
        </motion.button>
      </div>

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

      {/* Proyectos */}
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
                'bg-green-100 text-green-700'
              }`}>
                {project.prioridad === 'alta' ? 'Prioridad Alta' :
                 project.prioridad === 'media' ? 'Prioridad Media' :
                 'Prioridad Baja'}
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-amber-500" />
                <div>
                  <p className="text-xs text-amber-500">Fecha de entrega</p>
                  <p className="text-sm font-medium text-amber-800">
                    {new Date(project.fechaFin).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <FiTool className="text-amber-500" />
                <div>
                  <p className="text-xs text-amber-500">Complejidad</p>
                  <p className="text-sm font-medium text-amber-800">
                    {project.complejidad.charAt(0).toUpperCase() + project.complejidad.slice(1)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <FiUser className="text-amber-500" />
                <div>
                  <p className="text-xs text-amber-500">Artesanos</p>
                  <p className="text-sm font-medium text-amber-800">
                    {project.artesanos.length} asignados
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <FiClock className="text-amber-500" />
                <div>
                  <p className="text-xs text-amber-500">Estado</p>
                  <p className="text-sm font-medium text-amber-800">
                    {project.estado === 'en_proceso' ? 'En proceso' :
                     project.estado === 'no_iniciado' ? 'No iniciado' :
                     project.estado === 'pausado' ? 'Pausado' : 'Completado'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Barra de progreso */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-amber-700 mb-1">
                <span>Progreso: {project.completado}%</span>
                <span>
                  {project.estado === 'en_proceso' ? 'En fabricación' :
                   project.estado === 'no_iniciado' ? 'Pendiente de inicio' :
                   project.estado === 'pausado' ? 'Trabajo pausado' : 'Finalizado'}
                </span>
              </div>
              <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.completado}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full rounded-full ${
                    project.completado < 20 ? 'bg-red-500' :
                    project.completado < 60 ? 'bg-amber-500' :
                    'bg-green-500'
                  }`}
                />
              </div>
            </div>
            
            {/* Materiales y botón de detalles */}
            <div className="mt-4 flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {project.materiales.slice(0, 2).map((material, i) => (
                  <span key={i} className="bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-xs">
                    {material}
                  </span>
                ))}
                {project.materiales.length > 2 && (
                  <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-xs">
                    +{project.materiales.length - 2} más
                  </span>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => showProjectDetails(project)}
                className="text-amber-600 hover:text-amber-800 flex items-center gap-1 text-sm"
              >
                Ver detalles <FiArrowRight />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
      
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

      {/* Modal de detalles (simplificado) */}
      {isDetailsModalOpen && currentProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 w-3/4 max-w-4xl max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-amber-900">{currentProject.nombre}</h3>
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-amber-500 hover:text-amber-700"
              >
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-amber-800 mb-2">Detalles del Cliente</h4>
                <p className="text-amber-700 mb-1"><span className="font-medium">Cliente:</span> {currentProject.cliente}</p>
                <p className="text-amber-700 mb-1"><span className="font-medium">Proyecto:</span> {currentProject.descripcion}</p>
                <p className="text-amber-700 mb-1">
                  <span className="font-medium">Estado:</span> 
                  {currentProject.estado === 'en_proceso' ? 'En proceso' :
                  currentProject.estado === 'no_iniciado' ? 'No iniciado' :
                  currentProject.estado === 'pausado' ? 'Pausado' : 'Completado'}
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-amber-800 mb-2">Fechas Importantes</h4>
                <p className="text-amber-700 mb-1">
                  <span className="font-medium">Inicio:</span> 
                  {new Date(currentProject.fechaInicio).toLocaleDateString('es-ES')}
                </p>
                <p className="text-amber-700 mb-1">
                  <span className="font-medium">Entrega prevista:</span> 
                  {new Date(currentProject.fechaFin).toLocaleDateString('es-ES')}
                </p>
                <p className="text-amber-700 mb-1">
                  <span className="font-medium">Duración:</span> 
                  {Math.ceil((new Date(currentProject.fechaFin) - new Date(currentProject.fechaInicio)) / (1000 * 60 * 60 * 24))} días
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-bold text-amber-800 mb-2">Materiales Necesarios</h4>
              <div className="flex flex-wrap gap-2">
                {currentProject.materiales.map((material, i) => (
                  <span key={i} className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-sm">
                    {material}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-bold text-amber-800 mb-2">Equipo Asignado</h4>
              <div className="flex flex-wrap gap-2">
                {currentProject.artesanos.map((artesano, i) => (
                  <span key={i} className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-sm flex items-center">
                    <FiUser className="mr-1" /> {artesano}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50"
              >
                Cerrar
              </button>
              <button 
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
              >
                <FiCheck /> Actualizar Estado
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductionScheduler; 