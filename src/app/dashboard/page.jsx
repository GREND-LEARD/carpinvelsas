'use client';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'framer-motion';
import { FiBox, FiSettings, FiUsers, FiDollarSign, FiCalendar, FiLogOut, FiTool, FiStar, FiFileText, FiGrid } from 'react-icons/fi';

const stats = [
    { id: 1, title: "Proyectos Activos", value: "12", icon: <FiTool className="w-6 h-6" />, color: "bg-amber-500" },
    { id: 2, title: "Clientes Nuevos", value: "5", icon: <FiUsers className="w-6 h-6" />, color: "bg-emerald-500" },
    { id: 3, title: "Ingresos Mensuales", value: "$25.4K", icon: <FiDollarSign className="w-6 h-6" />, color: "bg-blue-500" },
    { id: 4, title: "Calificación", value: "4.9/5", icon: <FiStar className="w-6 h-6" />, color: "bg-purple-500" },
];

const projects = [
    { id: 1, name: "Cocina Moderna", progress: 85, client: "Familia Rodríguez", deadline: "15 DIC" },
    { id: 2, name: "Biblioteca Clásica", progress: 60, client: "Dr. Martínez", deadline: "22 ENE" },
    { id: 3, name: "Mueble de Jardín", progress: 45, client: "Hotel Paraíso", deadline: "10 FEB" },
];

const notifications = [
    { id: 1, text: "Nuevo pedido de diseño personalizado", time: "2h ago", unread: true },
    { id: 2, text: "Aprobación de presupuesto pendiente", time: "5h ago", unread: false },
    { id: 3, text: "Recordatorio: Entrega proyecto #123", time: "1d ago", unread: true },
];

function Dashboard() {
    const { user, logout } = useAuth();

    const getInitials = () => {
        if (!user?.nombre) return '?';
        return user.nombre.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div className="min-h-screen bg-[url('/textura-madera.jpg')] bg-cover bg-fixed">
            <div className="min-h-screen backdrop-blur-xl bg-amber-900/30">
                {/* Sidebar con efecto vidrio esmerilado */}
                <motion.nav
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    transition={{ type: 'spring', stiffness: 120 }}
                    className="fixed h-screen w-80 bg-amber-50/95 backdrop-blur-lg shadow-2xl p-8 border-r border-amber-100"
                >
                    <div className="flex flex-col h-full">
                        {/* Perfil con animación de aparición */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-4 mb-12"
                        >
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                className="w-16 h-16 rounded-full bg-amber-900 flex items-center justify-center text-amber-50 cursor-pointer"
                            >
                                <span className="text-2xl font-bold">{getInitials()}</span>
                            </motion.div>
                            <div>
                                <h2 className="text-xl font-bold text-amber-900">{user?.nombre || 'Usuario'}</h2>
                                <p className="text-sm text-amber-600">{user?.rol || 'Maestro Principal'}</p>
                            </div>
                        </motion.div>

                        {/* Menú interactivo */}
                        <div className="space-y-4 flex-1">
                            {[
                                { icon: <FiGrid />, text: "Panel", count: 4 },
                                { icon: <FiTool />, text: "Proyectos", count: 12 },
                                { icon: <FiUsers />, text: "Clientes", count: 23 },
                                { icon: <FiFileText />, text: "Presupuestos", count: 8 },
                                { icon: <FiCalendar />, text: "Calendario" },
                                { icon: <FiSettings />, text: "Configuración" },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 10 }}
                                    className="flex items-center justify-between p-3 rounded-xl group hover:bg-amber-100 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-amber-700 text-xl">{item.icon}</span>
                                        <span className="text-amber-900">{item.text}</span>
                                    </div>
                                    {item.count && (
                                        <span className="bg-amber-700 text-amber-50 px-2 rounded-full text-sm">
                                            {item.count}
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Botón de logout con efecto muelle */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={logout}
                            className="mt-8 flex items-center gap-3 p-3 text-amber-50 bg-amber-700 rounded-xl hover:bg-amber-600 transition-colors"
                        >
                            <FiLogOut className="text-xl" />
                            Cerrar Sesión
                        </motion.button>
                    </div>
                </motion.nav>

                {/* Contenido principal */}
                <div className="ml-80 p-8">
                    {/* Encabezado con animación de texto */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h1 className="text-4xl font-bold text-amber-50 mb-2 font-serif">
                            Bienvenido al Taller Digital
                        </h1>
                        <p className="text-amber-200">Último acceso: Hoy a las {new Date().toLocaleTimeString()}</p>
                    </motion.div>

                    {/* Tarjetas de métricas con animación escalonada */}
                    <div className="grid grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-amber-50/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
                            >
                                <div className={`${stat.color} w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4`}>
                                    {stat.icon}
                                </div>
                                <h3 className="text-3xl font-bold text-amber-900 mb-2">{stat.value}</h3>
                                <p className="text-sm text-amber-600">{stat.title}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Sección de proyectos con barras de progreso animadas */}
                    <div className="grid grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-amber-50/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
                        >
                            <h2 className="text-2xl font-bold text-amber-900 mb-6">Proyectos Activos</h2>
                            <div className="space-y-6">
                                {projects.map((project) => (
                                    <motion.div
                                        key={project.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white p-6 rounded-xl shadow-lg"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <h3 className="font-bold text-amber-900">{project.name}</h3>
                                                <p className="text-sm text-amber-600">{project.client}</p>
                                            </div>
                                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm">
                                                {project.deadline}
                                            </span>
                                        </div>
                                        <div className="relative pt-2">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div>
                                                    <span className="text-xs font-semibold inline-block text-amber-700">
                                                        Progreso
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-semibold inline-block text-amber-700">
                                                        {project.progress}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="overflow-hidden h-2 bg-amber-100 rounded-full">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${project.progress}%` }}
                                                    transition={{ duration: 1 }}
                                                    className="h-full bg-amber-500 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Notificaciones con efecto de aparición */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-amber-50/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
                        >
                            <h2 className="text-2xl font-bold text-amber-900 mb-6">Notificaciones</h2>
                            <div className="space-y-4">
                                {notifications.map((notification) => (
                                    <motion.div
                                        key={notification.id}
                                        whileHover={{ x: 5 }}
                                        className={`p-4 rounded-xl ${notification.unread ? 'bg-amber-100 border-l-4 border-amber-500' : 'bg-white'}`}
                                    >
                                        <p className="text-amber-900">{notification.text}</p>
                                        <p className="text-sm text-amber-500 mt-2">{notification.time}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
        </ProtectedRoute>
    );
}