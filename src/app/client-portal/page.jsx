'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiDollarSign, FiMessageSquare, FiCalendar, FiPlus, FiTool, FiFileText } from 'react-icons/fi';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Link from 'next/link';

function ClientPortal() {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]); // Inicializamos como array vacío
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        presupuestoEstimado: '',
        fechaDeseada: ''
    });

    // Mover handleSubmit aquí, fuera del JSX
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
                const token = localStorage.getItem('token');
                // Obtener proyectos del cliente
                const projectsResponse = await fetch('/api/client/projects', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const projectsData = await projectsResponse.json();
                
                // Asegurarnos de que projects sea un array
                setProjects(Array.isArray(projectsData) ? projectsData : []);

                // Obtener notificaciones
                const notificationsResponse = await fetch('/api/client/notifications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const notificationsData = await notificationsResponse.json();
                setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
            } catch (error) {
                console.error('Error fetching client data:', error);
                setProjects([]); // En caso de error, establecer como array vacío
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchClientData();
    }, []);

    const stats = [
        { title: "Proyectos Activos", value: projects.length, icon: <FiTool />, color: "bg-amber-500" },
        { title: "Próxima Entrega", value: "15 MAR", icon: <FiCalendar />, color: "bg-emerald-500" },
        { title: "Mensajes", value: notifications.length, icon: <FiMessageSquare />, color: "bg-blue-500" },
        { title: "Presupuestos", value: "2", icon: <FiFileText />, color: "bg-purple-500" },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-50">
                <div className="text-amber-900">Cargando datos...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[url('/textura-madera.jpg')] bg-cover bg-fixed">
            <div className="min-h-screen backdrop-blur-xl bg-amber-900/30 p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold text-amber-50">
                            Bienvenido, {user?.nombre}
                        </h1>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg"
                        >
                            <FiPlus />
                            Solicitar Proyecto
                        </motion.button>
                    </div>
                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl"
                            >
                                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                                    {stat.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-amber-900">{stat.value}</h3>
                                <p className="text-amber-600">{stat.title}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Proyectos y Notificaciones */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Proyectos Activos */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl"
                            >
                                <h2 className="text-2xl font-bold text-amber-900 mb-6">Proyectos Activos</h2>
                                <div className="space-y-4">
                                    {projects.map((project) => (
                                        <motion.div
                                            key={project.id}
                                            whileHover={{ scale: 1.02 }}
                                            className="bg-white p-4 rounded-lg shadow"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-amber-900">{project.nombre}</h3>
                                                    <p className="text-sm text-amber-600">Inicio: {project.fechaInicio}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm ${
                                                    project.estado === 'En Proceso' ? 'bg-blue-100 text-blue-700' :
                                                    project.estado === 'Completado' ? 'bg-green-100 text-green-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {project.estado}
                                                </span>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-amber-700">
                                                    <FiClock className="w-4 h-4" />
                                                    <span className="text-sm">Entrega: {project.fechaEntrega}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-amber-700">
                                                    <FiDollarSign className="w-4 h-4" />
                                                    <span className="text-sm">Presupuesto: ${project.presupuesto}</span>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm text-amber-700 mb-1">
                                                        <span>Progreso</span>
                                                        <span>{project.progreso}%</span>
                                                    </div>
                                                    <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${project.progreso}%` }}
                                                            className="h-full bg-amber-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Notificaciones y Mensajes */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl"
                        >
                            <h2 className="text-2xl font-bold text-amber-900 mb-6">Notificaciones</h2>
                            <div className="space-y-4">
                                {notifications.map((notification) => (
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
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
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
