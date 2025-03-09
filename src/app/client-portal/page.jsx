'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    FiPackage, 
    FiClock, 
    FiDollarSign, 
    FiMessageSquare, 
    FiPlus,
    FiTool,
    FiCalendar,
    FiCheckCircle,
    FiArrowRight,
    FiShoppingBag,
    FiSearch,
    FiHelpCircle
} from 'react-icons/fi';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Link from 'next/link';

function ClientPortal() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        presupuestoEstimado: '',
        fechaDeseada: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/client/solicitar-proyecto', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowForm(false);
                setFormData({
                    titulo: '',
                    descripcion: '',
                    presupuestoEstimado: '',
                    fechaDeseada: ''
                });
            }
        } catch (error) {
            console.error('Error al enviar solicitud:', error);
        }
    };

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                setLoading(true);
                
                // Ver si es un usuario nuevo (simulado - en producción vendría de la API)
                const isFirstLogin = !localStorage.getItem('hasLoggedInBefore');
                setIsNewUser(isFirstLogin);
                if (isFirstLogin) {
                    localStorage.setItem('hasLoggedInBefore', 'true');
                }
                
                // En un sistema real, aquí se cargarían los datos del cliente desde la API
                setProjects([
                    {
                        id: 1,
                        nombre: 'Armario Empotrado',
                        estado: 'en_progreso',
                        fechaInicio: '2023-02-15',
                        fechaEstimadaFin: '2023-03-30',
                        progreso: 65
                    },
                    {
                        id: 2,
                        nombre: 'Mesa de Comedor',
                        estado: 'pendiente',
                        fechaInicio: '2023-03-01',
                        fechaEstimadaFin: '2023-04-15',
                        progreso: 20
                    }
                ]);
                
                setNotifications([
                    {
                        id: 1,
                        mensaje: 'Tu proyecto "Armario Empotrado" ha avanzado al 65%',
                        fecha: '2 horas atrás',
                        leida: false
                    },
                    {
                        id: 2,
                        mensaje: 'Se ha actualizado el presupuesto para "Mesa de Comedor"',
                        fecha: '1 día atrás',
                        leida: true
                    },
                    {
                        id: 3,
                        mensaje: 'Nuevo mensaje del carpintero sobre tu proyecto',
                        fecha: '3 días atrás',
                        leida: true
                    }
                ]);
                
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setLoading(false);
            }
        };
        
        fetchClientData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.leida).length;
    const inProgressCount = projects.filter(p => p.estado === 'en_progreso').length;

    // Opciones principales que queremos destacar
    const mainOptions = [
        {
            title: "Calcular Presupuesto",
            description: "Diseña y calcula el costo de tu próximo proyecto de carpintería",
            icon: <FiDollarSign className="w-8 h-8" />,
            href: "/client-portal/presupuestos",
            color: "bg-gradient-to-br from-amber-400 to-amber-600"
        },
        {
            title: "Catálogo de Productos",
            description: "Explora nuestra colección de muebles y productos de madera",
            icon: <FiSearch className="w-8 h-8" />,
            href: "/productos",
            color: "bg-gradient-to-br from-emerald-400 to-emerald-600"
        },
        {
            title: "Solicitar Proyecto",
            description: "Describe tu idea y nuestros carpinteros te contactarán",
            icon: <FiTool className="w-8 h-8" />,
            href: "#",
            action: () => setShowForm(true),
            color: "bg-gradient-to-br from-blue-400 to-blue-600"
        },
        {
            title: "Centro de Ayuda",
            description: "Preguntas frecuentes y soporte para tus consultas",
            icon: <FiHelpCircle className="w-8 h-8" />,
            href: "/ayuda",
            color: "bg-gradient-to-br from-purple-400 to-purple-600"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Encabezado y acciones rápidas */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-amber-50 mb-2">
                        ¡Bienvenido, {user?.nombre || 'Cliente'}!
                    </h1>
                    <p className="text-amber-200">
                        Gestiona tus proyectos y solicita presupuestos desde tu portal personal
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link href="/client-portal/presupuestos">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
                        >
                            <FiDollarSign className="w-5 h-5" />
                            Calcular Presupuesto
                        </motion.button>
                    </Link>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                    >
                        <FiPlus className="w-5 h-5" />
                        Solicitar Proyecto
                    </motion.button>
                </div>
            </div>

            {/* Mensaje de bienvenida para nuevos usuarios */}
            {isNewUser && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border-l-4 border-amber-500"
                >
                    <div className="flex items-start">
                        <div className="flex-grow">
                            <h2 className="text-2xl font-bold text-amber-900 mb-2">¡Te damos la bienvenida a Carpinvelsas!</h2>
                            <p className="text-amber-700 mb-4">
                                Este es tu portal personalizado donde podrás gestionar tus proyectos, calcular presupuestos 
                                y comunicarte con nuestro equipo de carpinteros.
                            </p>
                            <p className="text-amber-700">
                                Explora las opciones a continuación para comenzar.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Opciones destacadas para todos los usuarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainOptions.map((option, index) => (
                    <motion.div
                        key={option.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-xl overflow-hidden shadow-xl h-full"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        {option.action ? (
                            <div 
                                className="cursor-pointer h-full flex flex-col"
                                onClick={option.action}
                            >
                                <div className={`${option.color} p-6 text-white`}>
                                    {option.icon}
                                    <h3 className="text-xl font-bold mt-4">{option.title}</h3>
                                </div>
                                <div className="bg-white p-6 flex-grow">
                                    <p className="text-amber-800">{option.description}</p>
                                    <div className="flex justify-end mt-4">
                                        <FiArrowRight className="text-amber-600" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href={option.href} className="h-full flex flex-col">
                                <div className={`${option.color} p-6 text-white`}>
                                    {option.icon}
                                    <h3 className="text-xl font-bold mt-4">{option.title}</h3>
                                </div>
                                <div className="bg-white p-6 flex-grow">
                                    <p className="text-amber-800">{option.description}</p>
                                    <div className="flex justify-end mt-4">
                                        <FiArrowRight className="text-amber-600" />
                                    </div>
                                </div>
                            </Link>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Estadísticas y KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl"
                >
                    <div className="bg-amber-500 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                        <FiPackage className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-amber-900">{projects.length}</h3>
                    <p className="text-amber-600">Proyectos Activos</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl"
                >
                    <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                        <FiClock className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-amber-900">{inProgressCount}</h3>
                    <p className="text-amber-600">En Progreso</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl cursor-pointer"
                    onClick={() => window.location.href = "/client-portal/presupuestos"}
                >
                    <div className="bg-emerald-500 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                        <FiDollarSign className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-amber-900">Calcular</h3>
                    <p className="text-amber-600">Presupuestos</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl"
                >
                    <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4">
                        <FiMessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-amber-900">{unreadCount}</h3>
                    <p className="text-amber-600">Mensajes Nuevos</p>
                </motion.div>
            </div>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Proyectos activos */}
                <div className="lg:col-span-2">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-amber-900">Proyectos Activos</h2>
                            <Link href="/client-portal/proyectos">
                                <span className="text-amber-600 hover:text-amber-700">Ver todos →</span>
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <motion.div
                                        key={project.id}
                                        whileHover={{ scale: 1.01 }}
                                        className="bg-white p-6 rounded-xl shadow-lg"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <h3 className="font-bold text-amber-900">{project.nombre}</h3>
                                                <p className="text-sm text-amber-600">Inicio: {project.fechaInicio}</p>
                                            </div>
                                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm">
                                                {project.fechaEstimadaFin}
                                            </span>
                                        </div>
                                        <div className="relative pt-2">
                                            <div className="flex mb-2 items-center justify-between">
                                                <span className="text-xs font-semibold text-amber-700">
                                                    Progreso
                                                </span>
                                                <span className="text-xs font-semibold text-amber-700">
                                                    {project.progreso}%
                                                </span>
                                            </div>
                                            <div className="overflow-hidden h-2 bg-amber-100 rounded-full">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${project.progreso}%` }}
                                                    transition={{ duration: 1 }}
                                                    className="h-full bg-amber-500 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center p-8">
                                    <p className="text-amber-700 mb-4">Aún no tienes proyectos activos</p>
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
                                    >
                                        <FiPlus className="w-5 h-5" />
                                        Solicitar Proyecto
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Panel lateral */}
                <div className="space-y-6">
                    {/* Notificaciones */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-amber-900">Notificaciones</h2>
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {unreadCount} nuevas
                                </span>
                            )}
                        </div>
                        <div className="space-y-4">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <motion.div
                                        key={notification.id}
                                        whileHover={{ x: 5 }}
                                        className={`p-4 rounded-lg ${
                                            !notification.leida ? 'bg-amber-100 border-l-4 border-amber-500' : 'bg-white'
                                        }`}
                                    >
                                        <p className="text-amber-900">{notification.mensaje}</p>
                                        <p className="text-sm text-amber-600 mt-2">{notification.fecha}</p>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-amber-700 text-center p-4">No hay notificaciones</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Próximos eventos */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl"
                    >
                        <h2 className="text-2xl font-bold text-amber-900 mb-6">Próximos Eventos</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <FiCalendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-amber-900">Entrega Estimada</h3>
                                    <p className="text-sm text-amber-600">Armario Empotrado - 30 Mar</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <FiCheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-amber-900">Revisión de Avance</h3>
                                    <p className="text-sm text-amber-600">Mesa de Comedor - 15 Mar</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
                                <div className="bg-amber-100 p-3 rounded-lg">
                                    <FiTool className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-amber-900">Inicio de Producción</h3>
                                    <p className="text-sm text-amber-600">Mesa de Comedor - 1 Mar</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default function ClientPortalPage() {
    return (
        <ProtectedRoute allowedRoles={['client']}>
            <ClientPortal />
        </ProtectedRoute>
    );
}