import React from 'react';

/**
 * Componente Badge para mostrar etiquetas de estado o categorías
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.variant - Variante del badge: 'primary', 'secondary', 'success', 'danger', 'warning', 'info'
 * @param {string} props.size - Tamaño del badge: 'sm', 'md', 'lg'
 * @param {boolean} props.rounded - Si el badge debe tener esquinas completamente redondeadas
 * @param {boolean} props.outlined - Si el badge debe tener solo contorno
 * @param {React.ReactNode} props.children - Contenido del badge
 * @param {string} props.className - Clases adicionales
 */
const Badge = ({
  variant = 'primary',
  size = 'md',
  rounded = false,
  outlined = false,
  children,
  className = '',
  ...rest
}) => {
  // Variantes de color
  const variantClasses = {
    primary: outlined 
      ? 'bg-transparent text-amber-700 border border-amber-600' 
      : 'bg-amber-100 text-amber-800',
    secondary: outlined 
      ? 'bg-transparent text-gray-700 border border-gray-600' 
      : 'bg-gray-100 text-gray-800',
    success: outlined 
      ? 'bg-transparent text-green-700 border border-green-600' 
      : 'bg-green-100 text-green-800',
    danger: outlined 
      ? 'bg-transparent text-red-700 border border-red-600' 
      : 'bg-red-100 text-red-800',
    warning: outlined 
      ? 'bg-transparent text-yellow-700 border border-yellow-600' 
      : 'bg-yellow-100 text-yellow-800',
    info: outlined 
      ? 'bg-transparent text-blue-700 border border-blue-600' 
      : 'bg-blue-100 text-blue-800',
  };

  // Tamaños
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  // Esquinas redondeadas
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';

  // Clases combinadas
  const badgeClasses = `
    inline-flex items-center font-medium
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${roundedClasses}
    ${className}
  `.trim();

  return (
    <span className={badgeClasses} {...rest}>
      {children}
    </span>
  );
};

export default Badge; 