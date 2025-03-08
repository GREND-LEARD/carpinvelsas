import React from 'react';

/**
 * Componente Card para mostrar información en tarjetas
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la tarjeta
 * @param {React.ReactNode} props.children - Contenido de la tarjeta
 * @param {string} props.className - Clases adicionales
 * @param {boolean} props.noPadding - Eliminar el padding interno
 * @param {boolean} props.shadow - Si la tarjeta debe tener sombra
 * @param {boolean} props.bordered - Si la tarjeta debe tener borde
 */
const Card = ({ 
  title,
  children, 
  className = '',
  noPadding = false,
  shadow = true,
  bordered = true,
  ...rest 
}) => {
  const cardClasses = `
    bg-white rounded-lg overflow-hidden
    ${shadow ? 'shadow-md' : ''}
    ${bordered ? 'border border-gray-200' : ''}
    ${className}
  `.trim();

  return (
    <div className={cardClasses} {...rest}>
      {title && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <h3 className="font-medium text-gray-700">{title}</h3>
        </div>
      )}
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
    </div>
  );
};

export default Card; 