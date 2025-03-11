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
              <Link href="/client-portal" className="flex items-center text-white hover:text-amber-100 mr-4 bg-amber-800/50 px-3 py-1 rounded-lg">
                <FiArrowLeft className="mr-2" /> Volver al Portal
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Calculadora de Presupuestos
            </h1>
            <p className="text-white text-opacity-90">
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
            <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
              <FiClipboard className="mr-2" /> Presupuesto Instantáneo
            </h2>
            <p className="text-amber-900">
              Con nuestra herramienta de presupuesto puedes configurar tu proyecto y obtener un precio estimado instantáneo.
              Personaliza cada detalle y visualiza cómo afecta al precio final.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-amber-200">
                <h3 className="font-medium text-amber-900 mb-2">Personaliza tu proyecto</h3>
                <p className="text-amber-800 text-sm">
                  Elige material, acabado, dimensiones y características adicionales para tu mueble a medida.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-amber-200">
                <h3 className="font-medium text-amber-900 mb-2">Recibe tu presupuesto</h3>
                <p className="text-amber-800 text-sm">
                  Obtén un precio estimado al instante y solicita un presupuesto formal si estás interesado.
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Calculadora */}
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