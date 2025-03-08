import { lazy, Suspense } from 'react';

/**
 * Crea un componente con carga perezosa (lazy loading)
 * 
 * @param {Function} importFunc - Función de importación dinámica
 * @param {Object} options - Opciones de configuración
 * @param {React.ReactNode} options.fallback - Elemento a mostrar mientras carga
 * @param {Function} options.onError - Manejador de errores de carga
 * @returns {React.ComponentType} Componente React con carga perezosa
 */
export function lazyLoad(importFunc, options = {}) {
  const LazyComponent = lazy(importFunc);
  
  const defaultFallback = <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
  </div>;
  
  const fallback = options.fallback || defaultFallback;
  
  return (props) => (
    <Suspense fallback={fallback}>
      <ErrorBoundary onError={options.onError}>
        <LazyComponent {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}

/**
 * Componente para manejar errores durante la carga de componentes
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error cargando componente:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-lg font-medium text-red-700 mb-2">Error al cargar el componente</h2>
          <p className="text-red-600">{this.state.error?.message || 'Se produjo un error desconocido'}</p>
          <button 
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 