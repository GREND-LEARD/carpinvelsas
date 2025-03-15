'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiKey, FiSave, FiAlertCircle, FiCheckCircle, FiLock, FiInfo, FiMapPin, FiHome, FiEdit } from 'react-icons/fi';
import BreadCrumbs from '@/components/ui/BreadCrumbs';

export default function PerfilPage() {
const [usuario, setUsuario] = useState(null);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState(null);
const [guardando, setGuardando] = useState(false);
const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
const [mostrarCambioPassword, setMostrarCambioPassword] = useState(false);

  // Estados para el formulario del perfil
const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigo_postal: '',
    provincia: ''
});

  // Estados para el cambio de contraseña
const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

  // Cargar datos del usuario
useEffect(() => {
    const cargarUsuario = async () => {
    setCargando(true);
    setError(null);
    setMensaje({ tipo: '', texto: '' });

    try {
        const token = localStorage.getItem('token');
        if (!token) {
        throw new Error('No se encontró sesión. Inicia sesión nuevamente.');
        }

        const response = await fetch('/api/user/profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.message || 'Error al cargar el perfil');
        }

        setUsuario(data.usuario);
        setFormData({
        nombre: data.usuario.nombre || '',
        apellidos: data.usuario.apellidos || '',
        email: data.usuario.email || '',
        telefono: data.usuario.telefono || '',
        direccion: data.usuario.direccion || '',
        ciudad: data.usuario.ciudad || '',
        codigo_postal: data.usuario.codigo_postal || '',
        provincia: data.usuario.provincia || ''
        });
    } catch (error) {
        console.error('Error al cargar perfil:', error);
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuario();
  }, []);

  // Manejar cambios en el formulario de perfil
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en el formulario de cambio de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar cambios en el perfil
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró sesión. Inicia sesión nuevamente.');
      }

      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el perfil');
      }

      setUsuario(data.usuario);
      setMensaje({
        tipo: 'success',
        texto: 'Perfil actualizado correctamente'
      });

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setMensaje({ tipo: '', texto: '' });
      }, 3000);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setMensaje({
        tipo: 'error',
        texto: error.message
      });
    } finally {
      setGuardando(false);
    }
  };

  // Cambiar contraseña
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMensaje({
        tipo: 'error',
        texto: 'Las contraseñas nuevas no coinciden'
      });
      return;
    }
    
    // Validar que la contraseña tenga al menos 8 caracteres
    if (passwordData.newPassword.length < 8) {
      setMensaje({
        tipo: 'error',
        texto: 'La contraseña debe tener al menos 8 caracteres'
      });
      return;
    }

    setGuardando(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró sesión. Inicia sesión nuevamente.');
      }

      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al cambiar la contraseña');
      }

      setMensaje({
        tipo: 'success',
        texto: 'Contraseña actualizada correctamente'
      });

      // Limpiar formulario y cerrar sección
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Cerrar sección después de 2 segundos
      setTimeout(() => {
        setMostrarCambioPassword(false);
        setMensaje({ tipo: '', texto: '' });
      }, 2000);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setMensaje({
        tipo: 'error',
        texto: error.message
      });
    } finally {
      setGuardando(false);
    }
  };

  // Migas de pan para navegación
  const breadcrumbs = [
    { label: 'Inicio', href: '/client-portal' },
    { label: 'Mi Perfil', href: '/client-portal/perfil' }
  ];

  return (
    <div className="px-4 sm:px-6 py-8 w-full max-w-7xl mx-auto">
      <BreadCrumbs items={breadcrumbs} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-5"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
          
          {usuario && (
            <div className="mt-3 md:mt-0 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100 shadow-sm">
              <span className="text-blue-800 text-sm font-medium">
                <FiUser className="inline-block mr-1" /> {usuario.rol === 'admin' ? 'Administrador' : 'Cliente'}
              </span>
            </div>
          )}
        </div>
        
        {/* Mensajes de error o éxito */}
        {mensaje.texto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              mensaje.tipo === 'error' 
                ? 'bg-red-50 border-l-4 border-red-500 text-red-700'
                : 'bg-green-50 border-l-4 border-green-500 text-green-700'
            }`}
          >
            {mensaje.tipo === 'error' ? (
              <FiAlertCircle className="flex-shrink-0 h-5 w-5" />
            ) : (
              <FiCheckCircle className="flex-shrink-0 h-5 w-5" />
            )}
            <p>{mensaje.texto}</p>
          </motion.div>
        )}
        
        {/* Indicador de carga */}
        {cargando ? (
          <div className="w-full bg-white rounded-xl shadow-md overflow-hidden p-8 flex justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Cargando información de perfil...</p>
            </div>
          </div>
        ) : error ? (
          <div className="w-full bg-red-50 rounded-xl shadow-md overflow-hidden p-8">
            <div className="flex gap-3 items-center text-red-700">
              <FiAlertCircle className="h-6 w-6" />
              <p className="font-medium">{error}</p>
            </div>
            <p className="mt-4 text-red-600">Por favor, intenta recargar la página o inicia sesión nuevamente.</p>
          </div>
        ) : (
          <>
            {/* Tarjeta de perfil */}
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              {/* Formulario de perfil */}
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden p-6 flex-1">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <FiUser className="mr-2 text-blue-600" /> Información Personal
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Actualiza tus datos personales</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Apellidos
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 shadow-sm focus:outline-none cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-gray-500">El correo electrónico no se puede cambiar</p>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Teléfono
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-b py-4 my-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <FiMapPin className="mr-2 text-blue-600" /> Dirección de Entrega
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Información para entregas y visitas</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Dirección
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiHome className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      name="codigo_postal"
                      value={formData.codigo_postal}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength="5"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Provincia
                    </label>
                    <input
                      type="text"
                      name="provincia"
                      value={formData.provincia}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={guardando}
                    className={`flex items-center px-4 py-2 rounded-md text-white ${
                      guardando ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {guardando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Guardar Cambios
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
              
              {/* Columna lateral */}
              <div className="lg:w-1/3 space-y-6">
                {/* Sección de cambio de contraseña */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setMostrarCambioPassword(!mostrarCambioPassword)}
                  >
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <FiKey className="mr-2 text-blue-600" /> Seguridad
                    </h2>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <FiEdit className="mr-1" />
                      {mostrarCambioPassword ? 'Cancelar' : 'Cambiar'}
                    </motion.button>
                  </div>
                  
                  <AnimatePresence>
                    {mostrarCambioPassword && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handlePasswordSubmit}
                        className="mt-6"
                      >
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Contraseña Actual
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiLock className="text-gray-400" />
                              </div>
                              <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nueva Contraseña
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiLock className="text-gray-400" />
                              </div>
                              <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Mínimo 8 caracteres</p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Confirmar Nueva Contraseña
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiLock className="text-gray-400" />
                              </div>
                              <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={guardando}
                            className={`flex items-center px-4 py-2 rounded-md text-white ${
                              guardando ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            {guardando ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                Actualizando...
                              </>
                            ) : (
                              <>
                                <FiKey className="mr-2" />
                                Actualizar Contraseña
                              </>
                            )}
                          </motion.button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Información adicional */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiInfo className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Información</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Mantén tu información actualizada para facilitar la comunicación sobre tus proyectos. 
                          Tu correo electrónico es tu identificador único y no puede cambiarse.
                        </p>
                        <p className="mt-2">
                          Si tienes problemas con tu cuenta, contacta con nuestro equipo de soporte.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
} 