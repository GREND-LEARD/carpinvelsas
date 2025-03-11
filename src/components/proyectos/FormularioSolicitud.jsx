'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiCalendar, 
  FiDollarSign,
  FiTool,
  FiList,
  FiImage,
  FiLoader
} from 'react-icons/fi';

const tiposProyecto = [
  { id: 'mueble_salon', nombre: 'Mueble de Salón', descripcion: 'Armarios, estanterías, mesas...' },
  { id: 'mueble_cocina', nombre: 'Mueble de Cocina', descripcion: 'Alacenas, encimeras, islas...' },
  { id: 'mueble_bano', nombre: 'Mueble de Baño', descripcion: 'Tocadores, espejos, lavabos...' },
  { id: 'mueble_dormitorio', nombre: 'Mueble de Dormitorio', descripcion: 'Camas, mesitas, armarios...' },
  { id: 'mueble_jardin', nombre: 'Mueble de Jardín', descripcion: 'Mesas, sillas, pérgolas...' },
  { id: 'restauracion', nombre: 'Restauración', descripcion: 'Reparación y restauración de muebles antiguos' },
  { id: 'carpinteria_estructural', nombre: 'Carpintería Estructural', descripcion: 'Puertas, ventanas, suelos...' },
  { id: 'personalizado', nombre: 'Proyecto Personalizado', descripcion: 'Según tus especificaciones únicas' },
];

const tiposMaterial = [
  { id: 'pino', nombre: 'Pino', descripcion: 'Económico y versátil' },
  { id: 'roble', nombre: 'Roble', descripcion: 'Duradero y elegante' },
  { id: 'nogal', nombre: 'Nogal', descripcion: 'Oscuro y lujoso' },
  { id: 'cerezo', nombre: 'Cerezo', descripcion: 'Cálido y refinado' },
  { id: 'haya', nombre: 'Haya', descripcion: 'Resistente y flexible' },
  { id: 'abedul', nombre: 'Abedul', descripcion: 'Claro y ligero' },
  { id: 'bambu', nombre: 'Bambú', descripcion: 'Sostenible y exótico' },
  { id: 'mdf', nombre: 'MDF', descripcion: 'Para proyectos económicos' },
  { id: 'otro', nombre: 'Otro material', descripcion: 'A especificar en la descripción' },
];

export default function FormularioSolicitud({ isOpen, onClose, onSubmit, userId }) {
  const [paso, setPaso] = useState(1);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [enviando, setEnviando] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    tipoProyecto: 'personalizado',
    materialesPreferidos: [],
    medidas: '',
    descripcion: '',
    presupuestoEstimado: '',
    fechaDeseada: '',
    referencias: '',
    prioridad: 'normal',
    notasAdicionales: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMaterialChange = (materialId) => {
    const materiales = [...formData.materialesPreferidos];
    
    if (materiales.includes(materialId)) {
      // Quitar el material
      const updatedMateriales = materiales.filter(id => id !== materialId);
      setFormData(prev => ({ ...prev, materialesPreferidos: updatedMateriales }));
    } else {
      // Añadir el material (máximo 3)
      if (materiales.length < 3) {
        materiales.push(materialId);
        setFormData(prev => ({ ...prev, materialesPreferidos: materiales }));
      } else {
        setMensaje({ 
          texto: 'Puedes seleccionar hasta 3 materiales preferidos', 
          tipo: 'warning' 
        });
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
      }
    }
  };

  const validarPaso = () => {
    switch (paso) {
      case 1:
        if (!formData.titulo.trim()) {
          setMensaje({ 
            texto: 'Por favor, añade un título para tu proyecto', 
            tipo: 'error' 
          });
          return false;
        }
        break;
      case 2:
        if (!formData.descripcion.trim()) {
          setMensaje({ 
            texto: 'Por favor, describe tu proyecto con más detalle', 
            tipo: 'error' 
          });
          return false;
        }
        break;
    }
    setMensaje({ texto: '', tipo: '' });
    return true;
  };

  const avanzarPaso = () => {
    if (validarPaso()) {
      setPaso(prev => prev + 1);
    }
  };

  const retrocederPaso = () => {
    setPaso(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarPaso()) return;
    
    setEnviando(true);
    setMensaje({ texto: '', tipo: '' });
    
    try {
      // Formatear datos correctamente
      const datosFormateados = {
        ...formData,
        // Asegurar que materialesPreferidos sea un array
        materialesPreferidos: Array.isArray(formData.materialesPreferidos) 
          ? formData.materialesPreferidos 
          : formData.materialesPreferidos ? [formData.materialesPreferidos] : [],
        // Convertir presupuestoEstimado a número
        presupuestoEstimado: formData.presupuestoEstimado 
          ? parseFloat(formData.presupuestoEstimado) 
          : null
      };
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/client/solicitar-proyecto', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosFormateados)
      });

      const data = await response.json();
      
      if (response.ok) {
        setMensaje({ 
          texto: 'Solicitud enviada correctamente', 
          tipo: 'success' 
        });
        setTimeout(() => {
          setMensaje({ texto: '', tipo: '' });
          onSubmit(data.solicitud);
          resetForm();
          onClose();
        }, 2000);
      } else {
        throw new Error(data.message || 'Error al enviar la solicitud');
      }
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setMensaje({ 
        texto: error.message || 'Error al enviar la solicitud. Intenta nuevamente.', 
        tipo: 'error' 
      });
    } finally {
      setEnviando(false);
    }
  };

  const resetForm = () => {
    setPaso(1);
    setFormData({
      titulo: '',
      tipoProyecto: 'personalizado',
      materialesPreferidos: [],
      medidas: '',
      descripcion: '',
      presupuestoEstimado: '',
      fechaDeseada: '',
      referencias: '',
      prioridad: 'normal',
      notasAdicionales: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
      >
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {paso === 1 && "Solicitar Nuevo Proyecto"}
            {paso === 2 && "Descripción del Proyecto"}
            {paso === 3 && "Detalles Adicionales"}
            {paso === 4 && "Confirmar Solicitud"}
          </h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 focus:outline-none"
            disabled={enviando}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Indicador de progreso */}
        <div className="px-6 py-3 border-b">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map(step => (
              <div 
                key={step} 
                className={`flex flex-col items-center ${paso >= step ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  paso > step ? 'bg-blue-600 text-white border-blue-600' :
                  paso === step ? 'border-blue-600 text-blue-600' :
                  'border-gray-300 text-gray-400'
                }`}>
                  {paso > step ? (
                    <FiCheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                <span className="mt-1 text-xs hidden md:block">
                  {step === 1 && "Información básica"}
                  {step === 2 && "Descripción"}
                  {step === 3 && "Detalles"}
                  {step === 4 && "Confirmación"}
                </span>
              </div>
            ))}
          </div>
        </div>
  
        {/* Mensaje de error o éxito */}
        <AnimatePresence>
          {mensaje.texto && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`px-6 py-3 ${
                mensaje.tipo === 'success' ? 'bg-green-50 text-green-700' :
                mensaje.tipo === 'warning' ? 'bg-amber-50 text-amber-700' :
                'bg-red-50 text-red-700'
              } flex items-center`}
            >
              {mensaje.tipo === 'success' ? (
                <FiCheckCircle className="mr-2" />
              ) : mensaje.tipo === 'warning' ? (
                <FiAlertCircle className="mr-2" />
              ) : (
                <FiAlertCircle className="mr-2" />
              )}
              {mensaje.texto}
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-6">
            {/* Paso 1: Información básica */}
            {paso === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Título del Proyecto *
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    placeholder="Ej: Mesa de comedor personalizada"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Un título claro que describa tu proyecto
                  </p>
                </div>
  
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Tipo de Proyecto
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tiposProyecto.map(tipo => (
                      <div
                        key={tipo.id}
                        onClick={() => setFormData(prev => ({ ...prev, tipoProyecto: tipo.id }))}
                        className={`border ${
                          formData.tipoProyecto === tipo.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                        } rounded-lg p-3 cursor-pointer transition-colors`}
                      >
                        <div className="flex items-start">
                          <div className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 mt-1 ${
                            formData.tipoProyecto === tipo.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {formData.tipoProyecto === tipo.id && (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className={`font-medium ${
                              formData.tipoProyecto === tipo.id ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                              {tipo.nombre}
                            </h3>
                            <p className="text-gray-500 text-sm">{tipo.descripcion}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
  
            {/* Paso 2: Descripción detallada */}
            {paso === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Descripción Detallada *
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Describe tu proyecto con todos los detalles posibles: medidas, funcionalidad, estilos de referencia, etc."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Cuanta más información nos proporciones, mejor podremos entender tus necesidades
                  </p>
                </div>
  
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Materiales Preferidos
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {tiposMaterial.map(material => (
                      <div
                        key={material.id}
                        onClick={() => handleMaterialChange(material.id)}
                        className={`border ${
                          formData.materialesPreferidos.includes(material.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                        } rounded-lg p-3 cursor-pointer transition-colors`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-sm border flex-shrink-0 mr-2 ${
                            formData.materialesPreferidos.includes(material.id)
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {formData.materialesPreferidos.includes(material.id) && (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className={`text-sm font-medium ${
                              formData.materialesPreferidos.includes(material.id) ? 'text-blue-700' : 'text-gray-700'
                            }`}>
                              {material.nombre}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Puedes seleccionar hasta 3 materiales preferidos
                  </p>
                </div>
  
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Medidas (si aplica)
                  </label>
                  <input
                    type="text"
                    name="medidas"
                    value={formData.medidas}
                    onChange={handleChange}
                    placeholder="Ej: 150cm x 80cm x 75cm (largo x ancho x alto)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </motion.div>
            )}
  
            {/* Paso 3: Detalles adicionales */}
            {paso === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Presupuesto Estimado
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="presupuestoEstimado"
                        value={formData.presupuestoEstimado}
                        onChange={handleChange}
                        placeholder="Ej: 500-800"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      Un rango aproximado de presupuesto (opcional)
                    </p>
                  </div>
  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Fecha Deseada de Entrega
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="fechaDeseada"
                        value={formData.fechaDeseada}
                        onChange={handleChange}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      Fecha aproximada para la entrega (opcional)
                    </p>
                  </div>
                </div>
  
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Enlaces de Referencia
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiImage className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="referencias"
                      value={formData.referencias}
                      onChange={handleChange}
                      placeholder="Ej: https://ejemplo.com/imagen-referencia"
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Enlaces a imágenes o páginas de referencia (opcional)
                  </p>
                </div>
  
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Prioridad
                  </label>
                  <select
                    name="prioridad"
                    value={formData.prioridad}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="baja">Baja - No tengo prisa</option>
                    <option value="normal">Normal - Plazo estándar</option>
                    <option value="alta">Alta - Necesito prioridad</option>
                    <option value="urgente">Urgente - Lo antes posible</option>
                  </select>
                </div>
  
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Notas Adicionales
                  </label>
                  <textarea
                    name="notasAdicionales"
                    value={formData.notasAdicionales}
                    onChange={handleChange}
                    placeholder="Cualquier información adicional que consideres relevante"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </motion.div>
            )}
  
            {/* Paso 4: Confirmación */}
            {paso === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-4">Resumen de tu solicitud</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex">
                      <span className="font-medium w-1/3 text-gray-600">Título:</span>
                      <span className="text-gray-800">{formData.titulo}</span>
                    </div>
                    
                    <div className="flex">
                      <span className="font-medium w-1/3 text-gray-600">Tipo de proyecto:</span>
                      <span className="text-gray-800">
                        {tiposProyecto.find(t => t.id === formData.tipoProyecto)?.nombre || formData.tipoProyecto}
                      </span>
                    </div>
                    
                    <div className="flex">
                      <span className="font-medium w-1/3 text-gray-600">Materiales preferidos:</span>
                      <span className="text-gray-800">
                        {formData.materialesPreferidos.length > 0 
                          ? formData.materialesPreferidos.map(id => 
                              tiposMaterial.find(m => m.id === id)?.nombre
                            ).join(', ')
                          : 'No especificado'
                        }
                      </span>
                    </div>
                    
                    <div className="flex">
                      <span className="font-medium w-1/3 text-gray-600">Medidas:</span>
                      <span className="text-gray-800">
                        {formData.medidas || 'No especificado'}
                      </span>
                    </div>
                    
                    <div className="flex">
                      <span className="font-medium w-1/3 text-gray-600">Presupuesto:</span>
                      <span className="text-gray-800">
                        {formData.presupuestoEstimado ? `${formData.presupuestoEstimado} €` : 'No especificado'}
                      </span>
                    </div>
                    
                    <div className="flex">
                      <span className="font-medium w-1/3 text-gray-600">Fecha deseada:</span>
                      <span className="text-gray-800">
                        {formData.fechaDeseada || 'No especificada'}
                      </span>
                    </div>
                    
                    <div className="flex">
                      <span className="font-medium w-1/3 text-gray-600">Prioridad:</span>
                      <span className="text-gray-800 capitalize">
                        {formData.prioridad}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Descripción:</h4>
                    <p className="text-gray-700 text-sm bg-white p-3 rounded border border-gray-200">
                      {formData.descripcion}
                    </p>
                  </div>
                  
                  {formData.notasAdicionales && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-800 mb-2">Notas adicionales:</h4>
                      <p className="text-gray-700 text-sm bg-white p-3 rounded border border-gray-200">
                        {formData.notasAdicionales}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-blue-800 text-sm">
                    <strong>Siguiente paso:</strong> Al enviar esta solicitud, nuestro equipo la revisará y te contactará lo antes posible para discutir los detalles y proporcionar un presupuesto más preciso.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
  
          {/* Botones de navegación */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            {paso > 1 ? (
              <button
                type="button"
                onClick={retrocederPaso}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={enviando}
              >
                Anterior
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={enviando}
              >
                Cancelar
              </button>
            )}
  
            {paso < 4 ? (
              <button
                type="button"
                onClick={avanzarPaso}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={enviando}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                disabled={enviando}
              >
                {enviando ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Solicitud'
                )}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
} 