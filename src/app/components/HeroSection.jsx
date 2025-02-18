// components/HeroSection.jsx
"use client";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="min-h-screen relative bg-[url('/textura-madera.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center space-y-6 lg:space-y-8"
                >
                    <motion.h1
                        initial={{ letterSpacing: "0em" }}
                        animate={{ letterSpacing: "0.1em" }}
                        transition={{ duration: 2 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-50 font-serif tracking-wide"
                    >
                        CARPINVEL SAS
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-amber-100 font-light max-w-2xl mx-auto leading-relaxed"
                    >
                        Artesanía en madera que perdura por generaciones
                    </motion.p>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-amber-700 hover:bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg flex items-center gap-2 mx-auto"
                        >
                            <span>Iniciar Proyecto</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}