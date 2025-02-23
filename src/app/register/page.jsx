"use client";
import AuthForm from '@/app/components/AuthForm';
import { motion } from 'framer-motion';
import { FiShield, FiStar, FiHeart, FiTrendingUp, FiCheck, FiAward, FiClock } from 'react-icons/fi';

export default function RegisterPage() {
    const benefits = [
        { 
            icon: <FiShield size={24} />, 
            text: "Acceso Seguro y Personalizado",
            description: "Sistema de autenticación avanzado para tu tranquilidad"
        },
        { 
            icon: <FiStar size={24} />, 
            text: "Seguimiento en Tiempo Real",
            description: "Monitorea tus proyectos con actualizaciones instantáneas"
        },
        { 
            icon: <FiHeart size={24} />, 
            text: "Atención Personalizada",
            description: "Servicio exclusivo adaptado a tus necesidades"
        },
        { 
            icon: <FiTrendingUp size={24} />, 
            text: "Gestión Eficiente",
            description: "Optimiza tus procesos y mejora la productividad"
        }
    ];

    const features = [
        "Comunicación directa con expertos",
        "Seguimiento fotográfico del progreso",
        "Presupuestos detallados",
        "Calendario de entregas"
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

            {/* Logo con animación - ajustado para móvil */}
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

            <div className="container mx-auto flex flex-col lg:flex-row-reverse items-center justify-between gap-6 lg:gap-12 z-10 px-4 md:px-8">
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
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
                            <span className="text-xs md:text-sm font-medium text-[#4F3422]">✨ Experiencia Premium</span>
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-[#4F3422] leading-tight">
                            Únete a la Excelencia en Carpintería
                        </h1>
                        <p className="text-lg md:text-xl text-[#4F3422]/90 leading-relaxed">
                            Descubre una nueva forma de gestionar tus proyectos con tecnología de vanguardia
                        </p>
                    </div>

                    {/* Lista de características - ajustada para móvil */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-6 lg:mt-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (index * 0.1) }}
                                className="flex items-center gap-2 text-[#4F3422] text-sm md:text-base"
                            >
                                <FiCheck className="text-[#4F3422] flex-shrink-0" />
                                <span>{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                    
                    {/* Beneficios - ajustados para móvil */}
                    <div className="space-y-3 md:space-y-4 mt-6 lg:mt-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + (index * 0.1) }}
                                whileHover={{ scale: 1.02, x: 10 }}
                                className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-[#4F3422]/5 rounded-lg hover:bg-[#4F3422]/10 transition-all cursor-pointer"
                            >
                                <div className="p-2 bg-[#4F3422]/10 rounded-lg text-[#4F3422] flex-shrink-0">
                                    {benefit.icon}
                                </div>
                                <div>
                                    <h3 className="text-[#4F3422] font-semibold text-sm md:text-base">{benefit.text}</h3>
                                    <p className="text-[#4F3422]/80 text-xs md:text-sm">{benefit.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Formulario */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full lg:w-1/2 px-4 md:px-0"
                >
                    <AuthForm isLogin={false} />
                </motion.div>
            </div>

            {/* Footer - ajustado para móvil */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-2 md:bottom-4 text-[#4F3422]/80 text-xs md:text-sm text-center w-full px-4"
            >
                <p className="flex items-center justify-center gap-2">
                    <FiClock className="text-[#4F3422]" />
                    © 2024 Carpinvelsas. Transformando ideas en realidad.
                </p>
            </motion.div>
        </div>
    );
}