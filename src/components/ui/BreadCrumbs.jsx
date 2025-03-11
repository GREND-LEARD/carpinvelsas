'use client';

import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

/**
 * Componente de migas de pan para la navegación.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.items - Array de objetos con la estructura { label: string, href: string }
 * @param {boolean} props.showHome - Indica si se debe mostrar el enlace a inicio
 * @returns {JSX.Element} Componente de migas de pan
 */
export default function BreadCrumbs({ items, showHome = true }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm">
        {showHome && (
          <li>
            <Link 
              href="/" 
              className="text-gray-500 hover:text-blue-600 flex items-center"
            >
              <FiHome className="mr-1" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>
          </li>
        )}
        
        {showHome && items.length > 0 && (
          <li className="flex items-center">
            <FiChevronRight className="text-gray-400" aria-hidden="true" />
          </li>
        )}
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <FiChevronRight className="mx-1 text-gray-400" aria-hidden="true" />
            )}
            
            {index === items.length - 1 ? (
              <span className="text-gray-700 font-medium">{item.label}</span>
            ) : (
              <Link 
                href={item.href} 
                className="text-gray-500 hover:text-blue-600"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 