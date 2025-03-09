'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'framer-motion';
import { 
    FiHome, 
    FiFolder, 
    FiDollarSign, 
    FiMessageSquare, 
    FiUser, 
    FiBell, 
    FiLogOut,
    FiMenu,
    FiX
} from 'react-icons/fi';

const ClientNavBar = () => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [unreadNotifications] = useState(3); // Esto vendría de tu sistema de notificaciones

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { name: 'Inicio', icon: <FiHome />, href: '/client-portal' },
        { name: 'Mis Proyectos', icon: <FiFolder />, href: '/client-portal/proyectos' },
        { name: 'Presupuestos', icon: <FiDollarSign />, href: '/client-portal/presupuestos' },
        { name: 'Mensajes', icon: <FiMessageSquare />, href: '/client-portal/mensajes' },
    ];

    return (
        <>
            {/* Barra de navegación principal */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled ? 'bg-amber-900/95 shadow-lg backdrop-blur-sm' : 'bg-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo y nombre */}
                        <div className="flex items-center">
                            <Link href="/client-portal">
                                <span className="text-2xl font-bold text-amber-50">CARPINVEL</span>
                            </Link>
                        </div>

                        {/* Menú principal - Desktop */}
                        <div className="hidden md:flex items-center space-x-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-amber-50 hover:bg-amber-800/50 transition-colors"
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Menú de usuario y notificaciones - Desktop */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Botón de notificaciones */}
                            <button className="relative p-2 text-amber-50 hover:bg-amber-800/50 rounded-lg">
                                <FiBell className="w-6 h-6" />
                                {unreadNotifications > 0 && (
                                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadNotifications}
                                    </span>
                                )}
                            </button>

                            {/* Menú de usuario */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-3 p-2 text-amber-50 hover:bg-amber-800/50 rounded-lg"
                                >
                                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                                        <span className="text-amber-50 font-semibold">
                                            {user?.nombre?.[0]?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <span className="hidden lg:block">{user?.nombre || 'Usuario'}</span>
                                </button>

                                {/* Menú desplegable de usuario */}
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-amber-800 rounded-lg shadow-xl py-2"
                                    >
                                        <Link
                                            href="/client-portal/perfil"
                                            className="flex items-center space-x-2 px-4 py-2 text-amber-50 hover:bg-amber-700"
                                        >
                                            <FiUser className="w-5 h-5" />
                                            <span>Mi Perfil</span>
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="flex items-center space-x-2 px-4 py-2 text-amber-50 hover:bg-amber-700 w-full text-left"
                                        >
                                            <FiLogOut className="w-5 h-5" />
                                            <span>Cerrar Sesión</span>
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Botón de menú móvil */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden p-2 text-amber-50 hover:bg-amber-800/50 rounded-lg"
                        >
                            {showMobileMenu ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Menú móvil */}
                {showMobileMenu && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-amber-900/95 backdrop-blur-sm"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-amber-50 hover:bg-amber-800/50"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                            <div className="border-t border-amber-800/50 my-2"></div>
                            <Link
                                href="/client-portal/perfil"
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-amber-50 hover:bg-amber-800/50"
                                onClick={() => setShowMobileMenu(false)}
                            >
                                <FiUser className="w-5 h-5" />
                                <span>Mi Perfil</span>
                            </Link>
                            <button
                                onClick={() => {
                                    setShowMobileMenu(false);
                                    logout();
                                }}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-amber-50 hover:bg-amber-800/50 w-full"
                            >
                                <FiLogOut className="w-5 h-5" />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.nav>

            {/* Espaciador para el contenido debajo de la barra de navegación */}
            <div className="h-16"></div>
        </>
    );
};

export default ClientNavBar; 