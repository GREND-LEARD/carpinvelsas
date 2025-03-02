"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiTool, FiPenTool, FiBook, FiPhone, FiUser, FiCalendar, FiLogOut, FiHome, FiShoppingBag, FiSettings } from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";

export default function VerticalMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();

    // Cerrar el menú de perfil al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = () => {
            setShowProfileMenu(false);
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    // Detener la propagación del clic dentro del menú
    const handleProfileMenuClick = (e) => {
        e.stopPropagation();
    };

    const baseMenuItems = [
        { name: "Inicio", icon: <FiHome />, href: "/" },
        { name: "Productos", icon: <FiTool />, href: "/productos" },
        { name: "Proyectos", icon: <FiPenTool />, href: "/proyectos" },
        { name: "Blog", icon: <FiBook />, href: "/blog" },
        { name: "Contacto", icon: <FiPhone />, href: "/contact" },
        { name: "Calendario", icon: <FiCalendar className="text-xl" />, href: "/calendario" },
    ];

    // Opciones del menú de perfil
    const userMenuItems = user?.rol === 'admin' 
        ? [
            { name: "Dashboard", icon: <FiSettings />, href: "/dashboard" },
            { name: "Cerrar Sesión", icon: <FiLogOut />, action: () => logout() }
        ] 
        : [
            { name: "Mi Portal", icon: <FiUser />, href: "/client-portal" },
            { name: "Mis Pedidos", icon: <FiShoppingBag />, href: "/client-portal?section=pedidos" },
            { name: "Cerrar Sesión", icon: <FiLogOut />, action: () => logout() }
        ];

    return (
        <>
            {/* Botón de menú para móvil */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed md:hidden top-4 right-4 z-50 p-3 bg-amber-700 rounded-lg text-white shadow-xl hover:bg-amber-600 transition-colors"
            >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Menú para escritorio */}
            <motion.nav
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 h-screen w-20 hover:w-64 bg-amber-900/90 backdrop-blur-sm transition-all duration-300 z-40 hidden md:block group"
            >
                <div className="flex flex-col items-start p-4 space-y-8">
                    <div className="text-2xl text-amber-50 font-bold p-2 border-b border-amber-600">
                        CARPINVEL
                    </div>
                    
                    {/* Menú principal */}
                    {baseMenuItems.map((item) => (
                        <Link
                            href={item.href}
                            key={item.name}
                            className="flex items-center space-x-4 text-amber-50 hover:text-amber-200 w-full p-3 rounded-lg hover:bg-amber-800/30 transition-all"
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-lg hidden group-hover:block"
                            >
                                {item.name}
                            </motion.span>
                        </Link>
                    ))}
                    
                    {/* Menú de perfil condicional */}
                    <div className="relative w-full">
                        {isAuthenticated ? (
                            <>
                                {/* Botón de perfil con menú desplegable */}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowProfileMenu(!showProfileMenu);
                                    }}
                                    className="flex items-center space-x-4 text-amber-50 hover:text-amber-200 w-full p-3 rounded-lg hover:bg-amber-800/30 transition-all"
                                >
                                    <span className="text-2xl">
                                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-amber-900 font-semibold">
                                            {user?.nombre ? user.nombre[0].toUpperCase() : 'U'}
                                        </div>
                                    </span>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-lg hidden group-hover:block overflow-hidden whitespace-nowrap"
                                    >
                                        {user?.nombre || 'Usuario'}
                                    </motion.span>
                                </button>
                                
                                {/* Menú desplegable */}
                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute left-4 mt-2 w-56 bg-amber-800 rounded-lg shadow-xl z-50"
                                            onClick={handleProfileMenuClick}
                                        >
                                            <div className="p-2 border-b border-amber-700 text-amber-100">
                                                <p className="font-medium">{user?.nombre} {user?.apellido}</p>
                                                <p className="text-xs opacity-75">{user?.email}</p>
                                            </div>
                                            <div className="p-2">
                                                {userMenuItems.map((item, index) => (
                                                    item.action ? (
                                                        <button
                                                            key={index}
                                                            onClick={item.action}
                                                            className="flex items-center space-x-3 w-full p-2 text-amber-100 hover:bg-amber-700 rounded-lg transition-colors"
                                                        >
                                                            <span>{item.icon}</span>
                                                            <span>{item.name}</span>
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            key={index}
                                                            href={item.href}
                                                            className="flex items-center space-x-3 w-full p-2 text-amber-100 hover:bg-amber-700 rounded-lg transition-colors"
                                                        >
                                                            <span>{item.icon}</span>
                                                            <span>{item.name}</span>
                                                        </Link>
                                                    )
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center space-x-4 text-amber-50 hover:text-amber-200 w-full p-3 rounded-lg hover:bg-amber-800/30 transition-all"
                            >
                                <span className="text-2xl"><FiUser /></span>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-lg hidden group-hover:block"
                                >
                                    Iniciar Sesión
                                </motion.span>
                            </Link>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* Menú para móvil */}
            <AnimatePresence>
                {isOpen && (
                    <motion.nav
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="fixed md:hidden top-0 left-0 h-screen w-64 bg-amber-900/95 backdrop-blur-sm z-40 p-4"
                    >
                        <div className="flex flex-col space-y-6">
                            <div className="text-2xl text-amber-50 font-bold p-2 border-b border-amber-600">
                                CARPINVEL
                            </div>
                            
                            {/* Menú principal para móvil */}
                            {baseMenuItems.map((item) => (
                                <Link
                                    href={item.href}
                                    key={item.name}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center space-x-4 text-amber-50 hover:text-amber-200 w-full p-3 rounded-lg hover:bg-amber-800/30"
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="text-lg">{item.name}</span>
                                </Link>
                            ))}
                            
                            {/* Perfil condicional para móvil */}
                            {isAuthenticated ? (
                                <>
                                    <div className="border-t border-amber-700 pt-4">
                                        <div className="px-3 mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-amber-900 font-semibold">
                                                    {user?.nombre ? user.nombre[0].toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-amber-100 font-medium">{user?.nombre}</p>
                                                    <p className="text-xs text-amber-200/70">{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {userMenuItems.map((item, index) => (
                                            item.action ? (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        item.action();
                                                    }}
                                                    className="flex items-center space-x-4 text-amber-50 hover:text-amber-200 w-full p-3 rounded-lg hover:bg-amber-800/30"
                                                >
                                                    <span className="text-xl">{item.icon}</span>
                                                    <span className="text-lg">{item.name}</span>
                                                </button>
                                            ) : (
                                                <Link
                                                    key={index}
                                                    href={item.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center space-x-4 text-amber-50 hover:text-amber-200 w-full p-3 rounded-lg hover:bg-amber-800/30"
                                                >
                                                    <span className="text-xl">{item.icon}</span>
                                                    <span className="text-lg">{item.name}</span>
                                                </Link>
                                            )
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center space-x-4 text-amber-50 hover:text-amber-200 w-full p-3 rounded-lg hover:bg-amber-800/30"
                                >
                                    <span className="text-2xl"><FiUser /></span>
                                    <span className="text-lg">Iniciar Sesión</span>
                                </Link>
                            )}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </>
    );
}