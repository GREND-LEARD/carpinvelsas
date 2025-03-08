import React from 'react';

/**
 * Componente Button estándar para toda la aplicación
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.variant - Variante del botón: 'primary', 'secondary', 'outline', 'danger'
 * @param {string} props.size - Tamaño del botón: 'sm', 'md', 'lg'
 * @param {boolean} props.fullWidth - Si el botón debe ocupar el ancho completo
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {Function} props.onClick - Función a ejecutar al hacer clic
 * @param {boolean} props.disabled - Si el botón está deshabilitado
 * @param {string} props.type - Tipo de botón: 'button', 'submit', 'reset'
 * @param {string} props.className - Clases adicionales
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  children, 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  ...rest 
}) => {
  // Base styles
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant styles
  const variantClasses = {
    primary: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
    secondary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    outline: 'bg-transparent border border-amber-500 text-amber-700 hover:bg-amber-50 focus:ring-amber-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  };
  
  // Size styles
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  // Width styles
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled styles
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const buttonClasses = `
    ${baseClasses} 
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${widthClasses}
    ${disabledClasses}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button; 