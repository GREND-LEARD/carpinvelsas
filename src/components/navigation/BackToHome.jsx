'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

export default function BackToHome({ showBack = true, className = '', theme = 'light' }) {
  const router = useRouter();
  
  // Estilos según el tema (claro u oscuro)
  const styles = {
    light: {
      container: 'absolute top-6 left-6 flex items-center gap-4 z-10',
      button: 'flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white shadow-md text-amber-900 transition-all duration-300',
      homeLink: 'flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/90 hover:bg-amber-500 shadow-md text-white transition-all duration-300'
    },
    dark: {
      container: 'absolute top-6 left-6 flex items-center gap-4 z-10',
      button: 'flex items-center gap-2 px-4 py-2 rounded-full bg-amber-800/80 hover:bg-amber-800 shadow-md text-amber-50 transition-all duration-300',
      homeLink: 'flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600/90 hover:bg-amber-600 shadow-md text-white transition-all duration-300'
    }
  };
  
  const currentStyle = styles[theme];
  
  return (
    <div className={`${currentStyle.container} ${className}`}>
      {showBack && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className={currentStyle.button}
          aria-label="Volver atrás"
        >
          <FiArrowLeft />
          <span className="hidden sm:inline">Volver</span>
        </motion.button>
      )}
      
      <Link href="/">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={currentStyle.homeLink}
        >
          <FiHome />
          <span className="hidden sm:inline">Inicio</span>
        </motion.div>
      </Link>
    </div>
  );
} 