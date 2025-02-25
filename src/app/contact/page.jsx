"use client";
import { motion } from 'framer-motion';
import { FiMail, FiMessageSquare, FiPhone, FiClock, FiMapPin, FiSend } from 'react-icons/fi';

export default function ContactPage() {
    const contactInfo = [
        {
            icon: <FiPhone size={24} />,
            title: "Llámanos",
            description: "Disponibles en horario comercial",
            detail: "+57 300 000 0000"
        },
        {
            icon: <FiMail size={24} />,
            title: "Escríbenos",
            description: "Te responderemos lo antes posible",
            detail: "info@carpinvelsas.com"
        },
        {
            icon: <FiMapPin size={24} />,
            title: "Visítanos",
            description: "Nuestro taller está abierto para ti",
            detail: "Calle Principal #123, Ciudad"
        }
    ];

    return (
        <div className="min-h-screen min-w-full flex items-center justify-center p-4 overflow-x-hidden relative">
            {/* Fondo con patrón de madera */}
            <motion.div 
                className="fixed inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    background: "url('https://www.toptal.com/designers/subtlepatterns/uploads/wood_pattern.png')"
                }}
            />
            {/* Resto del contenido */}
            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 z-10 px-4 md:px-8 py-12 relative">
                {/* Formulario de contacto */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full lg:w-1/2 bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl"
                >
                    <div className="mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="inline-block px-4 py-1 bg-[#4F3422]/10 rounded-full mb-4"
                        >
                            <span className="text-sm font-medium text-[#4F3422]">📝 Contáctanos</span>
                        </motion.div>
                        <h2 className="text-3xl font-bold text-[#4F3422] mb-2">Envíanos un mensaje</h2>
                        <p className="text-[#4F3422]/80">Estamos aquí para ayudarte con tu proyecto</p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#4F3422] mb-1">Nombre completo</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg bg-white border border-[#4F3422]/20 focus:border-[#4F3422] focus:ring-2 focus:ring-[#4F3422]/20 transition-all"
                                    placeholder="Tu nombre"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#4F3422] mb-1">Correo electrónico</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-lg bg-white border border-[#4F3422]/20 focus:border-[#4F3422] focus:ring-2 focus:ring-[#4F3422]/20 transition-all"
                                    placeholder="tu@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#4F3422] mb-1">Mensaje</label>
                                <textarea
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-lg bg-white border border-[#4F3422]/20 focus:border-[#4F3422] focus:ring-2 focus:ring-[#4F3422]/20 transition-all"
                                    placeholder="¿En qué podemos ayudarte?"
                                ></textarea>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-[#4F3422] text-white rounded-lg font-medium hover:bg-[#4F3422]/90 transition-all flex items-center justify-center gap-2"
                        >
                            <FiSend />
                            Enviar mensaje
                        </motion.button>
                    </form>
                </motion.div>

                {/* Información de contacto */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full lg:w-1/2 space-y-8"
                >
                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-bold text-[#4F3422]">
                            Estamos aquí para ti
                        </h1>
                        <p className="text-lg text-[#4F3422]/90">
                            Conecta con nosotros y descubre cómo podemos hacer realidad tu proyecto
                        </p>
                    </div>

                    <div className="space-y-6">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (index * 0.1) }}
                                whileHover={{ scale: 1.02, x: 10 }}
                                className="flex items-start gap-4 p-4 bg-white/50 rounded-lg hover:bg-white/80 transition-all cursor-pointer"
                            >
                                <div className="p-3 bg-[#4F3422]/10 rounded-lg text-[#4F3422]">
                                    {info.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#4F3422]">{info.title}</h3>
                                    <p className="text-sm text-[#4F3422]/80">{info.description}</p>
                                    <p className="text-[#4F3422] font-medium mt-1">{info.detail}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="fixed bottom-4 text-[#4F3422]/80 text-sm text-center w-full px-4 z-20"
            >
                <p className="flex items-center justify-center gap-2">
                    <FiClock />
                    © 2024 Carpinvelsas. Transformando ideas en realidad.
                </p>
            </motion.div>
        </div>
    );
}