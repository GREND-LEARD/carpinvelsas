'use client';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiTool, FiStar, FiUsers, FiShield, FiCoffee, FiAward, FiHeart, FiArrowRight, FiClock, FiTrendingUp, FiCheckCircle, FiMapPin } from 'react-icons/fi';
import { useRef, useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const targetRef = useRef(null);
  const MotionLink = motion(Link);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
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

  return (
    <div className="relative">
      {/* Floating Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="fixed top-6 right-6 z-50"
        aria-label="Navegación rápida"
      >
        <div className="bg-amber-800/80 backdrop-blur-md p-3 rounded-full shadow-lg flex gap-4">
          <Link href="/register">
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }} 
              className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center"
              aria-label="Registrarse"
            >
              <FiUsers className="text-amber-50" aria-hidden="true" />
            </motion.div>
          </Link>
          <Link href="/login">
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }} 
              className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center"
              aria-label="Iniciar sesión"
            >
              <FiShield className="text-amber-50" aria-hidden="true" />
            </motion.div>
          </Link>
        </div>
      </motion.nav>

      <main>
        {/* Hero Section con Parallax Mejorado */}
        <header 
          ref={targetRef}
          style={{ opacity }}
          className="min-h-screen relative overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-[url('/textura-madera.jpg')] bg-cover bg-center"
            style={{ y: position }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/50 to-amber-950/80" aria-hidden="true" />
          
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
                className="mb-6 mx-auto w-24 h-24 bg-amber-600/40 backdrop-blur-sm rounded-full flex items-center justify-center"
                aria-hidden="true"
              >
                <FiTool className="text-amber-50 w-12 h-12" />
              </motion.div>
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
                Donde cada pieza cuenta una historia y cada detalle marca la diferencia en el arte de la carpintería fina
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
                  Únete al Taller <FiArrowRight className="ml-2" aria-hidden="true" />
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
                  className="p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-amber-100"
                >
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 mb-6"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-amber-800">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Proceso de Trabajo - Nueva Sección */}
        <section className="py-32 bg-[url('/workshop-bg.jpg')] bg-cover bg-fixed relative">
          <div className="absolute inset-0 bg-amber-950/80" aria-hidden="true"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl font-serif font-bold text-amber-50 mb-6">
                Nuestro Proceso
              </h2>
              <div className="w-24 h-1 bg-amber-500 mx-auto mb-6" aria-hidden="true"></div>
              <p className="text-xl text-amber-200 max-w-2xl mx-auto">
                De la idea a la obra maestra: así trabajamos para ti
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="bg-amber-900/50 backdrop-blur-sm p-8 rounded-xl border border-amber-500/20">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center text-amber-950 mb-6 mx-auto"
                      aria-hidden="true"
                    >
                      {step.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-amber-50 mb-2 text-center">
                      {step.title}
                    </h3>
                    <p className="text-amber-200 text-center">
                      {step.description}
                    </p>
                  </div>
                  {index < processSteps.length - 1 && (
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ delay: (index + 1) * 0.3, duration: 0.5 }}
                      className="hidden md:block h-0.5 bg-amber-500 absolute top-1/2 left-full w-0"
                      style={{ width: '50%', transform: 'translateX(-50%)' }}
                      aria-hidden="true"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials con Carrusel Mejorado */}
        <section className="relative py-32 bg-[url('/taller-bg.jpg')] bg-cover bg-fixed">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-800/80 backdrop-blur-sm" aria-hidden="true" />
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
              <div className="w-24 h-1 bg-amber-400 mx-auto mb-6" aria-hidden="true"></div>
              <p className="text-xl text-amber-100">
                Lo que nuestra comunidad dice sobre nosotros
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="bg-amber-50/10 backdrop-blur-md p-10 rounded-2xl border border-amber-50/20 relative"
                >
                  <div className="absolute -top-6 -left-6 text-amber-200 text-6xl opacity-50" aria-hidden="true">"</div>
                  <div className="absolute -bottom-6 -right-6 text-amber-200 text-6xl opacity-50" aria-hidden="true">"</div>
                  <div className="flex flex-col md:flex-row items-center mb-6 gap-6">
                    <div 
                      className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 font-bold text-2xl"
                      aria-hidden="true"
                    >
                      {testimonials[currentTestimonial].name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-50 text-2xl">{testimonials[currentTestimonial].name}</h3>
                      <p className="text-amber-200">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                  <blockquote>
                    <p className="text-amber-100 text-xl italic">
                      "{testimonials[currentTestimonial].comment}"
                    </p>
                  </blockquote>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-center mt-8 gap-2" role="tablist" aria-label="Controles de testimonios">
                {testimonials.map((testimonial, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    whileHover={{ scale: 1.5 }}
                    className={`w-4 h-4 rounded-full ${currentTestimonial === index ? 'bg-amber-400' : 'bg-amber-700'}`}
                    aria-label={`Ver testimonio de ${testimonial.name}`}
                    aria-selected={currentTestimonial === index}
                    role="tab"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Proyectos Destacados Mejorados */}
        <section className="py-32 bg-amber-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl font-serif font-bold text-amber-900 mb-6">
                Obras Maestras
              </h2>
              <div className="w-24 h-1 bg-amber-600 mx-auto mb-6" aria-hidden="true"></div>
              <p className="text-xl text-amber-800 max-w-2xl mx-auto">
                Explora nuestra colección de creaciones artesanales únicas
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="relative group overflow-hidden rounded-2xl h-[400px] shadow-xl" 
                >
                  <div className="aspect-[3/4] relative h-full"> 
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                    <img 
                      src={project.image}
                      alt={`Proyecto de ${project.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-amber-900/90 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-amber-50 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-amber-100 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4" aria-label="Categorías">
                      {project.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="bg-amber-700 text-amber-100 text-xs px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="min-h-[40px] min-w-[120px] px-6 py-2 bg-amber-600 text-amber-50 rounded-full hover:bg-amber-500 transition-all flex items-center gap-2 justify-center"
                      aria-label={`Ver detalles de ${project.title}`}
                      onClick={() => router.push('/productos')}
                    >
                      Ver Detalles <FiArrowRight aria-hidden="true" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(217, 119, 6, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/productos')}
              className="min-h-[54px] min-w-[220px] px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-amber-50 rounded-full font-medium hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-amber-500/50 flex items-center gap-2 justify-center"
              aria-label="Ver catálogo completo"
            >
              Ver Catálogo Completo <FiArrowRight className="ml-2" aria-hidden="true" />
            </motion.button>
          </motion.div>
        </section>
        
        {/* Estadísticas Mejoradas */}
        <section className="py-20 bg-[url('/wood-texture.jpg')] bg-cover relative">
          <div className="absolute inset-0 bg-amber-900/80" aria-hidden="true"></div>
          <div className="container mx-auto px-4 relative z-10">
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
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="text-center bg-amber-50/10 backdrop-blur-md p-8 rounded-xl border border-amber-50/20"
                >
                  <motion.h3 
                    className="text-5xl font-bold text-amber-50 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.2 }}
                  >
                    {stat.number}
                  </motion.h3>
                  <p className="text-lg text-amber-200">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Newsletter Section - Nueva */}
        <section className="py-20 bg-amber-800">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-amber-50/10 backdrop-blur-md p-10 rounded-2xl border border-amber-50/20">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-serif font-bold text-amber-50 mb-4">
                  Mantente Conectado
                </h2>
                <p className="text-amber-200">
                  Recibe inspiración, novedades y ofertas exclusivas
                </p>
              </motion.div>
              
              <form className="flex flex-col md:flex-row gap-4">
                <label className="sr-only" htmlFor="email-newsletter">Tu correo electrónico</label>
                <input 
                  id="email-newsletter"
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  className="flex-1 p-4 rounded-lg bg-amber-50/20 border border-amber-50/30 text-amber-50 placeholder:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="min-h-[54px] py-4 px-8 bg-amber-500 text-amber-950 font-medium rounded-lg hover:bg-amber-400 transition-all"
                  type="submit"
                >
                  Suscribirme
                </motion.button>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer Mejorado */}
      <footer className="bg-amber-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-serif font-bold text-amber-50 mb-8"
          >
            ¿Listo para crear algo extraordinario?
          </motion.h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <MotionLink 
              href="/contact"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(217, 119, 6, 0.5)" }} 
              whileTap={{ scale: 0.95 }} 
              className="min-h-[54px] min-w-[180px] px-12 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-amber-50 rounded-full font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/50"
            >
              Contáctanos
            </MotionLink>
            <MotionLink 
              href="/register"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(217, 119, 6, 0.5)" }} 
              whileTap={{ scale: 0.95 }} 
              className="min-h-[54px] min-w-[180px] px-12 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-amber-50 rounded-full font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/50"
            >
              Comienza tu Proyecto
            </MotionLink>
          </div>
          
          <nav className="flex justify-center gap-8 mt-16 mb-8" aria-label="Redes sociales">
            {[
              {name: 'Instagram', url: '#instagram'}, 
              {name: 'Facebook', url: '#facebook'}, 
              {name: 'Pinterest', url: '#pinterest'}, 
              {name: 'Youtube', url: '#youtube'}
            ].map((social, i) => (
              <motion.a 
                key={i}
                href={social.url}
                whileHover={{ y: -5, scale: 1.1 }}
                className="text-amber-300 hover:text-amber-50 transition-colors min-w-[24px] min-h-[24px]"
                aria-label={`Visita nuestro perfil de ${social.name}`}
              >
                {social.name}
              </motion.a>
            ))}
          </nav>
          
          <p className="text-amber-300/60">
            © {new Date().getFullYear()} Taller de Artesanos. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}