import React, { useState, useEffect } from 'react';
import Link from 'next/link';



const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Inicio');
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const menuItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Productos', href: '/productos' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Proyectos', href: '/proyectos' },
    { label: 'Contacto', href: '/contact' },
  ];
  

  // Maneja el scroll: detecta si se esta haciendo scroll hacia abajo o arriba
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determinar si se está desplazando hacia abajo
      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      if (currentScrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Nuevo efecto para detectar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      // Si la ventana es más grande que el breakpoint de móvil (md en Tailwind)
      // y el menú está abierto, cerrarlo
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Estructura del return (JSX)
  return (
    // Navbar principal
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 bg-gradient-to-r from-amber-900/95 via-amber-800/95 to-amber-900/95 ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        scrolled ? 'shadow-lg shadow-amber-900/50' : ''
      }`}
      style={{
        backgroundImage: scrolled 
          ? 'linear-gradient(to right, rgba(120, 53, 15, 0.95), rgba(146, 64, 14, 0.95), rgba(120, 53, 15, 0.95))' 
          : 'linear-gradient(to right, rgba(120, 53, 15, 0.9), rgba(146, 64, 14, 0.9), rgba(120, 53, 15, 0.9))',
        borderBottom: '1px solid rgba(255, 200, 150, 0.2)'
      }}
    > 
      <div className="w-full px-2">
        <div className="flex justify-between items-center h-24">
          {/* Logo - Ajustado al borde izquierdo con espacio mínimo garantizado */}
          <div className="flex items-center ml-1 md:min-w-[200px] md:w-1/4 md:mr-4">
            <div className="flex-shrink-0 relative group">
              <a href="/" className="flex items-center">
                <div className="relative">
                  {/* Sierra circular como ícono */}
                  <svg className="h-10 w-10 text-amber-300 transition-all duration-300 group-hover:text-amber-200 group-hover:scale-110" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor"/>
                    <path d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7ZM12 15C10.35 15 9 13.65 9 12C9 10.35 10.35 9 12 9C13.65 9 15 10.35 15 12C15 13.65 13.65 15 12 15Z" fill="currentColor"/>
                    <path d="M12 11C11.45 11 11 11.45 11 12C11 12.55 11.45 13 12 13C12.55 13 13 12.55 13 12C13 11.45 12.55 11 12 11Z" fill="currentColor"/>
                    <path d="M12 5.5V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 16V18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M16 12H18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M5.5 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M15.3 8.7L17.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6.5 17.5L8.7 15.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M15.3 15.3L17.5 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6.5 6.5L8.7 8.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div className="absolute -inset-1 bg-amber-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="relative ml-2">
                  <span className="text-2xl font-bold tracking-widest text-amber-100 after:content-[''] after:block after:w-0 after:h-0.5 after:bg-amber-300 after:transition-all after:duration-300 group-hover:after:w-full">
                    CARPIN<span className="text-amber-300">VEL</span>
                  </span>
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 via-amber-300 to-transparent transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
                </div>
              </a>
            </div>
          </div>

          {/* Menú escritorio (pantallas grandes)- Centrado con mejor distribución */}
          <div className="hidden md:flex md:justify-center md:flex-grow md:flex-shrink">
            <div className="flex items-center space-x-1 lg:space-x-2 flex-wrap justify-center">
              {menuItems.map(({ label, href }) => (
                <Link
                  href={href}
                  key={label}
                  onClick={() => setActiveItem(label)}
                  className={`relative px-2 sm:px-3 md:px-4 py-2 rounded-md text-sm md:text-base font-medium uppercase tracking-wider transition-all duration-300 
                    ${activeItem === label 
                      ? 'text-amber-100 bg-amber-950/60 before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-1/2 before:h-0.5 before:bg-amber-300' 
                      : 'text-amber-200 hover:text-amber-100 hover:bg-amber-800/40'
                    }
                  `}
                  >
                  <span className="relative z-10">{label}</span>
                  {activeItem !== label && (
                    <span className="absolute inset-0 rounded-md bg-gradient-to-b from-amber-700/30 to-amber-900/20 opacity-0 transform scale-90 transition-all duration-300 hover:opacity-100 hover:scale-100"></span>
                  )}
                </Link>              
              ))}
            </div>
          </div>
          {/* Botón menú móvil (pantallas pequeñas) - Solo visible en móvil */}
          <div className="flex items-center justify-end md:min-w-[100px] md:w-1/4">
            <div className="flex items-center mr-1 md:hidden">
              <button
                onClick={toggleMenu}
                className="relative inline-flex items-center justify-center p-2 rounded-md text-amber-300 hover:text-amber-100 focus:outline-none transition-all duration-300"
                aria-expanded="false"
              >
                <span className="sr-only">Abrir menú principal</span>
                <div className="w-8 h-8 flex flex-col justify-center items-center">
                  <span className={`w-6 h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                  <span className={`w-6 h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`w-6 h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
                </div>
                <div className="absolute inset-0 rounded-full bg-amber-800/50 scale-0 opacity-0 hover:scale-100 hover:opacity-100 transition-all duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`transition-all duration-500 ease-in-out max-h-0 overflow-hidden ${isMenuOpen ? 'max-h-96' : ''}`}>
        <div className="px-4 pt-2 pb-5 space-y-3 bg-gradient-to-b from-amber-800/95 to-amber-900/95 border-t border-amber-700/30">
          {menuItems.map(({ label, href }) => (
            <Link 
              key={label} 
              href={href}
              className={`block px-4 py-3 rounded-md text-base font-medium transition-all duration-300 relative overflow-hidden ${
                activeItem === label 
                  ? 'text-amber-100 bg-amber-950/60 border-l-2 border-amber-400' 
                  : 'text-amber-200 hover:text-amber-100 hover:bg-amber-800/40'
              }`}
              onClick={() => {
                setActiveItem(label);
                setIsMenuOpen(false);
              }}
              >
              <span>{label}</span>
                {activeItem === label && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-transparent"></span>
                )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;