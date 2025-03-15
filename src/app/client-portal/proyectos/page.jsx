'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFolder, 
  FiClock, 
  FiCalendar, 
  FiDollarSign, 
  FiMessageSquare, 
  FiPlus, 
  FiX, 
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiFileText,
  FiInfo,
  FiSend
} from 'react-icons/fi';
import BreadCrumbs from '@/components/ui/BreadCrumbs';
import FormularioSolicitud from '@/components/proyectos/FormularioSolicitud';

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalSolicitud, setModalSolicitud] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [mensajeComentario, setMensajeComentario] = useState({ tipo: '', texto: '' });

  // Cargar proyectos del usuario
  useEffect(() => {
    const cargarProyectos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró sesión. Inicia sesión nuevamente.');
        }

        const response = await fetch(`/api/client/proyectos?estado=${filtroEstado}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al cargar los proyectos');
        }

        setProyectos(data.proyectos || []);
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    cargarProyectos();
  }, [filtroEstado]);

  // Enviar un nuevo comentario
  const enviarComentario = async () => {
    if (!nuevoComentario.trim() || !proyectoSeleccionado) return;
    
    setEnviandoComentario(true);
    setMensajeComentario({ tipo: '', texto: '' });
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró sesión. Inicia sesión nuevamente.');
      }
      
      const response = await fetch('/api/client/comentar-proyecto', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          proyecto_id: proyectoSeleccionado.id,
          mensaje: nuevoComentario
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el comentario');
      }
      
      // Actualizar proyecto con el nuevo comentario
      setProyectoSeleccionado({
        ...proyectoSeleccionado,
        comentarios: [
          ...proyectoSeleccionado.comentarios,
          data.comentario
        ]
      });
      
      // Actualizar también en la lista de proyectos
      setProyectos(proyectos.map(p => 
        p.id === proyectoSeleccionado.id 
          ? {
              ...p,
              comentarios: [
                ...p.comentarios,
                data.comentario
              ]
            }
          : p
      ));
      
      setNuevoComentario('');
      setMensajeComentario({
        tipo: 'success',
        texto: 'Comentario enviado correctamente'
      });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setMensajeComentario({ tipo: '', texto: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      setMensajeComentario({
        tipo: 'error',
        texto: error.message
      });
    } finally {
      setEnviandoComentario(false);
    }
  };

  // Manejar nueva solicitud de proyecto
  const handleNuevaSolicitud = (solicitud) => {
    // Añadir la nueva solicitud a la lista de proyectos
    setProyectos([solicitud, ...proyectos]);
  };

  // Abrir modal de detalles
  const abrirDetalles = (proyecto) => {
    setProyectoSeleccionado(proyecto);
    setModalDetalleAbierto(true);
  };

  // Migas de pan para navegación
  const breadcrumbs = [
    { label: 'Inicio', href: '/client-portal' },
    { label: 'Mis Proyectos', href: '/client-portal/proyectos' }
  ];

  // Mapeo de estados a etiquetas visuales
  const estadosProyecto = {
    pendiente: { nombre: 'Pendiente', color: 'bg-gray-100 text-gray-800' },
    aprobado: { nombre: 'Aprobado', color: 'bg-blue-100 text-blue-800' },
    en_progreso: { nombre: 'En Proceso', color: 'bg-amber-100 text-amber-800' },
    pausado: { nombre: 'Pausado', color: 'bg-orange-100 text-orange-800' },
    completado: { nombre: 'Completado', color: 'bg-green-100 text-green-800' },
    rechazado: { nombre: 'Rechazado', color: 'bg-red-100 text-red-800' }
  };

  // Filtros disponibles
  const filtros = [
    { id: 'todos', nombre: 'Todos' },
    { id: 'pendiente', nombre: 'Pendientes' },
    { id: 'aprobado', nombre: 'Aprobados' },
    { id: 'en_progreso', nombre: 'En Proceso' },
    { id: 'completado', nombre: 'Completados' },
    { id: 'rechazado', nombre: 'Rechazados' }
  ];

  return (
    <div className="px-4 sm:px-6 py-8 w-full max-w-7xl mx-auto">
      <BreadCrumbs items={breadcrumbs} />
      
      <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800"
        >
          Mis Proyectos
        </motion.h1>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalSolicitud(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" /> Solicitar Nuevo Proyecto
        </motion.button>
      </div>
      
      {/* Filtros */}
      <div className="mt-6 overflow-x-auto">
        <div className="flex space-x-2 p-1 bg-gray-50 rounded-lg">
          {filtros.map(filtro => (
            <button
              key={filtro.id}
              onClick={() => setFiltroEstado(filtro.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                filtroEstado === filtro.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filtro.nombre}
            </button>
          ))}
        </div>
      </div>
      
      {/* Estado de carga */}
      {isLoading ? (
        <div className="mt-8 bg-white p-8 rounded-xl shadow-md flex justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Cargando proyectos...</p>
          </div>
        </div>
      ) : error ? (
        <div className="mt-8 bg-red-50 p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-3">
            <FiAlertCircle className="text-red-500 text-xl" />
            <div>
              <h3 className="font-medium text-red-800">Error al cargar proyectos</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : proyectos.length === 0 ? (
        <div className="mt-8 bg-white p-8 rounded-xl shadow-md text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFolder className="text-blue-500 w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No hay proyectos {filtroEstado !== 'todos' ? `con estado "${filtros.find(f => f.id === filtroEstado)?.nombre}"` : ''}</h3>
          <p className="text-gray-600 mb-6">
            {filtroEstado === 'todos' 
              ? 'Aún no has solicitado ningún proyecto. Comienza solicitando un nuevo proyecto personalizado.' 
              : `No tienes proyectos que se encuentren actualmente con estado "${filtros.find(f => f.id === filtroEstado)?.nombre}".`}
          </p>
          <button
            onClick={() => setModalSolicitud(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" /> Solicitar Primer Proyecto
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {proyectos.map((proyecto, index) => (
            <motion.div
              key={proyecto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => abrirDetalles(proyecto)}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{proyecto.titulo}</h3>
                
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    estadosProyecto[proyecto.estado]?.color || 'bg-gray-100 text-gray-800'
                  }`}>
                    {estadosProyecto[proyecto.estado]?.nombre || 'Desconocido'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{proyecto.descripcion}</p>
                
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <FiCalendar className="mr-2" />
                    <span>Solicitado: {new Date(proyecto.fecha_solicitud).toLocaleDateString('es-ES')}</span>
                  </div>
                  
                  {proyecto.fecha_deseada && (
                    <div className="flex items-center">
                      <FiClock className="mr-2" />
                      <span>Fecha deseada: {new Date(proyecto.fecha_deseada).toLocaleDateString('es-ES')}</span>
                    </div>
                  )}
                  
                  {proyecto.presupuesto && (
                    <div className="flex items-center">
                      <FiDollarSign className="mr-2" />
                      <span>Presupuesto: {proyecto.presupuesto} €</span>
                    </div>
                  )}
                  
                  {proyecto.comentarios && proyecto.comentarios.length > 0 && (
                    <div className="flex items-center">
                      <FiMessageSquare className="mr-2" />
                      <span>{proyecto.comentarios.length} comentario{proyecto.comentarios.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Modal de solicitud de proyecto */}
      <FormularioSolicitud
        isOpen={modalSolicitud}
        onClose={() => setModalSolicitud(false)}
        onSubmit={handleNuevaSolicitud}
      />
      
      {/* Modal de detalles del proyecto */}
      <AnimatePresence>
        {modalDetalleAbierto && proyectoSeleccionado && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Cabecera */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Detalles del Proyecto</h2>
                <button 
                  onClick={() => setModalDetalleAbierto(false)}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              {/* Contenido */}
              <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
                <div className="p-6">
                  {/* Título y estado */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">{proyectoSeleccionado.titulo}</h1>
                      <p className="text-gray-500">
                        Solicitado el {new Date(proyectoSeleccionado.fecha_solicitud).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      estadosProyecto[proyectoSeleccionado.estado]?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {estadosProyecto[proyectoSeleccionado.estado]?.nombre || 'Desconocido'}
                    </span>
                  </div>
                  
                  {/* Descripción */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                      <FiFileText className="mr-2 text-blue-500" /> Descripción
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{proyectoSeleccionado.descripcion}</p>
                    </div>
                  </div>
                  
                  {/* Detalles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">Detalles del Proyecto</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <span className="text-gray-500 font-medium w-1/3">Tipo:</span>
                          <span className="text-gray-800 capitalize">{proyectoSeleccionado.tipo_proyecto || 'Personalizado'}</span>
                        </div>
                        
                        {proyectoSeleccionado.medidas && (
                          <div className="flex items-start">
                            <span className="text-gray-500 font-medium w-1/3">Medidas:</span>
                            <span className="text-gray-800">{proyectoSeleccionado.medidas}</span>
                          </div>
                        )}
                        
                        {proyectoSeleccionado.materiales_preferidos && proyectoSeleccionado.materiales_preferidos.length > 0 && (
                          <div className="flex items-start">
                            <span className="text-gray-500 font-medium w-1/3">Materiales:</span>
                            <div className="flex flex-wrap gap-1">
                              {proyectoSeleccionado.materiales_preferidos.map((material, i) => (
                                <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                                  {material}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-start">
                          <span className="text-gray-500 font-medium w-1/3">Prioridad:</span>
                          <span className="text-gray-800 capitalize">{proyectoSeleccionado.prioridad || 'Normal'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-3">Fechas y Presupuesto</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <span className="text-gray-500 font-medium w-1/3">Fecha solicitada:</span>
                          <span className="text-gray-800">
                            {new Date(proyectoSeleccionado.fecha_solicitud).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        
                        {proyectoSeleccionado.fecha_deseada && (
                          <div className="flex items-start">
                            <span className="text-gray-500 font-medium w-1/3">Fecha deseada:</span>
                            <span className="text-gray-800">
                              {new Date(proyectoSeleccionado.fecha_deseada).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        )}
                        
                        {proyectoSeleccionado.fecha_entrega && (
                          <div className="flex items-start">
                            <span className="text-gray-500 font-medium w-1/3">Fecha entrega:</span>
                            <span className="text-gray-800">
                              {new Date(proyectoSeleccionado.fecha_entrega).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        )}
                        
                        {proyectoSeleccionado.presupuesto_estimado && (
                          <div className="flex items-start">
                            <span className="text-gray-500 font-medium w-1/3">Presupuesto estimado:</span>
                            <span className="text-gray-800">{proyectoSeleccionado.presupuesto_estimado} €</span>
                          </div>
                        )}
                        
                        {proyectoSeleccionado.presupuesto && (
                          <div className="flex items-start">
                            <span className="text-gray-500 font-medium w-1/3">Presupuesto final:</span>
                            <span className="text-gray-800 font-semibold">{proyectoSeleccionado.presupuesto} €</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Notas adicionales */}
                  {proyectoSeleccionado.notas_adicionales && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Notas Adicionales</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-line">{proyectoSeleccionado.notas_adicionales}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Comentarios */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                      <FiMessageSquare className="mr-2 text-blue-500" /> Comunicación
                    </h3>
                    
                    {proyectoSeleccionado.comentarios && proyectoSeleccionado.comentarios.length > 0 ? (
                      <div className="space-y-4 mb-4">
                        {proyectoSeleccionado.comentarios.map((comentario, index) => (
                          <div 
                            key={comentario.id || index}
                            className={`p-3 rounded-lg ${
                              comentario.admin 
                                ? 'bg-blue-50 ml-8' 
                                : 'bg-gray-50 mr-8'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className={`font-medium ${comentario.admin ? 'text-blue-700' : 'text-gray-700'}`}>
                                {comentario.admin ? 'Carpintería Vela' : 'Tú'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {comentario.fecha 
                                  ? new Date(comentario.fecha).toLocaleDateString('es-ES', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : 'Fecha no disponible'
                                }
                              </span>
                            </div>
                            <p className="text-gray-700">{comentario.mensaje}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg text-center mb-4">
                        <FiInfo className="mx-auto text-gray-400 mb-2 w-6 h-6" />
                        <p className="text-gray-600">No hay comentarios en este proyecto.</p>
                      </div>
                    )}
                    
                    {/* Formulario para nuevo comentario */}
                    <div className="bg-white rounded-lg border">
                      {mensajeComentario.texto && (
                        <div className={`px-4 py-3 ${
                          mensajeComentario.tipo === 'error' 
                            ? 'bg-red-50 text-red-700 border-b border-red-100' 
                            : 'bg-green-50 text-green-700 border-b border-green-100'
                        } rounded-t-lg flex items-center gap-2`}>
                          {mensajeComentario.tipo === 'error' ? (
                            <FiAlertCircle className="flex-shrink-0" />
                          ) : (
                            <FiCheckCircle className="flex-shrink-0" />
                          )}
                          {mensajeComentario.texto}
                        </div>
                      )}
                      
                      <div className="p-3">
                        <textarea
                          value={nuevoComentario}
                          onChange={(e) => setNuevoComentario(e.target.value)}
                          placeholder="Escribe un comentario..."
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={enviarComentario}
                            disabled={enviandoComentario || !nuevoComentario.trim()}
                            className={`inline-flex items-center px-4 py-2 rounded ${
                              enviandoComentario || !nuevoComentario.trim()
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {enviandoComentario ? (
                              <>
                                <FiLoader className="animate-spin mr-2" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <FiSend className="mr-2" />
                                Enviar
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 