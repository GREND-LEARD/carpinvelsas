"use client";
import AuthForm from '@/components/forms/AuthForm';
import { motion } from 'framer-motion';
import { FiBox, FiClipboard, FiCreditCard } from 'react-icons/fi';
import Link from 'next/link';
import BackToHome from '@/components/navigation/BackToHome';

export default function RegisterPage() {
    const benefits = [
        { icon: <FiBox size={24} />, text: "Presupuestos personalizados" },
        { icon: <FiClipboard size={24} />, text: "Seguimiento de proyectos" },
        { icon: <FiCreditCard size={24} />, text: "Pagos seguros" }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5EFE6] p-4 overflow-x-hidden">
            {/* Navegación */}
            <BackToHome showBack={true} theme="light" />
            
            {/* Fondo con efecto de madera */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[url('/textura-madera.jpg')] bg-cover opacity-10"
            />
            
            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFE6] via-[#F5EFE6]/80 to-[#F5EFE6]/70"></div>
            
            {/* Elementos decorativos */}
            <motion.div 
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 0.5, rotate: -5 }}
                transition={{ duration: 1.5 }}
                className="absolute top-[15%] right-[10%] w-32 h-32 md:w-48 md:h-48 bg-[url('/sierra-circular.svg')] bg-contain bg-no-repeat opacity-20 z-0"
            />
            
            <motion.div 
                initial={{ opacity: 0, rotate: 20 }}
                animate={{ opacity: 0.5, rotate: 15 }}
                transition={{ duration: 1.5 }}
                className="absolute bottom-[15%] left-[10%] w-32 h-32 md:w-48 md:h-48 bg-[url('/martillo.svg')] bg-contain bg-no-repeat opacity-20 z-0"
            />

            <div className="container max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Columna de información */}
                    <div className="order-2 lg:order-1 text-center lg:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-bold text-[#4F3422] mb-6 font-serif"
                        >
                            Únete a Nuestra Comunidad
                        </motion.h1>
                        
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-[#4F3422]/80 text-lg mb-8"
                        >
                            Regístrate para acceder a beneficios exclusivos y comenzar 
                            a crear proyectos de carpintería a medida.
                        </motion.p>
                        
                        <div className="space-y-4 mb-8">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (index * 0.1) }}
                                    className="flex items-center bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-sm"
                                >
                                    <div className="bg-[#4F3422] p-2 rounded-full text-white mr-4">
                                        {benefit.icon}
                                    </div>
                                    <span className="text-[#4F3422]">{benefit.text}</span>
                                </motion.div>
                            ))}
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-[#4F3422]/70"
                        >
                            ¿Ya tienes una cuenta?{' '}
                            <Link href="/login" className="text-[#4F3422] font-semibold underline hover:text-amber-600 transition-colors">
                                Inicia sesión aquí
                            </Link>
                        </motion.div>
                    </div>
                    
                    {/* Columna de formulario */}
                    <div className="order-1 lg:order-2 flex justify-center">
                        <AuthForm isLogin={false} />
                    </div>
                </div>
            </div>
        </div>
    );
}