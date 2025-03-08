import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiTool, FiPenTool, FiBook, FiPhone, FiUser, FiCalendar, FiLogOut, FiHome, FiShoppingBag, FiSettings, FiFileText } from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";

export default function HorizontalMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);
    const { user, logout, isAuthenticated } = useAuth();

    const baseMenuItems = [
        { 
            name: "Inicio", 
            icon: <FiHome />, 
            href: "/",
            description: "Vuelve a la página principal para ver nuestras últimas creaciones"
        },
        { 
            name: "Productos", 
            icon: <FiTool />, 
            href: "/productos",
            description: "Explora nuestra colección de muebles artesanales"
        },
        { 
            name: "Proyectos", 
            icon: <FiPenTool />, 
            href: "/proyectos",
            description: "Descubre nuestros trabajos personalizados"
        },
        { 
            name: "Presupuestos", 
            icon: <FiFileText />, 
            href: "/presupuestos",
            description: "Solicita un presupuesto para tu proyecto ideal"
        },
        { 
            name: "Blog", 
            icon: <FiBook />, 
            href: "/blog",
            description: "Lee sobre tendencias y consejos de carpintería"
        },
        { 
            name: "Contacto", 
            icon: <FiPhone />, 
            href: "/contact",
            description: "Ponte en contacto con nuestro equipo"
        },
        { 
            name: "Calendario", 
            icon: <FiCalendar />, 
            href: "/calendario",
            description: "Agenda una consulta o seguimiento"
        }
    ];

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

    useEffect(() => {
        const handleClickOutside = () => {
            setShowProfileMenu(false);
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {/* Menú móvil */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed top-4 right-4 z-50 p-3 bg-amber-700 rounded-lg text-white shadow-xl hover:bg-amber-600 transition-colors"
                >
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="fixed inset-0 bg-amber-900/95 backdrop-blur-sm z-40 p-4"
                        >
                            <div className="flex flex-col space-y-4 pt-16">
                                {baseMenuItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center space-x-4 text-amber-50 p-4 rounded-lg hover:bg-amber-800/50 transition-all"
                                    >
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <span className="text-lg font-medium">{item.name}</span>
                                            <p className="text-sm text-amber-200/70">{item.description}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Menú desktop */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 h-16 bg-amber-900/90 backdrop-blur-sm z-40 hidden md:block shadow-lg"
            >
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                    <Link href="/" className="text-2xl text-amber-50 font-bold">
                        CARPINVEL
                    </Link>

                    <div className="flex items-center space-x-1">
                        {baseMenuItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative"
                                onMouseEnter={() => setActiveTooltip(item.name)}
                                onMouseLeave={() => setActiveTooltip(null)}
                            >
                                <Link
                                    href={item.href}
                                    className="flex items-center px-4 py-2 text-amber-50 hover:text-amber-200 rounded-lg hover:bg-amber-800/30 transition-all"
                                >
                                    <span className="text-xl mr-2">{item.icon}</span>
                                    <span className="text-sm font-medium">{item.name}</span>
                                </Link>

                                <AnimatePresence>
                                    {activeTooltip === item.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-amber-800 text-amber-50 rounded-lg shadow-xl text-sm w-48 text-center"
                                        >
                                            {item.description}
                                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-800 rotate-45" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}

                        <div className="relative ml-4">
                            {isAuthenticated ? (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowProfileMenu(!showProfileMenu);
                                        }}
                                        className="flex items-center space-x-2 text-amber-50 hover:text-amber-200 px-4 py-2 rounded-lg hover:bg-amber-800/30 transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-amber-900 font-semibold">
                                            {user?.nombre ? user.nombre[0].toUpperCase() : 'U'}
                                        </div>
                                        <span className="text-sm font-medium">{user?.nombre || 'Usuario'}</span>
                                    </button>

                                    <AnimatePresence>
                                        {showProfileMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-56 bg-amber-800 rounded-lg shadow-xl z-50"
                                            >
                                                <div className="p-3 border-b border-amber-700">
                                                    <p className="font-medium text-amber-50">{user?.nombre} {user?.apellido}</p>
                                                    <p className="text-xs text-amber-200/70">{user?.email}</p>
                                                </div>
                                                <div className="p-2">
                                                    {userMenuItems.map((item, index) => (
                                                        item.action ? (
                                                            <button
                                                                key={index}
                                                                onClick={() => {
                                                                    setShowProfileMenu(false);
                                                                    item.action();
                                                                }}
                                                                className="flex items-center space-x-3 w-full p-2 text-amber-50 hover:bg-amber-700 rounded-lg transition-colors"
                                                            >
                                                                <span>{item.icon}</span>
                                                                <span>{item.name}</span>
                                                            </button>
                                                        ) : (
                                                            <Link
                                                                key={index}
                                                                href={item.href}
                                                                onClick={() => setShowProfileMenu(false)}
                                                                className="flex items-center space-x-3 w-full p-2 text-amber-50 hover:bg-amber-700 rounded-lg transition-colors"
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
                                    className="flex items-center space-x-2 text-amber-50 hover:text-amber-200 px-4 py-2 rounded-lg hover:bg-amber-800/30 transition-all"
                                >
                                    <FiUser className="text-xl" />
                                    <span className="text-sm font-medium">Iniciar Sesión</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Espaciador para el contenido debajo del menú fijo */}
            <div className="h-16" />
        </>
    );
} 