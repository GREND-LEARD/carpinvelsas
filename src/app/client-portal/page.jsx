'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiPackage, FiClock, FiDollarSign, FiMessageSquare, FiCalendar, FiPlus, FiTool, FiFileText, FiEye, FiCheck, FiX, FiClipboard, FiGrid, FiList, FiFilter } from 'react-icons/fi';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Link from 'next/link';
import BackToHome from '@/components/navigation/BackToHome';
import { supabase } from '@/app/lib/supabaseClient';
import { getAuthToken, authenticatedFetch } from '../utils/authUtils';

// Datos de demostración para presupuestos del cliente
const PRESUPUESTOS_DEMO = [
    {
        id: 101,
        nombre: "Mesa de comedor rústica",
        categoria: "mesa",
        material: "roble",
        acabado: "envejecido",
        unidades: 1,
        dimensiones: { ancho: 180, alto: 75, profundidad: 90 },
        total: 1800,
        estado: "pendiente",
        fecha: "15 mar 2023",
        dias_transcurridos: 3,
        tiempo_estimado: "4-6 semanas",
        imagenes: ["/productos/mesa-comedor.jpg"]
    },
    {
        id: 102,
        nombre: "Sillas a juego",
        categoria: "silla",
        material: "roble",
        acabado: "envejecido",
        unidades: 6,
        dimensiones: { ancho: 45, alto: 95, profundidad: 45 },
        total: 1200,
        estado: "en_proceso",
        fecha: "10 mar 2023",
        dias_transcurridos: 8,
        tiempo_estimado: "3-4 semanas",
        imagenes: ["/productos/silla.jpg"]
    },
    {
        id: 103,
        nombre: "Estantería para libros",
        categoria: "estanteria",
        material: "pino",
        acabado: "natural",
        unidades: 1,
        dimensiones: { ancho: 120, alto: 180, profundidad: 35 },
        total: 650,
        estado: "aceptado",
        fecha: "1 mar 2023",
        dias_transcurridos: 17,
        tiempo_estimado: "2 semanas",
        imagenes: ["/productos/estanteria.jpg"]
    },
    {
        id: 104,
        nombre: "Cama matrimonial",
        categoria: "cama",
        material: "nogal",
        acabado: "barnizado",
        unidades: 1,
        dimensiones: { ancho: 160, alto: 45, profundidad: 200 },
        total: 1500,
        estado: "completado",
        fecha: "15 feb 2023",
        dias_transcurridos: 30,
        tiempo_estimado: "3 semanas",
        imagenes: ["/productos/cama.jpg"]
    }
];

function ClientPortal() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeSection = searchParams.get('section') || 'dashboard';
    
    const [projects, setProjects] = useState([]);
    const [presupuestos, setPresupuestos] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [vistaPresupuestos, setVistaPresupuestos] = useState('grid');
    const [filtroPresupuestos, setFiltroPresupuestos] = useState('todos');
    const [usandoDatosDemo, setUsandoDatosDemo] = useState(false);
    const [diagnosticoVisible, setDiagnosticoVisible] = useState(false);
    const [diagnosticoData, setDiagnosticoData] = useState(null);
    const [diagnosticoCargando, setDiagnosticoCargando] = useState(false);
    
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
            // Usar la utilidad para realizar la solicitud autenticada
            const { data, error, status } = await authenticatedFetch('/api/client/solicitar-proyecto', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            
            if (error) {
                console.error(`Error (${status}):`, error.message);
                // Aquí podrías mostrar un mensaje de error al usuario
                return;
            }
            
            // Solicitud exitosa
            console.log('Proyecto solicitado exitosamente:', data);
            setShowForm(false);
            setFormData({
                titulo: '',
                descripcion: '',
                presupuestoEstimado: '',
                fechaDeseada: ''
            });
            
            // Opcionalmente mostrar un mensaje de éxito aquí
            
        } catch (error) {
            console.error('Error general al enviar solicitud:', error);
            // Mostrar mensaje de error al usuario
        }
    };

    // Función para diagnosticar la conexión con Supabase
    const diagnosticarConexion = async () => {
        setDiagnosticoCargando(true);
        setDiagnosticoData(null);
        
        try {
            console.log('Iniciando diagnóstico de conexión con Supabase');
            
            // Usar la utilidad para realizar la solicitud autenticada
            const { data, error, response, status } = await authenticatedFetch('/api/debug/supabase');
            
            if (error) {
                console.error(`Error de diagnóstico (${status}):`, error.message);
                throw new Error(`Error al contactar el servidor: ${error.message}`);
            }
            
            // Procesar la respuesta exitosa
            console.log('Diagnóstico completado exitosamente');
            setDiagnosticoData(data);
            setDiagnosticoVisible(true);
            
        } catch (error) {
            console.error('Error durante el diagnóstico:', error);
            setDiagnosticoData({
                error: true,
                message: error.message || 'Error al realizar el diagnóstico'
            });
            setDiagnosticoVisible(true);
        } finally {
            setDiagnosticoCargando(false);
        }
    };

    useEffect(() => {
        const fetchClientData = async () => {
            setLoading(true);
            
            try {
                // Obtener proyectos del cliente usando la utilidad authenticatedFetch
                console.log('Solicitando proyectos del cliente...');
                const { data: projectsData, error: projectsError } = await authenticatedFetch('/api/client/projects');
                
                if (projectsError) {
                    console.warn('Error al obtener proyectos:', projectsError.message);
                    setProjects([]);
                } else {
                    console.log('Proyectos obtenidos:', projectsData?.length || 0);
                    setProjects(Array.isArray(projectsData) ? projectsData : []);
                }
                
                // Obtener notificaciones usando la utilidad authenticatedFetch
                console.log('Solicitando notificaciones...');
                const { data: notificationsData, error: notificationsError } = await authenticatedFetch('/api/client/notifications');
                
                if (notificationsError) {
                    console.warn('Error al obtener notificaciones:', notificationsError.message);
                    setNotifications([]);
                } else {
                    console.log('Notificaciones obtenidas:', notificationsData?.length || 0);
                    setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
                }
                
                // Obtener presupuestos si estamos en esa sección
                if (activeSection === 'presupuestos' || activeSection === 'dashboard') {
                    console.log('Solicitando presupuestos del usuario...');
                    
                    const { data: presupuestosData, error: presupuestosError, status } = 
                        await authenticatedFetch('/api/presupuestos/usuario');
                    
                    if (presupuestosError || !presupuestosData) {
                        console.warn(`Error al obtener presupuestos:`, presupuestosError?.message || 'Respuesta sin datos');
                        
                        // Usar datos de demostración
                        setUsandoDatosDemo(true);
                        const datosFiltrados = filtroPresupuestos !== 'todos' 
                            ? PRESUPUESTOS_DEMO.filter(p => p.estado === filtroPresupuestos)
                            : PRESUPUESTOS_DEMO;
                        setPresupuestos(datosFiltrados);
                    } else if (presupuestosData.tabla_no_existe) {
                        // Error específico de tabla no existente
                        console.log('Usando datos de demostración: tabla no existe');
                        setUsandoDatosDemo(true);
                        
                        // Filtrar los datos de demostración si es necesario
                        const datosFiltrados = filtroPresupuestos !== 'todos' 
                            ? PRESUPUESTOS_DEMO.filter(p => p.estado === filtroPresupuestos)
                            : PRESUPUESTOS_DEMO;
                        
                        setPresupuestos(datosFiltrados);
                    } else {
                        // Respuesta normal con datos reales
                        console.log(`Datos obtenidos: ${presupuestosData.presupuestos?.length || 0} presupuestos`);
                        setUsandoDatosDemo(false);
                        setPresupuestos(
                            Array.isArray(presupuestosData.presupuestos) 
                                ? presupuestosData.presupuestos 
                                : []
                        );
                    }
                }
            } catch (error) {
                console.error('Error fetching client data:', error);
                setProjects([]);
                setNotifications([]);
                
                // Usar datos de demostración para presupuestos si estamos en esa sección
                if (activeSection === 'presupuestos' || activeSection === 'dashboard') {
                    console.log('Usando datos de demostración por error general');
                    setUsandoDatosDemo(true);
                    setPresupuestos(PRESUPUESTOS_DEMO);
                } else {
                    setPresupuestos([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchClientData();
    }, [activeSection]);

    // Efecto para actualizar los presupuestos cuando cambia el filtro en modo demo
    useEffect(() => {
        // Si estamos usando datos de demostración, actualizar los presupuestos filtrados
        if (usandoDatosDemo) {
            if (filtroPresupuestos === 'todos') {
                setPresupuestos(PRESUPUESTOS_DEMO);
            } else {
                const datosFiltrados = PRESUPUESTOS_DEMO.filter(p => p.estado === filtroPresupuestos);
                setPresupuestos(datosFiltrados);
            }
        }
    }, [filtroPresupuestos, usandoDatosDemo]);

    // Filtrar presupuestos por estado
    const filtrarPresupuestos = (presupuestos) => {
        // Si estamos en modo demo y cambia el filtro, actualizar los datos de demo filtrados
        if (usandoDatosDemo && filtroPresupuestos !== 'todos') {
            const demoFiltrados = PRESUPUESTOS_DEMO.filter(p => p.estado === filtroPresupuestos);
            return demoFiltrados;
        } else if (usandoDatosDemo) {
            return PRESUPUESTOS_DEMO;
        }
        
        // Comportamiento normal para datos reales
        if (filtroPresupuestos === 'todos') {
            return presupuestos;
        }
        return presupuestos.filter(presupuesto => presupuesto.estado === filtroPresupuestos);
    };

    const stats = [
        { title: "Proyectos Activos", value: projects.length, icon: <FiTool />, color: "bg-amber-500", link: "?section=proyectos" },
        { title: "Próxima Entrega", value: "15 MAR", icon: <FiCalendar />, color: "bg-emerald-500", link: "?section=calendario" },
        { title: "Mensajes", value: notifications.length, icon: <FiMessageSquare />, color: "bg-blue-500", link: "?section=mensajes" },
        { title: "Presupuestos", value: presupuestos.length, icon: <FiFileText />, color: "bg-purple-500", link: "?section=presupuestos" },
    ];

    // Obtener los presupuestos pendientes para mostrar en el dashboard
    const presupuestosPendientes = presupuestos.filter(p => p.estado === 'pendiente');

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-50">
                <div className="text-amber-900">Cargando datos...</div>
            </div>
        );
    }

    // Renderizar contenido según la sección activa
    const renderContent = () => {
        switch (activeSection) {
            case 'presupuestos':
    return (
                    <div className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-amber-900">Mis Presupuestos</h2>
                            
                            <div className="flex items-center gap-4">
                                {/* Filtros */}
                                <div className="flex items-center bg-white rounded-lg shadow-sm">
                                    <select 
                                        value={filtroPresupuestos}
                                        onChange={(e) => setFiltroPresupuestos(e.target.value)}
                                        className="p-2 border-none rounded-lg focus:ring-amber-500 text-amber-900"
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="pendiente">Pendientes</option>
                                        <option value="aprobado">Aprobados</option>
                                        <option value="rechazado">Rechazados</option>
                                        <option value="completado">Completados</option>
                                    </select>
                                    <div className="pr-2 text-amber-500">
                                        <FiFilter />
                                    </div>
                                </div>
                                
                                {/* Cambiar vista */}
                                <div className="flex bg-white rounded-lg shadow-sm">
                                    <button 
                                        onClick={() => setVistaPresupuestos('grid')}
                                        className={`p-2 ${vistaPresupuestos === 'grid' ? 'text-amber-500' : 'text-amber-900'}`}
                                    >
                                        <FiGrid size={20} />
                                    </button>
                                    <button 
                                        onClick={() => setVistaPresupuestos('list')}
                                        className={`p-2 ${vistaPresupuestos === 'list' ? 'text-amber-500' : 'text-amber-900'}`}
                                    >
                                        <FiList size={20} />
                                    </button>
                                </div>
                                
                                {/* Botón de nuevo presupuesto */}
                                <Link href="/presupuestos">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg"
                        >
                            <FiPlus />
                                        Nuevo Presupuesto
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                        
                        {presupuestos.length === 0 ? (
                            <div className="text-center py-10">
                                <FiClipboard className="mx-auto text-amber-300" size={50} />
                                <h3 className="mt-4 text-xl font-medium text-amber-800">No tienes presupuestos</h3>
                                <p className="mt-2 text-amber-600">Crea tu primer presupuesto personalizado</p>
                                <Link href="/presupuestos">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="mt-4 flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg mx-auto"
                                    >
                                        <FiPlus />
                                        Solicitar Presupuesto
                                    </motion.button>
                                </Link>
                            </div>
                        ) : vistaPresupuestos === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filtrarPresupuestos(presupuestos).map((presupuesto) => (
                                    <motion.div
                                        key={presupuesto.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white rounded-xl overflow-hidden shadow"
                                    >
                                        <div className="h-40 bg-amber-200 relative">
                                            {presupuesto.imagenes && presupuesto.imagenes.length > 0 ? (
                                                <img 
                                                    src={presupuesto.imagenes[0]} 
                                                    alt={presupuesto.nombre} 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-amber-100">
                                                    <FiFileText className="text-amber-500" size={40} />
                                                </div>
                                            )}
                                            
                                            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs ${
                                                presupuesto.estado === 'pendiente' ? 'bg-blue-100 text-blue-700' :
                                                presupuesto.estado === 'aprobado' ? 'bg-green-100 text-green-700' :
                                                presupuesto.estado === 'rechazado' ? 'bg-red-100 text-red-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {presupuesto.estado.charAt(0).toUpperCase() + presupuesto.estado.slice(1)}
                                            </div>
                                        </div>
                                        
                                        <div className="p-4">
                                            <h3 className="font-bold text-amber-900 text-lg mb-1">{presupuesto.nombre}</h3>
                                            <p className="text-sm text-amber-600 mb-3">{presupuesto.categoria} - {presupuesto.material}</p>
                                            
                                            <div className="flex items-center gap-2 text-amber-700 mb-2">
                                                <FiDollarSign className="w-4 h-4" />
                                                <span className="text-sm font-medium">${presupuesto.total.toFixed(2)}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-amber-700 mb-4">
                                                <FiClock className="w-4 h-4" />
                                                <span className="text-sm">{presupuesto.tiempo_estimado}</span>
                                            </div>
                                            
                                            <div className="flex justify-between">
                                                <span className="text-xs text-amber-500">{presupuesto.fecha}</span>
                                                <Link href={`/presupuestos/${presupuesto.id}`}>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="text-sm font-medium text-amber-500 hover:text-amber-700"
                                                    >
                                                        Ver detalles
                                                    </motion.button>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl overflow-hidden shadow">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-amber-100">
                                            <tr>
                                                <th className="py-3 px-4 text-left text-amber-900">Proyecto</th>
                                                <th className="py-3 px-4 text-left text-amber-900">Material</th>
                                                <th className="py-3 px-4 text-left text-amber-900">Fecha</th>
                                                <th className="py-3 px-4 text-left text-amber-900">Precio</th>
                                                <th className="py-3 px-4 text-left text-amber-900">Estado</th>
                                                <th className="py-3 px-4 text-left text-amber-900">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtrarPresupuestos(presupuestos).map((presupuesto, index) => (
                                                <tr key={presupuesto.id} className={index % 2 === 0 ? 'bg-amber-50' : 'bg-white'}>
                                                    <td className="py-3 px-4 text-amber-900">{presupuesto.nombre}</td>
                                                    <td className="py-3 px-4 text-amber-700">{presupuesto.material}</td>
                                                    <td className="py-3 px-4 text-amber-700">{presupuesto.fecha}</td>
                                                    <td className="py-3 px-4 text-amber-700">${presupuesto.total.toFixed(2)}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            presupuesto.estado === 'pendiente' ? 'bg-blue-100 text-blue-700' :
                                                            presupuesto.estado === 'aprobado' ? 'bg-green-100 text-green-700' :
                                                            presupuesto.estado === 'rechazado' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {presupuesto.estado.charAt(0).toUpperCase() + presupuesto.estado.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Link href={`/presupuestos/${presupuesto.id}`}>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="text-amber-500 hover:text-amber-700"
                                                            >
                                                                <FiEye size={20} />
                        </motion.button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                );
                
            case 'dashboard':
            default:
                return (
                    <>
                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                                <Link href={stat.link} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                        className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl h-full hover:shadow-2xl transition-shadow"
                            >
                                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                                    {stat.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-amber-900">{stat.value}</h3>
                                <p className="text-amber-600">{stat.title}</p>
                            </motion.div>
                                </Link>
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
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-amber-900">Proyectos Activos</h2>
                                        <Link href="?section=proyectos">
                                            <span className="text-amber-600 hover:text-amber-800 text-sm">Ver todos</span>
                                        </Link>
                                    </div>
                                    
                                <div className="space-y-4">
                                        {projects.length === 0 ? (
                                            <p className="text-amber-700 text-center py-4">No tienes proyectos activos</p>
                                        ) : (
                                            projects.slice(0, 3).map((project) => (
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
                                            ))
                                        )}
                                </div>
                            </motion.div>
                        </div>

                            {/* Notificaciones y Presupuestos Recientes */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                {/* Presupuestos Pendientes */}
                                <div className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-amber-900">Presupuestos</h2>
                                        <Link href="?section=presupuestos">
                                            <span className="text-amber-600 hover:text-amber-800 text-sm">Ver todos</span>
                                        </Link>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {presupuestosPendientes.length === 0 ? (
                                            <div className="text-center py-4">
                                                <p className="text-amber-700">No tienes presupuestos pendientes</p>
                                                <Link href="/presupuestos">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="mt-4 text-sm bg-amber-500 text-white px-4 py-2 rounded-lg"
                                                    >
                                                        Solicitar Presupuesto
                                                    </motion.button>
                                                </Link>
                                            </div>
                                        ) : (
                                            presupuestosPendientes.slice(0, 3).map((presupuesto) => (
                                                <motion.div
                                                    key={presupuesto.id}
                                                    whileHover={{ x: 5 }}
                                                    className="bg-white p-4 rounded-lg shadow-sm"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-bold text-amber-900">{presupuesto.nombre}</h3>
                                                            <p className="text-sm text-amber-600">{presupuesto.fecha}</p>
                                                        </div>
                                                        <span className="text-amber-700 font-medium">${presupuesto.total.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex gap-2 mt-3">
                                                        <Link href={`/presupuestos/${presupuesto.id}`}>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded-lg"
                                                            >
                                                                Ver detalles
                                                            </motion.button>
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                
                                {/* Notificaciones */}
                                <div className="bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-amber-900">Notificaciones</h2>
                                        <Link href="?section=mensajes">
                                            <span className="text-amber-600 hover:text-amber-800 text-sm">Ver todas</span>
                                        </Link>
                                    </div>
                                    
                            <div className="space-y-4">
                                        {notifications.length === 0 ? (
                                            <p className="text-amber-700 text-center py-4">No tienes notificaciones</p>
                                        ) : (
                                            notifications.slice(0, 3).map((notification) => (
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
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen pt-16 bg-[url('/textura-madera.jpg')] bg-cover bg-fixed">
            <div className="min-h-screen backdrop-blur-xl bg-amber-900/30 py-16 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Navegación */}
                    <BackToHome showBack={false} theme="dark" className="z-50" />
                    
                    {/* Alerta de modo demostración */}
                    {usandoDatosDemo && (
                        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-sm mb-6" role="alert">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <svg className="h-6 w-6 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-bold">Información importante</p>
                                        <p className="text-sm">Estás viendo datos de ejemplo porque hay un problema con la conexión a la base de datos. Tus presupuestos reales estarán disponibles cuando se solucione el problema.</p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={diagnosticarConexion}
                                    disabled={diagnosticoCargando}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                    {diagnosticoCargando ? 'Diagnosticando...' : 'Diagnosticar'}
                                </motion.button>
                            </div>
                        </div>
                    )}
                    
                    {/* Modal de diagnóstico */}
                    {diagnosticoVisible && diagnosticoData && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-auto"
                            >
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-gray-800">Diagnóstico de Conexión</h3>
                                        <button 
                                            onClick={() => setDiagnosticoVisible(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    {diagnosticoData.error ? (
                                        <div className="bg-red-100 p-4 rounded text-red-700">
                                            <p className="font-bold">Error en el diagnóstico</p>
                                            <p>{diagnosticoData.message}</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Información de conexión */}
                                            <div className="bg-green-100 p-4 rounded">
                                                <h4 className="font-bold text-green-800">Conexión a Supabase</h4>
                                                <p className="text-green-700">URL: {diagnosticoData.conexion?.url}</p>
                                                <p className="text-green-700">Estado: {diagnosticoData.conexion?.estado}</p>
                                            </div>
                                            
                                            {/* Información de usuario */}
                                            <div className="bg-blue-50 p-4 rounded">
                                                <h4 className="font-bold text-blue-800">Usuario</h4>
                                                <p className="text-blue-700">ID: {diagnosticoData.usuario?.id}</p>
                                                <p className="text-blue-700">Nombre: {diagnosticoData.usuario?.nombre}</p>
                                                <p className="text-blue-700">Email: {diagnosticoData.usuario?.email}</p>
                                                <p className="text-blue-700">Rol: {diagnosticoData.usuario?.rol}</p>
                                            </div>
                                            
                                            {/* Información de tablas */}
                                            <div className="bg-amber-50 p-4 rounded">
                                                <h4 className="font-bold text-amber-800">Tablas disponibles</h4>
                                                {Array.isArray(diagnosticoData.tablas?.disponibles) ? (
                                                    <ul className="list-disc pl-5 text-amber-700">
                                                        {diagnosticoData.tablas.disponibles.map((tabla, index) => (
                                                            <li key={index}>{tabla}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-red-600">{diagnosticoData.tablas?.disponibles || 'No se pudieron listar las tablas'}</p>
                                                )}
                                                {diagnosticoData.tablas?.error && (
                                                    <p className="text-red-600 mt-2">Error: {diagnosticoData.tablas.error}</p>
                                                )}
                                            </div>
                                            
                                            {/* Información de presupuestos */}
                                            <div className={`p-4 rounded ${diagnosticoData.presupuestos?.tablaExiste ? 'bg-green-50' : 'bg-red-50'}`}>
                                                <h4 className={`font-bold ${diagnosticoData.presupuestos?.tablaExiste ? 'text-green-800' : 'text-red-800'}`}>
                                                    Tabla de presupuestos
                                                </h4>
                                                <p className={diagnosticoData.presupuestos?.tablaExiste ? 'text-green-700' : 'text-red-700'}>
                                                    {diagnosticoData.presupuestos?.tablaExiste ? 'La tabla existe y es accesible' : 'Problema con la tabla de presupuestos'}
                                                </p>
                                                {diagnosticoData.presupuestos?.error && (
                                                    <p className="text-red-600 mt-2">Error: {diagnosticoData.presupuestos.error}</p>
                                                )}
                                            </div>
                                            
                                            {/* Presupuestos del usuario */}
                                            <div className="bg-purple-50 p-4 rounded">
                                                <h4 className="font-bold text-purple-800">Presupuestos del usuario</h4>
                                                <p className="text-purple-700">Cantidad: {diagnosticoData.presupuestosUsuario?.count || 0}</p>
                                                
                                                {diagnosticoData.presupuestosUsuario?.error ? (
                                                    <p className="text-red-600 mt-2">Error: {diagnosticoData.presupuestosUsuario.error}</p>
                                                ) : diagnosticoData.presupuestosUsuario?.count > 0 ? (
                                                    <div className="mt-2 overflow-x-auto">
                                                        <table className="min-w-full bg-white">
                                                            <thead>
                                                                <tr>
                                                                    <th className="py-2 px-4 border-b">ID</th>
                                                                    <th className="py-2 px-4 border-b">Nombre</th>
                                                                    <th className="py-2 px-4 border-b">Estado</th>
                                                                    <th className="py-2 px-4 border-b">Fecha</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {diagnosticoData.presupuestosUsuario.data.map(p => (
                                                                    <tr key={p.id}>
                                                                        <td className="py-2 px-4 border-b">{p.id}</td>
                                                                        <td className="py-2 px-4 border-b">{p.nombre}</td>
                                                                        <td className="py-2 px-4 border-b">{p.estado}</td>
                                                                        <td className="py-2 px-4 border-b">{new Date(p.fecha_creacion).toLocaleDateString()}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-600 mt-2">No se encontraron presupuestos para este usuario</p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                
                                <div className="p-6 border-t border-gray-200 flex justify-end">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setDiagnosticoVisible(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                                    >
                                        Cerrar
                                    </motion.button>
                            </div>
                        </motion.div>
                        </div>
                    )}
                    
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-50"></div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Encabezado */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-amber-50/90 backdrop-blur-sm rounded-xl p-6 shadow-xl"
                            >
                                <div className="flex justify-between items-center">
                                    <h1 className="text-4xl font-bold text-amber-50">
                                        {activeSection === 'dashboard' 
                                            ? `Bienvenido, ${user?.nombre}` 
                                            : activeSection === 'presupuestos'
                                                ? 'Mis Presupuestos'
                                                : activeSection === 'proyectos'
                                                    ? 'Mis Proyectos'
                                                    : activeSection === 'mensajes'
                                                        ? 'Mensajes'
                                                        : activeSection === 'calendario'
                                                            ? 'Calendario'
                                                            : `Panel de ${user?.nombre}`
                                        }
                                    </h1>
                                    
                                    {activeSection === 'dashboard' && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowForm(true)}
                                            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            <FiPlus />
                                            Solicitar Proyecto
                                        </motion.button>
                                    )}
                                    
                                    {activeSection === 'presupuestos' && (
                                        <Link href="/presupuestos">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg"
                                            >
                                                <FiPlus />
                                                Nuevo Presupuesto
                                            </motion.button>
                                        </Link>
                                    )}
                    </div>
                </motion.div>
                            
                            {/* Menú de navegación del portal */}
                            <div className="mb-8 bg-amber-800/80 backdrop-blur-sm rounded-xl overflow-hidden">
                                <div className="flex flex-wrap">
                                    <Link 
                                        href="?section=dashboard"
                                        className={`px-6 py-3 text-amber-50 transition-colors ${activeSection === 'dashboard' ? 'bg-amber-700 font-medium' : 'hover:bg-amber-700/50'}`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link 
                                        href="?section=presupuestos"
                                        className={`px-6 py-3 text-amber-50 transition-colors ${activeSection === 'presupuestos' ? 'bg-amber-700 font-medium' : 'hover:bg-amber-700/50'}`}
                                    >
                                        Presupuestos
                                    </Link>
                                    <Link 
                                        href="?section=proyectos"
                                        className={`px-6 py-3 text-amber-50 transition-colors ${activeSection === 'proyectos' ? 'bg-amber-700 font-medium' : 'hover:bg-amber-700/50'}`}
                                    >
                                        Proyectos
                                    </Link>
                                    <Link 
                                        href="?section=mensajes"
                                        className={`px-6 py-3 text-amber-50 transition-colors ${activeSection === 'mensajes' ? 'bg-amber-700 font-medium' : 'hover:bg-amber-700/50'}`}
                                    >
                                        Mensajes
                                    </Link>
                                    <Link 
                                        href="?section=calendario"
                                        className={`px-6 py-3 text-amber-50 transition-colors ${activeSection === 'calendario' ? 'bg-amber-700 font-medium' : 'hover:bg-amber-700/50'}`}
                                    >
                                        Calendario
                                    </Link>
                                </div>
                            </div>
                            
                            {/* Contenido principal según la sección activa */}
                            {renderContent()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ClientPortalPage() {
    return (
        <ProtectedRoute allowedRoles={['client', 'usuario']}>
            <ClientPortal />
        </ProtectedRoute>
    );
}
