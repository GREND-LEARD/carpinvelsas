"use client";
import AuthForm from '@/app/components/AuthForm';
import { motion } from 'framer-motion';
import { FiCoffee, FiTool, FiUsers } from 'react-icons/fi';

export default function LoginPage() {
    const features = [
        { icon: <FiTool size={24} />, text: "Gestión de Proyectos" },
        { icon: <FiUsers size={24} />, text: "Portal de Clientes" },
        { icon: <FiCoffee size={24} />, text: "Experiencia Premium" }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6] p-4 overflow-x-hidden">
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

            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 z-10 px-4 md:px-8">
                {/* Contenido izquierdo */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:w-1/2 text-[#4F3422] space-y-6 lg:space-y-8 p-4 lg:p-8"
                >
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="inline-block px-3 py-1 md:px-4 md:py-1 bg-[#4F3422]/10 rounded-full"
                        >
                            <span className="text-xs md:text-sm font-medium text-[#4F3422]">✨ Bienvenido de nuevo</span>
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-[#4F3422] leading-tight">
                            Accede a tu Portal
                        </h1>
                        <p className="text-lg md:text-xl text-[#4F3422]/90 leading-relaxed">
                            Gestiona tus proyectos de carpintería de manera eficiente
                        </p>
                    </div>
                    
                    <div className="space-y-4 mt-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (index * 0.1) }}
                                className="flex items-center gap-3 text-[#4F3422]"
                            >
                                <div className="p-2 bg-[#4F3422]/10 rounded-lg">
                                    {feature.icon}
                                </div>
                                <span className="text-sm md:text-base">{feature.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Formulario */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full lg:w-1/2 px-4 md:px-0"
                >
                    <AuthForm isLogin={true} />
                </motion.div>
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