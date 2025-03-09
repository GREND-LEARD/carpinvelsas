'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiTrendingUp, FiCalendar, FiDollarSign } from 'react-icons/fi';

// Componente para mostrar un gráfico de barras simple para los ingresos
const BarChart = () => {
  // En un escenario real, estos datos vendrían de una API
  const barData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    values: [12500, 15800, 14200, 18500, 22300, 25400],
  };

  const maxValue = Math.max(...barData.values);

  return (
    <div className="w-full h-52 flex items-end space-x-2">
      {barData.labels.map((label, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(barData.values[index] / maxValue) * 100}%` }}
            transition={{ duration: 1, delay: index * 0.1 }}
            className="w-full bg-amber-500 rounded-t-md"
          ></motion.div>
          <div className="text-amber-800 text-xs mt-2">{label}</div>
          <div className="text-amber-950 text-xs font-semibold">
            {new Intl.NumberFormat('es-ES', { 
              style: 'currency', 
              currency: 'EUR',
              maximumFractionDigits: 0
            }).format(barData.values[index])}
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente para mostrar un gráfico de líneas para la tendencia
const LineChart = () => {
  // En un escenario real, estos datos vendrían de una API
  const data = {
    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
    values: [5, 8, 12, 9, 14, 18, 15],
  };

  return (
    <div className="w-full h-40 px-4">
      <svg width="100%" height="100%" viewBox="0 0 100 50">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(217 119 6)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(217 119 6)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Línea de tendencia */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d={`M ${data.labels.map((_, i) => 
            `${i * (100 / (data.labels.length - 1))},${50 - data.values[i] * 2}`
          ).join(' L ')}`}
          fill="none"
          stroke="rgb(217 119 6)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Área bajo la línea */}
        <path
          d={`M ${data.labels.map((_, i) => 
            `${i * (100 / (data.labels.length - 1))},${50 - data.values[i] * 2}`
          ).join(' L ')} L 100,50 L 0,50 Z`}
          fill="url(#gradient)"
        />
        {/* Puntos en la línea */}
        {data.labels.map((_, i) => (
          <motion.circle
            key={i}
            initial={{ opacity: 0, r: 0 }}
            animate={{ opacity: 1, r: 2 }}
            transition={{ duration: 0.2, delay: 2 + (i * 0.1) }}
            cx={i * (100 / (data.labels.length - 1))}
            cy={50 - data.values[i] * 2}
            fill="rgb(217 119 6)"
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
};

// Componente principal de la sección de analíticas
const AnalyticsSection = () => {
  // En un escenario real, estos datos vendrían de una API
  const statsSummary = [
    { 
      title: "Proyectos Completados", 
      value: "35", 
      change: "+15%", 
      isPositive: true, 
      icon: <FiBarChart2 className="w-5 h-5" />, 
      timespan: "Este año" 
    },
    { 
      title: "Clientes Activos", 
      value: "24", 
      change: "+8%", 
      isPositive: true, 
      icon: <FiTrendingUp className="w-5 h-5" />, 
      timespan: "Este mes" 
    },
    { 
      title: "Fecha Proyección", 
      value: "15 Dic", 
      change: "-3 días", 
      isPositive: true, 
      icon: <FiCalendar className="w-5 h-5" />, 
      timespan: "Próxima entrega" 
    },
    { 
      title: "Ingresos Anuales", 
      value: "128.5K", 
      change: "+22%", 
      isPositive: true, 
      icon: <FiDollarSign className="w-5 h-5" />, 
      timespan: "vs Año Pasado" 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-amber-50/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-amber-900 mb-6">Análisis del Negocio</h2>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statsSummary.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-4 rounded-xl shadow-md"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="bg-amber-100 p-2 rounded-lg">
                {stat.icon}
              </div>
              <div className={`text-sm font-semibold ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-amber-900 mt-2">{stat.value}</h3>
            <p className="text-sm text-amber-600">{stat.title}</p>
            <p className="text-xs text-amber-400 mt-1">{stat.timespan}</p>
          </motion.div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-amber-900">Ingresos Semestrales</h3>
            <select className="text-sm text-amber-700 bg-amber-50 rounded-md border-none p-1">
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
          <BarChart />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-amber-900">Pedidos Semanales</h3>
            <select className="text-sm text-amber-700 bg-amber-50 rounded-md border-none p-1">
              <option>Esta semana</option>
              <option>Semana pasada</option>
            </select>
          </div>
          <LineChart />
          <div className="flex justify-between text-sm text-amber-700 mt-2">
            <span>Total: 81 pedidos</span>
            <span className="text-emerald-500">+12.5%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsSection; 