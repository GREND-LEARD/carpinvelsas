'use client';
import { useState } from 'react';
import CalculadoraPresupuesto from '@/components/presupuestos/CalculadoraPresupuesto';
import { motion } from 'framer-motion';
import { FiClipboard, FiCheck, FiBarChart2, FiUsers, FiList } from 'react-icons/fi';

export default function PresupuestosPage() {
  const [activeTab, setActiveTab] = useState('calculadora');
  
  // Animación para transiciones entre pestañas
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  // Renderizado basado en la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case 'calculadora':
        return (
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
          >
            <CalculadoraPresupuesto />
          </motion.div>
        );
        
      case 'historial':
        return (
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-8 rounded-xl shadow-md"
          >
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Historial de Presupuestos</h2>
            <p className="text-amber-700 italic mb-6">
              (Esta sección mostraría todos los presupuestos generados anteriormente.)
            </p>
            
            <div className="overflow-hidden rounded-lg border border-amber-200">
              <table className="min-w-full divide-y divide-amber-200">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                      Ref.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-amber-200">
                  {[
                    { id: 'P-2023-001', cliente: 'María García', producto: 'Mesa de Comedor', fecha: '15 Nov 2023', total: '€1,250.00', estado: 'Aprobado' },
                    { id: 'P-2023-002', cliente: 'Carlos Rodríguez', producto: 'Librería a Medida', fecha: '22 Nov 2023', total: '€950.00', estado: 'Pendiente' },
                    { id: 'P-2023-003', cliente: 'Ana Martínez', producto: 'Armario Empotrado', fecha: '03 Dic 2023', total: '€2,150.00', estado: 'Rechazado' },
                    { id: 'P-2023-004', cliente: 'Pedro López', producto: 'Cama de Roble', fecha: '10 Dic 2023', total: '€850.00', estado: 'Aprobado' },
                  ].map((presupuesto, idx) => (
                    <tr key={idx} className="hover:bg-amber-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">
                        {presupuesto.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">
                        {presupuesto.cliente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">
                        {presupuesto.producto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">
                        {presupuesto.fecha}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-900">
                        {presupuesto.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          presupuesto.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                          presupuesto.estado === 'Pendiente' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {presupuesto.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-700">
                        <button className="text-amber-600 hover:text-amber-900 mr-3">Ver</button>
                        <button className="text-amber-600 hover:text-amber-900">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        );
        
      case 'estadisticas':
        return (
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-8 rounded-xl shadow-md"
          >
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Estadísticas de Presupuestos</h2>
            <p className="text-amber-700 italic mb-6">
              (Esta sección mostraría estadísticas y análisis de los presupuestos generados.)
            </p>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-amber-50 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-amber-900">Tasa de Conversión</h3>
                  <span className="bg-amber-500 p-2 rounded-lg text-white">
                    <FiBarChart2 className="w-5 h-5" />
                  </span>
                </div>
                <p className="text-3xl font-bold text-amber-900 mb-1">68%</p>
                <p className="text-sm text-amber-600">De presupuestos a proyectos</p>
              </div>
              
              <div className="bg-amber-50 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-amber-900">Presupuesto Promedio</h3>
                  <span className="bg-amber-500 p-2 rounded-lg text-white">
                    <FiCheck className="w-5 h-5" />
                  </span>
                </div>
                <p className="text-3xl font-bold text-amber-900 mb-1">€1,450</p>
                <p className="text-sm text-amber-600">Por proyecto aprobado</p>
              </div>
              
              <div className="bg-amber-50 p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-amber-900">Clientes Nuevos</h3>
                  <span className="bg-amber-500 p-2 rounded-lg text-white">
                    <FiUsers className="w-5 h-5" />
                  </span>
                </div>
                <p className="text-3xl font-bold text-amber-900 mb-1">12</p>
                <p className="text-sm text-amber-600">En el último mes</p>
              </div>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-xl shadow-sm mb-8">
              <h3 className="text-lg font-medium text-amber-900 mb-4">Distribución por Tipo de Producto</h3>
              <div className="h-64 flex items-end justify-around">
                {[
                  { label: 'Mesas', value: 35 },
                  { label: 'Armarios', value: 25 },
                  { label: 'Sillas', value: 15 },
                  { label: 'Camas', value: 10 },
                  { label: 'Escritorios', value: 8 },
                  { label: 'Otros', value: 7 }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${item.value * 2}px` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="w-14 bg-amber-500 rounded-t-md"
                    ></motion.div>
                    <p className="mt-2 text-sm text-amber-700">{item.label}</p>
                    <p className="text-xs text-amber-600">{item.value}%</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
        
      case 'plantillas':
        return (
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            className="bg-white p-8 rounded-xl shadow-md"
          >
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Plantillas de Presupuestos</h2>
            <p className="text-amber-700 italic mb-6">
              (Esta sección permitiría crear y gestionar plantillas para presupuestos frecuentes.)
            </p>
            
            <div className="grid grid-cols-3 gap-6">
              {[
                { nombre: 'Mesa de Comedor Estándar', descripcion: 'Mesa de comedor rectangular con 6 sillas a juego.', precio: '€1,200' },
                { nombre: 'Armario Empotrado Básico', descripcion: 'Armario empotrado de pared a pared con puertas correderas.', precio: '€1,800' },
                { nombre: 'Cocina Modular', descripcion: 'Muebles de cocina modulares con encimera de granito.', precio: '€2,500' },
                { nombre: 'Biblioteca a Medida', descripcion: 'Estantería a medida para salón o despacho.', precio: '€950' },
                { nombre: 'Mueble de Baño', descripcion: 'Mueble bajo lavabo con cajones y espejo a juego.', precio: '€750' },
                { nombre: 'Dormitorio Completo', descripcion: 'Conjunto de cama, mesitas de noche y armario.', precio: '€2,200' },
              ].map((plantilla, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  className="bg-amber-50 p-6 rounded-xl shadow-sm border border-amber-100 flex flex-col"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">{plantilla.nombre}</h3>
                    <div className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">Plantilla</div>
                  </div>
                  <p className="text-amber-700 text-sm mb-4 flex-grow">{plantilla.descripcion}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-amber-900 font-semibold">{plantilla.precio}</span>
                    <button className="text-amber-600 hover:text-amber-900 text-sm font-medium">
                      Usar plantilla
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
        
      default:
        return <CalculadoraPresupuesto />;
    }
  };
  
  return (
    <div className="min-h-screen bg-[url('/textura-madera.jpg')] bg-cover bg-fixed">
      <div className="min-h-screen backdrop-blur-xl bg-amber-900/30 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-amber-50 mb-2 font-serif text-center">
              Sistema de Presupuestos
            </h1>
            <p className="text-amber-200 text-center mb-12">
              Crea, personaliza y gestiona presupuestos para tus clientes
            </p>
          </motion.div>
          
          {/* Pestañas de navegación */}
          <div className="mb-8 bg-white p-1 rounded-lg shadow-md inline-flex w-full">
            {[
              { id: 'calculadora', label: 'Calculadora', icon: <FiClipboard /> },
              { id: 'historial', label: 'Historial', icon: <FiList /> },
              { id: 'estadisticas', label: 'Estadísticas', icon: <FiBarChart2 /> },
              { id: 'plantillas', label: 'Plantillas', icon: <FiCheck /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center gap-2 font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-amber-500 text-white' 
                    : 'text-amber-700 hover:bg-amber-100'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
          
          {/* Contenido según pestaña seleccionada */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 