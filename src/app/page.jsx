'use client';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiTool, FiStar, FiUsers, FiShield, FiCoffee, FiAward, FiHeart, FiArrowRight, FiClock, FiTrendingUp, FiCheckCircle, FiMapPin, FiPlay, FiPause, FiChevronLeft, FiChevronRight, FiInstagram, FiPhone } from 'react-icons/fi';
import { useRef, useState, useEffect } from 'react';
import NavBar from '@/components/layout/NavBar';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const targetRef = useRef(null);
  const MotionLink = motion(Link);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [currentProject, setCurrentProject] = useState(0);
  
  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const position = useTransform(scrollYProgress, (pos) => {
    return `${pos * 50}%`;
  });

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isHovering) {
      const timer = setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentTestimonial, isHovering]);

  // Auto-rotate projects
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProject((prev) => (prev + 1) % projects.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [currentProject]);

  const projects = [
    {
      title: "Comedor Rústico",
      description: "Mesa y sillas talladas en madera de pino macizo con acabados artesanales tradicionales",
      image: "/proyectos/comedor.jpg",
      tags: ["Comedor", "Rústico", "Pino"]
    },
    {
      title: "Armario Vintage",
      description: "Restauración de armario antiguo con detalles únicos y técnicas tradicionales",
      image: "/proyectos/armario.jpg",
      tags: ["Restauración", "Vintage", "Mueble"]
    },
    {
      title: "Escritorio Moderno",
      description: "Diseño contemporáneo con maderas nobles y acabados minimalistas",
      image: "/proyectos/escritorio.jpg",
      tags: ["Moderno", "Oficina", "Minimalista"]
    },
    {
      title: "Cama con Dosel",
      description: "Tallada a mano con motivos florales y acabados en nogal",
      image: "/proyectos/cama.jpg",
      tags: ["Dormitorio", "Tallado", "Nogal"]
    }
  ];

  const features = [
    {
      icon: <FiTool className="w-8 h-8" aria-hidden="true" />,
      title: "Artesanía Excepcional",
      description: "Creaciones únicas que cuentan historias y trascienden generaciones"
    },
    {
      icon: <FiStar className="w-8 h-8" aria-hidden="true" />,
      title: "Calidad Premium",
      description: "Materiales selectos y acabados perfectos que superan expectativas"
    },
    {
      icon: <FiHeart className="w-8 h-8" aria-hidden="true" />,
      title: "Hecho con Amor",
      description: "Cada pieza refleja nuestra pasión y dedicación artesanal"
    },
    {
      icon: <FiAward className="w-8 h-8" aria-hidden="true" />,
      title: "Reconocimiento",
      description: "Premiados por nuestra excelencia y compromiso con la tradición"
    }
  ];

  const processSteps = [
    {
      icon: <FiClock className="w-8 h-8" aria-hidden="true" />,
      title: "Diseño Personalizado",
      description: "Colaboramos contigo para crear un diseño que se ajuste perfectamente a tus necesidades y estilo"
    },
    {
      icon: <FiCheckCircle className="w-8 h-8" aria-hidden="true" />,
      title: "Selección de Materiales",
      description: "Escogemos las mejores maderas y materiales para tu proyecto, con énfasis en calidad y sostenibilidad"
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" aria-hidden="true" />,
      title: "Creación Artesanal",
      description: "Nuestros maestros artesanos trabajan meticulosamente en cada detalle de tu pieza"
    },
    {
      icon: <FiMapPin className="w-8 h-8" aria-hidden="true" />,
      title: "Entrega y Montaje",
      description: "Llevamos tu creación a donde la necesites y nos aseguramos de que quede perfecta"
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Diseñadora de Interiores",
      comment: "Los muebles artesanales transformaron completamente mis proyectos. La calidad y atención al detalle son incomparables.",
      image: "/client1.jpg"
    },
    {
      name: "Carlos Ruiz",
      role: "Coleccionista",
      comment: "La atención al detalle es simplemente extraordinaria. Cada pieza es una obra de arte que ahora adorna mi hogar.",
      image: "/client2.jpg"
    },
    {
      name: "Ana Martínez",
      role: "Arquitecta",
      comment: "Profesionalismo y creatividad en cada proyecto. Su capacidad para materializar mi visión superó todas mis expectativas.",
      image: "/client3.jpg"
    }
  ];
  
  // Estadísticas impactantes
  const stats = [
    { number: "25+", label: "Años de experiencia" },
    { number: "750+", label: "Proyectos completados" },
    { number: "98%", label: "Clientes satisfechos" },
    { number: "15", label: "Premios artesanales" }
  ];

  return (
    <div className="relative">
      <NavBar />

      <main>
        {/* Hero Section con Video de Fondo */}
        <header 
          ref={targetRef}
          className="min-h-screen relative overflow-hidden"
        >
          {/* Video de fondo */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <video 
              className="absolute w-full h-full object-cover"
              autoPlay 
              loop 
              muted={!isVideoPlaying}
              playsInline
              src="/video-carpinteria.mp4" 
              poster="/textura-madera.jpg"
            />
            <button 
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              className="absolute bottom-6 right-6 z-20 bg-amber-700/70 p-3 rounded-full backdrop-blur-sm"
              aria-label={isVideoPlaying ? "Pausar video" : "Reproducir video"}
            >
              {isVideoPlaying ? <FiPause className="text-white" /> : <FiPlay className="text-white" />}
            </button>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 h-screen flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-6 mx-auto w-28 h-28 bg-amber-600/40 backdrop-blur-sm rounded-full flex items-center justify-center"
                aria-hidden="true"
              >
                <FiTool className="text-amber-50 w-14 h-14" />
              </motion.div>
              <motion.h1 
                className="text-6xl md:text-8xl font-serif font-bold text-amber-50 mb-6 drop-shadow-lg"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                Carpinvelsas
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-amber-100 mb-12 max-w-3xl mx-auto drop-shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Artesanos de la madera transformando espacios con pasión y maestría desde 1998
              </motion.p>
              <motion.div 
                className="flex flex-col md:flex-row gap-6 justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <MotionLink 
                  href="/register"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(217, 119, 6, 0.5)" }} 
                  whileTap={{ scale: 0.95 }} 
                  className="min-w-[180px] min-h-[54px] px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-amber-50 rounded-full font-medium hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-amber-500/50 flex items-center gap-2 justify-center"
                >
                  Registrarse <FiArrowRight className="ml-2" aria-hidden="true" />
                </MotionLink>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/login')}
                >
                  <button 
                    className="min-w-[180px] min-h-[54px] px-8 py-4 bg-amber-100/20 text-amber-50 rounded-full font-medium hover:bg-amber-100/30 transition-all backdrop-blur-sm border border-amber-100/20"
                    aria-label="Acceder a mi cuenta"
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
            <motion.button 
              whileHover={{ scale: 1.2, rotate: 15 }} 
              className="cursor-pointer"
              aria-label="Desplazarse hacia abajo"
              onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}
            >
              <FiCoffee className="text-amber-50 w-8 h-8" aria-hidden="true" />
            </motion.button>
          </motion.div>
        </header>

        {/* Sección de estadísticas impactantes */}
        <section className="relative py-20 bg-gradient-to-r from-amber-800 to-amber-900 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/patron-madera.png')] opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <motion.p 
                    className="text-4xl md:text-6xl font-bold text-amber-200 mb-2"
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  >
                    {stat.number}
                  </motion.p>
                  <p className="text-amber-100">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section con Cards Animadas */}
        <section className="bg-gradient-to-b from-amber-50 to-amber-100 py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl font-serif font-bold text-amber-900 mb-6">
                Nuestro Arte
              </h2>
              <div className="w-24 h-1 bg-amber-600 mx-auto mb-6" aria-hidden="true"></div>
              <p className="text-xl text-amber-800 max-w-2xl mx-auto">
                Combina tradición y modernidad en cada detalle, creando piezas únicas que perduran
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white rounded-2xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="bg-gradient-to-br from-amber-500 to-amber-700 w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 transform transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-4">{feature.title}</h3>
                  <p className="text-amber-700">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Nueva sección de galería con slider */}
        <section className="py-32 bg-[url('/textura-madera.jpg')] bg-cover relative">
          <div className="absolute inset-0 bg-amber-950/60 backdrop-blur-[2px]"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl font-serif font-bold text-amber-50 mb-6">
                Nuestras Creaciones
              </h2>
              <div className="w-24 h-1 bg-amber-500 mx-auto mb-6" aria-hidden="true"></div>
              <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                Cada pieza cuenta una historia de artesanía, dedicación y pasión por la madera
              </p>
            </motion.div>

            <div className="relative max-w-5xl mx-auto">
              {/* Flechas de navegación */}
              <button 
                onClick={() => setCurrentProject((prev) => (prev === 0 ? projects.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-amber-800/70 backdrop-blur-sm p-3 rounded-full text-white"
                aria-label="Proyecto anterior"
              >
                <FiChevronLeft size={24} />
              </button>
              
              <button 
                onClick={() => setCurrentProject((prev) => (prev + 1) % projects.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-amber-800/70 backdrop-blur-sm p-3 rounded-full text-white"
                aria-label="Proyecto siguiente"
              >
                <FiChevronRight size={24} />
              </button>

              {/* Slider de proyectos */}
              <div className="overflow-hidden rounded-2xl shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentProject}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="relative aspect-[16/9]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
                      <h3 className="text-3xl font-bold mb-2">{projects[currentProject].title}</h3>
                      <p className="text-amber-100 mb-4">{projects[currentProject].description}</p>
                      <div className="flex flex-wrap gap-2">
                        {projects[currentProject].tags.map((tag, i) => (
                          <span key={i} className="bg-amber-700/70 backdrop-blur-sm text-sm px-3 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <img 
                      src={projects[currentProject].image} 
                      alt={projects[currentProject].title} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Indicadores */}
              <div className="flex justify-center gap-2 mt-6">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProject(index)}
                    className={`w-3 h-3 rounded-full ${
                      currentProject === index ? 'bg-amber-500' : 'bg-amber-300/50'
                    }`}
                    aria-label={`Ver proyecto ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section con Cards Animadas */}
        <section className="bg-gradient-to-b from-amber-100 to-amber-50 py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl font-serif font-bold text-amber-900 mb-6">
                Nuestro Proceso
              </h2>
              <div className="w-24 h-1 bg-amber-600 mx-auto mb-6" aria-hidden="true"></div>
              <p className="text-xl text-amber-800 max-w-2xl mx-auto">
                De la idea al objeto, un viaje de transformación artesanal
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Línea conectora */}
              <div className="hidden lg:block absolute top-24 left-24 right-24 h-0.5 bg-amber-300"></div>
              
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-2xl p-8 shadow-xl relative z-10"
                >
                  <div className="bg-gradient-to-br from-amber-500 to-amber-700 w-16 h-16 rounded-full flex items-center justify-center text-white mb-6 mx-auto">
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-amber-800 rounded-full text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-amber-900 mb-4 text-center">{step.title}</h3>
                  <p className="text-amber-700 text-center">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section con Cards Mejoradas */}
        <section className="bg-gradient-to-br from-amber-900 to-amber-800 py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/patron-madera.png')] opacity-5" aria-hidden="true"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl font-serif font-bold text-amber-50 mb-6">
                Lo Que Dicen Nuestros Clientes
              </h2>
              <div className="w-24 h-1 bg-amber-500 mx-auto mb-6" aria-hidden="true"></div>
              <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                Historias de transformación y satisfacción con nuestras creaciones
              </p>
            </motion.div>
            
            <div className="max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentTestimonial}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-10 shadow-xl relative"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="text-5xl text-amber-500/30 font-serif absolute top-6 left-6" aria-hidden="true">"</div>
                  <div className="text-5xl text-amber-500/30 font-serif absolute bottom-6 right-6" aria-hidden="true">"</div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-500/50 flex-shrink-0">
                      <img 
                        src={testimonials[currentTestimonial].image} 
                        alt={testimonials[currentTestimonial].name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-amber-100 text-lg italic mb-6">
                        {testimonials[currentTestimonial].comment}
                      </p>
                      <div>
                        <p className="text-amber-200 font-bold">{testimonials[currentTestimonial].name}</p>
                        <p className="text-amber-300/70">{testimonials[currentTestimonial].role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navegación de testimonios */}
                  <div className="flex justify-center gap-2 mt-8">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          currentTestimonial === index ? 'bg-amber-500' : 'bg-amber-500/30'
                        }`}
                        aria-label={`Ver testimonio ${index + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Call to Action Section Mejorada */}
        <section className="py-20 bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-[url('/textura-madera.jpg')] opacity-20 mix-blend-overlay" aria-hidden="true"></div>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-8 md:p-12 relative z-10">
                <div className="lg:col-span-3 flex flex-col justify-center">
                  <motion.h2 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold text-amber-50 mb-6"
                  >
                    ¿Listo para transformar tus espacios?
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-amber-100 text-lg mb-8"
                  >
                    Únete a nuestra comunidad y descubre el poder de la artesanía en madera. 
                    Calcula presupuestos, consulta nuestro catálogo y conecta con nuestros artesanos.
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Link href="/register">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-amber-50 text-amber-900 rounded-full font-medium hover:bg-amber-100 transition-all shadow-lg flex items-center gap-2"
                      >
                        Crear Cuenta <FiArrowRight />
                      </motion.button>
                    </Link>
                    <Link href="/productos">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-amber-800 text-amber-50 rounded-full font-medium hover:bg-amber-700 transition-all shadow-lg border border-amber-50/20"
                      >
                        Ver Catálogo
                      </motion.button>
                    </Link>
                  </motion.div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="lg:col-span-2 flex items-center justify-center"
                >
                  <div className="relative h-72 w-72">
                    <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-sm rounded-full animate-ping-slow"></div>
                    <div className="absolute inset-8 bg-amber-600/30 backdrop-blur-sm rounded-full animate-ping-slow animation-delay-1000"></div>
                    <div className="absolute inset-16 bg-amber-700/40 backdrop-blur-sm rounded-full animate-ping-slow animation-delay-2000"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-40 bg-amber-800 rounded-full flex items-center justify-center shadow-lg">
                        <FiPhone className="w-16 h-16 text-amber-50" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Instagram Feed Section */}
        <section className="py-20 bg-amber-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-amber-900 mb-2">
                Síguenos en Instagram
              </h2>
              <p className="text-amber-700">
                <FiInstagram className="inline-block mr-2" />
                @carpinvelsas
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: item * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square rounded-lg overflow-hidden shadow-md relative group"
                >
                  <img
                    src={`/instagram/insta-${item}.jpg`}
                    alt={`Instagram post ${item}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-amber-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <FiInstagram className="text-white w-8 h-8" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: scale(1.2);
            opacity: 0.2;
          }
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}