'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ThemeCheckPage() {
  const [userAgent, setUserAgent] = useState('');
  const [colorScheme, setColorScheme] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [htmlClasses, setHtmlClasses] = useState('');
  const [bodyClasses, setBodyClasses] = useState('');

  useEffect(() => {
    // Obtener información del navegador y configuración
    setUserAgent(navigator.userAgent);
    setIsDarkMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setColorScheme(document.documentElement.style.colorScheme || 'No establecido');
    
    // Obtener colores calculados
    const bodyStyles = window.getComputedStyle(document.body);
    setBgColor(bodyStyles.backgroundColor);
    setTextColor(bodyStyles.color);
    
    // Obtener clases aplicadas
    setHtmlClasses(document.documentElement.className);
    setBodyClasses(document.body.className);
  }, []);

  // Función para forzar el tema claro
  const forceLightMode = () => {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    document.body.classList.add('bg-white', 'text-gray-900');
    document.body.classList.remove('bg-black', 'bg-gray-900', 'text-white');
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#111827';
    
    // Actualizar estado
    setHtmlClasses(document.documentElement.className);
    setBodyClasses(document.body.className);
    setBgColor(window.getComputedStyle(document.body).backgroundColor);
    setTextColor(window.getComputedStyle(document.body).color);
    setColorScheme(document.documentElement.style.colorScheme);
  };

  return (
    <div className="p-6 bg-white text-gray-900 min-h-screen mobile-light force-light-mode">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Diagnóstico de Tema</h1>
        
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h2 className="font-semibold text-amber-900">Información del Sistema</h2>
            <ul className="mt-2 space-y-1 text-sm">
              <li><span className="font-medium">User Agent:</span> {userAgent}</li>
              <li><span className="font-medium">Prefiere modo oscuro:</span> {isDarkMode ? 'Sí' : 'No'}</li>
              <li><span className="font-medium">Color Scheme:</span> {colorScheme}</li>
              <li><span className="font-medium">Color de fondo:</span> {bgColor}</li>
              <li><span className="font-medium">Color de texto:</span> {textColor}</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="font-semibold text-blue-900">Clases CSS Aplicadas</h2>
            <ul className="mt-2 space-y-1 text-sm">
              <li><span className="font-medium">Clases HTML:</span> {htmlClasses || 'Ninguna'}</li>
              <li><span className="font-medium">Clases Body:</span> {bodyClasses || 'Ninguna'}</li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-2">
            <button 
              onClick={forceLightMode}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded transition-colors"
            >
              Forzar Tema Claro
            </button>
            
            <Link 
              href="/"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors text-center"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
        
        {/* Tests de colores */}
        <div className="mt-8 space-y-4">
          <h2 className="font-semibold text-gray-900">Test de Colores</h2>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white text-gray-900 p-4 rounded border">Blanco - Texto oscuro</div>
            <div className="bg-gray-900 text-white p-4 rounded border">Negro - Texto claro</div>
            <div className="bg-amber-100 text-amber-900 p-4 rounded border">Amber claro</div>
            <div className="bg-amber-600 text-white p-4 rounded border">Amber oscuro</div>
          </div>
        </div>
      </div>
    </div>
  );
} 