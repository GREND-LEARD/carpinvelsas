'use client';

import React, { useEffect } from 'react';

/**
 * Componente que asegura que el tema claro se aplique correctamente,
 * especialmente en dispositivos móviles que podrían aplicar tema oscuro automáticamente
 */
const ThemeProvider = ({ children }) => {
  useEffect(() => {
    // Funciones para forzar el tema claro
    function forceLightMode() {
      // Aplicar clase light al elemento html
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      
      // Establecer atributos de color-scheme
      document.documentElement.style.colorScheme = 'light';
      
      // Aplicar clase a body también
      document.body.classList.add('bg-white', 'text-gray-900');
      document.body.classList.remove('bg-black', 'bg-gray-900', 'text-white');
    }
    
    // Ejecutar inmediatamente
    forceLightMode();
    
    // Forzar el tema claro cuando se detecta cambio de tema del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', forceLightMode);
    
    // Verificar periódicamente que el tema claro siga aplicado
    // (Algunos navegadores móviles pueden revertir al tema oscuro)
    const interval = setInterval(forceLightMode, 1000);
    
    // Limpieza
    return () => {
      mediaQuery.removeEventListener('change', forceLightMode);
      clearInterval(interval);
    };
  }, []);
  
  // Fix para Safari mobile que a veces muestra fondo negro brevemente
  useEffect(() => {
    function fixSafariFlash() {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      if (isSafari) {
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.transition = 'none';
        
        setTimeout(() => {
          document.body.style.transition = '';
        }, 500);
      }
    }
    
    fixSafariFlash();
    
    // Fix para Chrome móvil con modo oscuro activado
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff');
    }
  }, []);
  
  return <>{children}</>;
};

export default ThemeProvider; 