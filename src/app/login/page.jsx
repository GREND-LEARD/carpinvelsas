"use client";
import AuthForm from '@/components/forms/AuthForm';
import { motion } from 'framer-motion';
import { FiCoffee, FiTool, FiUsers } from 'react-icons/fi';
import Link from 'next/link';
import BackToHome from '@/components/navigation/BackToHome';

export default function LoginPage() {
    const features = [
        { icon: <FiTool size={24} />, text: "Gestión de Proyectos" },
        { icon: <FiUsers size={24} />, text: "Portal de Clientes" },
        { icon: <FiCoffee size={24} />, text: "Experiencia Premium" }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6] p-4 overflow-x-hidden">
            {/* Navegación */}
            <BackToHome showBack={true} theme="light" />
            
            {/* Fondo con efecto suave */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-[#4F3422]/30 via-[#4F3422]/20 to-[#4F3422]/10 backdrop-blur-sm"
            />
            
            {/* Elementos decorativos flotantes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[
                    { left: "20%", top: "20%" },
                    { left: "40%", top: "35%" },
                    { left: "60%", top: "50%" },
                    { left: "25%", top: "65%" },
                    { left: "75%", top: "80%" }
                ].map((position, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ 
                            opacity: [0.3, 0.5, 0.3],
                            y: [-10, 10, -10],
                            x: [-10, 10, -10]
                        }}
                        transition={{
                            duration: 8,
                            delay: i * 0.5,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        className="absolute w-24 h-24 bg-[#4F3422]/10 rounded-full blur-xl"
                        style={position}
                    />
                ))}
            </div>

            {/* Logo */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="absolute top-4 right-4 md:top-10 md:right-10 text-[#4F3422]"
            >
                <motion.img 
                    src="/logo.png" 
                    alt="Logo" 
                    className="w-16 h-16 md:w-24 md:h-24 object-contain"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 200 }}
                />
            </motion.div>

            <div className="container max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Columna de formulario */}
                    <div className="flex justify-center">
                        <AuthForm isLogin={true} />
                    </div>
                    
                    {/* Columna de información */}
                    <div className="text-center lg:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-bold text-[#4F3422] mb-6 font-serif"
                        >
                            El Arte de la Madera en Tus Manos
                        </motion.h1>
                        
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-[#4F3422]/80 text-lg mb-8"
                        >
                            Accede a tu cuenta para gestionar proyectos, realizar pedidos personalizados y conectar con nuestros artesanos.
                        </motion.p>
                        
                        <div className="space-y-4 mb-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (index * 0.1) }}
                                    className="flex items-center bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-sm"
                                >
                                    <div className="bg-[#4F3422] p-2 rounded-full text-white mr-4">
                                        {feature.icon}
                                    </div>
                                    <span className="text-[#4F3422]">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-[#4F3422]/70"
                        >
                            ¿No tienes una cuenta?{' '}
                            <Link href="/register" className="text-[#4F3422] font-semibold underline hover:text-amber-600 transition-colors">
                                Regístrate aquí
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-2 md:bottom-4 text-[#4F3422]/80 text-xs md:text-sm text-center w-full px-4"
            >
                <p className="flex items-center justify-center gap-2">
                    © 2024 Carpinvelsas. Todos los derechos reservados.
                </p>
            </motion.div>
        </div>
    );
}