import React from 'react';
import { lazyLoad } from '../utils/lazyLoad';

// Componente personalizado de carga para el dashboard
const DashboardLoading = () => (
  <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
    <p className="text-amber-700 font-medium">Cargando módulo...</p>
  </div>
);

// Componentes con lazy loading para el dashboard
export const DashboardRoutes = {
  // Página principal del dashboard (carga estándar)
  Dashboard: React.lazy(() => import('./page')),
  
  // Módulos con carga perezosa
  Presupuestos: lazyLoad(() => import('./presupuestos/page'), {
    fallback: <DashboardLoading />
  }),
  
  Mensajes: lazyLoad(() => import('./mensajes/page'), {
    fallback: <DashboardLoading />
  }),
  
  Proyectos: lazyLoad(() => import('./proyectos/page'), {
    fallback: <DashboardLoading />
  }),
  
  Clientes: lazyLoad(() => import('./clientes/page'), {
    fallback: <DashboardLoading />,
    onError: (error) => {
      console.error('Error cargando el módulo de clientes:', error);
      // Aquí podrías incluir alguna lógica de telemetría o reporte de errores
    }
  }),
  
  Configuracion: lazyLoad(() => import('./configuracion/page'), {
    fallback: <DashboardLoading />
  })
}; 