"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX, FiTool, FiPenTool, FiBook, FiPhone, FiUser } from "react-icons/fi";

export default function VerticalMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: "Productos", icon: <FiTool />, href: "/productos" },
        { name: "Proyectos", icon: <FiPenTool />, href: "/proyectos" },
        { name: "Perfil", icon: <FiUser />, href: "/login" },
        { name: "Blog", icon: <FiBook />, href: "/blog" },
        { name: "Contacto", icon: <FiPhone />, href: "/contacto" },
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
                    {menuItems.map((item) => (
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
                            {menuItems.map((item) => (
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
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </>
    );
}