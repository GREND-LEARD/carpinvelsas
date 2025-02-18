// components/ProjectGallery.jsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
    { id: 1, title: "Cocina Moderna", category: "Interiores" },
    { id: 2, title: "Mesa Rustica", category: "Muebles" },
    { id: 3, title: "Biblioteca Clásica", category: "Diseño Personalizado" },
    { id: 4, title: "Puertas Talladas", category: "Arte en Madera" },
    { id: 5, title: "Dormitorio Contemporáneo", category: "Conjuntos" },
    { id: 6, title: "Sillas Diseño", category: "Muebles" },
];

export default function ProjectGallery() {
    return (
        <section className="py-12 md:py-20 px-4 bg-amber-50">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-amber-900 mb-8 md:mb-12 text-center"
                >
                    Nuestra Obra Maestra
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group overflow-hidden rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                        >
                            <div className="aspect-square relative">
                                <Image
                                    src={`/proyecto-${project.id}.jpg`}
                                    alt={project.title}
                                    fill
                                    className="object-cover transform group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-6">
                                    <div className="text-left">
                                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                                        <p className="text-amber-200 font-light">{project.category}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}