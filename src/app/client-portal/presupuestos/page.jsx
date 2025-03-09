'use client';
import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import CalculadoraPresupuesto from '@/components/presupuestos/CalculadoraPresupuesto';
import { motion } from 'framer-motion';
import { FiClipboard, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

function ClientPresupuestos() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('calculadora');
  
  return (
    <div className="min-h-screen bg-[url('/textura-madera.jpg')] bg-cover bg-fixed pt-28 pb-10">
      <div className="min-h-screen backdrop-blur-xl bg-amber-900/30">
        <div className="container mx-auto px-4 py-8">
          {/* Encabezado */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center mb-4">
              <Link href="/client-portal" className="flex items-center text-amber-200 hover:text-amber-100 mr-4">
                <FiArrowLeft className="mr-2" /> Volver al Portal
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-amber-50 mb-2">
              Calculadora de Presupuestos
            </h1>
            <p className="text-amber-200">
              Configure su producto de carpintería ideal y obtenga un presupuesto personalizado
            </p>
          </motion.div>
          
          {/* Instrucciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl mb-8"
          >
            <div className="flex items-start">
              <div className="bg-amber-500 text-white p-3 rounded-lg mr-4">
                <FiClipboard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-2">Cómo utilizar esta herramienta</h2>
                <p className="text-amber-700">
                  Esta calculadora le permite configurar su producto de carpintería ideal y obtener un presupuesto personalizado al instante.
                  Seleccione el tipo de producto, materiales, acabados y dimensiones para ver el precio estimado.
                  Podrá descargar o imprimir su presupuesto al finalizar.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
                    <p className="text-amber-800 font-medium">Seleccione el producto</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
                    <p className="text-amber-800 font-medium">Configure detalles</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-2">3</div>
                    <p className="text-amber-800 font-medium">Obtenga su presupuesto</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Calculadora de Presupuestos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CalculadoraPresupuesto />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function ClientPresupuestosPage() {
  return (
    <ProtectedRoute allowedRoles={['client']}>
      <ClientPresupuestos />
    </ProtectedRoute>
  );
} 