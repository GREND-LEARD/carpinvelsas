'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';  // Añadir esta importación
import { FiTool, FiStar, FiUsers, FiShield, FiCoffee, FiAward, FiHeart } from 'react-icons/fi';
import { useRef } from 'react';

export default function Home() {
  const router = useRouter();  // Añadir esto
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const position = useTransform(scrollYProgress, (pos) => {
    return `${pos * 50}%`;
  });
  const projects = [
    {
      title: "Comedor Rústico",
      description: "Mesa y sillas talladas en madera de pino macizo",
      image: "/proyectos/comedor.jpg"
    },
    {
      title: "Armario Vintage",
      description: "Restauración de armario antiguo con detalles únicos",
      image: "/proyectos/armario.jpg"
    },
    {
      title: "Escritorio Moderno",
      description: "Diseño contemporáneo con maderas nobles",
      image: "/proyectos/escritorio.jpg"
    }
  ];
  const features = [
    {
      icon: <FiTool className="w-8 h-8" />,
      title: "Artesanía Excepcional",
      description: "Creaciones únicas que cuentan historias"
    },
    {
      icon: <FiStar className="w-8 h-8" />,
      title: "Calidad Premium",
      description: "Materiales selectos y acabados perfectos"
    },
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: "Hecho con Amor",
      description: "Cada pieza refleja nuestra pasión"
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: "Reconocimiento",
      description: "Premiados por nuestra excelencia"
    }
  ];
  const testimonials = [
    {
      name: "María González",
      role: "Diseñadora de Interiores",
      comment: "Los muebles artesanales transformaron completamente mis proyectos.",
      image: "/client1.jpg"
    },
    {
      name: "Carlos Ruiz",
      role: "Coleccionista",
      comment: "La atención al detalle es simplemente extraordinaria.",
      image: "/client2.jpg"
    },
    {
      name: "Ana Martínez",
      role: "Arquitecta",
      comment: "Profesionalismo y creatividad en cada proyecto.",
      image: "/client3.jpg"
    }
  ];
  return (
    <div className="relative">
      {/* Hero Section con Parallax */}
      <motion.div 
        ref={targetRef}
        style={{ opacity }}
        className="min-h-screen relative overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 bg-[url('/textura-madera.jpg')] bg-cover bg-center"
          style={{ y: position }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/50 to-amber-950/80" />
        
        <div className="relative z-10 container mx-auto px-4 h-screen flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-serif font-bold text-amber-50 mb-6"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              Taller de Artesanos
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-amber-100 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Donde cada pieza cuenta una historia y cada detalle marca la diferencia
            </motion.p>
            <motion.div 
              className="flex flex-col md:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/register" 
                  className="px-8 py-4 bg-amber-600 text-amber-50 rounded-full font-medium hover:bg-amber-500 transition-all shadow-lg hover:shadow-amber-500/50"
                >
                  Únete al Taller
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/login'}
              >
                <button 
                  className="px-8 py-4 bg-amber-100/20 text-amber-50 rounded-full font-medium hover:bg-amber-100/30 transition-all backdrop-blur-sm"
                >
                  Acceder
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <FiCoffee className="text-amber-50 w-8 h-8" />
        </motion.div>
      </motion.div>

      {/* Features Section con Cards Animadas */}
      <div className="bg-amber-50 py-32">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)"
                }}
                className="p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 mb-6"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-amber-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-amber-600 text-lg">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Testimonials con Efecto Glassmorphism */}
      <div className="relative py-32 bg-[url('/taller-bg.jpg')] bg-cover bg-fixed">
        <div className="absolute inset-0 bg-amber-900/70 backdrop-blur-sm" />
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-serif font-bold text-amber-50 mb-6">
              Voces Artesanales
            </h2>
            <p className="text-xl text-amber-100">
              Lo que nuestra comunidad dice sobre nosotros
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.3 }}
                whileHover={{ y: -10 }}
                className="bg-amber-50/10 backdrop-blur-md p-8 rounded-2xl border border-amber-50/20"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 font-bold text-2xl">
                    {testimonial.name[0]}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-amber-50 text-lg">{testimonial.name}</h4>
                    <p className="text-amber-200">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-amber-100 text-lg italic">
                  "{testimonial.comment}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Proyectos Destacados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ y: -10 }}
            className="relative group overflow-hidden rounded-2xl h-[400px]" 
          >
            <div className="aspect-[3/4] relative h-full"> 
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-amber-900/80">
              <h3 className="text-2xl font-bold text-amber-50 mb-2">
                {project.title}
              </h3>
              <p className="text-amber-100 mb-4">
                {project.description}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-amber-600 text-amber-50 rounded-full hover:bg-amber-500 transition-all"
              >
                Ver Detalles
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="py-20 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "150+", label: "Proyectos Completados" },
              { number: "98%", label: "Clientes Satisfechos" },
              { number: "15", label: "Años de Experiencia" },
              { number: "50+", label: "Artesanos Expertos" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-5xl font-bold text-amber-900 mb-4">
                  {stat.number}
                </h3>
                <p className="text-lg text-amber-700">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <footer className="bg-amber-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-serif font-bold text-amber-50 mb-8"
          >
            ¿Listo para crear algo extraordinario?
          </motion.h3>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/register" 
              className="inline-block px-12 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-amber-50 rounded-full font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/50"
            >
              Comienza tu Proyecto
            </Link>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}