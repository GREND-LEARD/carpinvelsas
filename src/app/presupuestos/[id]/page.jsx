'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiDollarSign, FiInfo, FiClock, FiCheck, FiTool, FiCheckCircle, FiAlertCircle, FiXCircle, FiMessageSquare, FiPackage, FiImage } from 'react-icons/fi';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import BackToHome from '@/components/navigation/BackToHome';
import { authenticatedFetch } from '@/app/utils/authUtils';

// Mapeo de estados a colores y descripciones
const ESTADOS = {
    'pendiente': {
        color: 'blue',
        icon: FiInfo,
        titulo: 'Pendiente de revisión',
        descripcion: 'Tu presupuesto está siendo revisado por nuestro equipo de carpintería.'
    },
    'aprobado': {
        color: 'green',
        icon: FiCheck,
        titulo: 'Presupuesto aprobado',
        descripcion: 'Hemos aprobado tu presupuesto y estamos listos para comenzar.'
    },
    'en_proceso': {
        color: 'amber',
        icon: FiTool,
        titulo: 'En proceso de fabricación',
        descripcion: 'Estamos trabajando en tu proyecto en nuestro taller.'
    },
    'completado': {
        color: 'emerald',
        icon: FiCheckCircle,
        titulo: '¡Proyecto completado!',
        descripcion: 'Tu proyecto ha sido finalizado con éxito y está listo para entrega.'
    },
    'rechazado': {
        color: 'red',
        icon: FiXCircle,
        titulo: 'Presupuesto rechazado',
        descripcion: 'Lo sentimos, no podemos proceder con este presupuesto en los términos actuales.'
    }
};

export default function PresupuestoDetalle() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    
    const [presupuesto, setPresupuesto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [etapas, setEtapas] = useState([]);
    
    // Cargar datos del presupuesto
    useEffect(() => {
        const fetchPresupuesto = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Obtener el ID del presupuesto
                const presupuestoId = params.id;
                if (!presupuestoId) {
                    throw new Error('ID de presupuesto no especificado');
                }
                
                // Utilizar la función authenticatedFetch para obtener los datos del presupuesto
                const { data, error } = await authenticatedFetch(`/api/presupuestos/detalle?id=${presupuestoId}`);
                
                if (error) {
                    throw new Error(`Error al obtener el presupuesto: ${error.message}`);
                }
                
                // Verificar si se obtuvo el presupuesto
                if (!data || !data.presupuesto) {
                    // Si no hay datos, intentar usar datos de ejemplo para demo
                    console.log('Usando datos de demostración para el presupuesto');
                    const demoPresupuesto = generarPresupuestoDemo(presupuestoId);
                    setPresupuesto(demoPresupuesto);
                    // Generar etapas basadas en el estado
                    setEtapas(generarEtapas(demoPresupuesto.estado));
                } else {
                    // Usar datos reales
                    setPresupuesto(data.presupuesto);
                    // Generar etapas basadas en el estado
                    setEtapas(generarEtapas(data.presupuesto.estado));
                }
            } catch (error) {
                console.error('Error al cargar presupuesto:', error);
                setError('No se pudo cargar la información del presupuesto. ' + error.message);
                // Intentar usar datos de ejemplo como respaldo
                const demoPresupuesto = generarPresupuestoDemo(params.id);
                setPresupuesto(demoPresupuesto);
                setEtapas(generarEtapas(demoPresupuesto.estado));
            } finally {
                setLoading(false);
            }
        };
        
        if (isAuthenticated) {
            fetchPresupuesto();
        } else {
            // Redirigir a login si no está autenticado
            router.push('/login?redirect=' + encodeURIComponent(`/presupuestos/${params.id}`));
        }
    }, [params.id, isAuthenticated]);
    
    // Generar etapas basadas en el estado actual
    const generarEtapas = (estado) => {
        const todasEtapas = [
            { id: 'pendiente', titulo: 'Solicitud recibida', descripcion: 'Hemos recibido tu solicitud de presupuesto' },
            { id: 'aprobado', titulo: 'Presupuesto aprobado', descripcion: 'El presupuesto ha sido revisado y aprobado' },
            { id: 'en_proceso', titulo: 'En fabricación', descripcion: 'Tu proyecto está siendo fabricado en nuestro taller' },
            { id: 'completado', titulo: 'Proyecto completado', descripcion: 'El proyecto ha sido finalizado y está listo' }
        ];
        
        const estadosOrden = ['pendiente', 'aprobado', 'en_proceso', 'completado'];
        
        // Si el estado es 'rechazado', mostrar solo la primera etapa y la de rechazo
        if (estado === 'rechazado') {
            return [
                { ...todasEtapas[0], completado: true },
                { id: 'rechazado', titulo: 'Presupuesto rechazado', descripcion: 'El presupuesto ha sido rechazado', completado: true }
            ];
        }
        
        // Para otros estados, marcar como completadas las etapas hasta el estado actual
        const estadoIndex = estadosOrden.indexOf(estado);
        return todasEtapas.map((etapa, index) => ({
            ...etapa,
            completado: index <= estadoIndex
        }));
    };
    
    // Generar presupuesto de demostración
    const generarPresupuestoDemo = (id) => {
        return {
            id: id,
            nombre: "Mesa de comedor rústica",
            categoria: "mesa",
            descripcion: "Mesa de comedor con acabado rústico y detalles tallados en las patas",
            material: "roble",
            acabado: "envejecido",
            dimensiones: { ancho: 180, alto: 75, profundidad: 90 },
            unidades: 1,
            comentarios: "Me gustaría que tuviera detalles tallados en las patas",
            presupuesto: {
                subtotal: 1800,
                descuento: 90,
                total: 1710,
                tiempo_estimado: "4-6 semanas"
            },
            estado: "completado",
            fecha_creacion: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            fecha_actualizacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            imagenes: ["/productos/mesa-comedor.jpg", "/productos/mesa-comedor-2.jpg"],
            mensajes: [
                {
                    fecha: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
                    texto: "Hemos recibido tu solicitud y la estamos revisando.",
                    emisor: "admin"
                },
                {
                    fecha: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
                    texto: "Tu presupuesto ha sido aprobado. Comenzaremos con la fabricación en cuanto confirmes.",
                    emisor: "admin"
                },
                {
                    fecha: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                    texto: "Hemos comenzado la fabricación de tu mesa. Te mantendremos informado del progreso.",
                    emisor: "admin"
                },
                {
                    fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    texto: "Tu mesa está casi lista. Estamos aplicando el acabado final.",
                    emisor: "admin"
                },
                {
                    fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    texto: "¡Tu proyecto está completo! Puedes pasar a recogerlo o coordinar la entrega.",
                    emisor: "admin"
                }
            ],
            progreso: {
                porcentaje: 100,
                etapa_actual: "Proyecto completado",
                siguiente_actualizacion: "N/A - Proyecto terminado"
            }
        };
    };
    
    // Si está cargando, mostrar spinner
    if (loading) {
        return (
            <div className="min-h-screen bg-amber-50 p-4 md:p-8">
                <BackToHome theme="dark" />
                <div className="max-w-4xl mx-auto mt-8 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-t-4 border-amber-600 border-solid rounded-full animate-spin"></div>
                    <p className="mt-4 text-amber-800">Cargando detalles del presupuesto...</p>
                </div>
            </div>
        );
    }
    
    // Si hay error y no hay datos de respaldo
    if (error && !presupuesto) {
        return (
            <div className="min-h-screen bg-amber-50 p-4 md:p-8">
                <BackToHome theme="dark" />
                <div className="max-w-4xl mx-auto mt-8">
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                        <h2 className="text-lg font-bold mb-2">Error</h2>
                        <p>{error}</p>
                        <button 
                            onClick={() => router.push('/client-portal?section=presupuestos')}
                            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                        >
                            Volver a mis presupuestos
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Si no hay presupuesto (no debería ocurrir)
    if (!presupuesto) {
        return (
            <div className="min-h-screen bg-amber-50 p-4 md:p-8">
                <BackToHome theme="dark" />
                <div className="max-w-4xl mx-auto mt-8">
                    <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded">
                        <h2 className="text-lg font-bold mb-2">Presupuesto no encontrado</h2>
                        <p>No se pudo encontrar la información de este presupuesto.</p>
                        <button 
                            onClick={() => router.push('/client-portal?section=presupuestos')}
                            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                        >
                            Volver a mis presupuestos
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Obtener información del estado
    const estadoInfo = ESTADOS[presupuesto.estado] || ESTADOS.pendiente;
    const EstadoIcono = estadoInfo.icon;
    
    return (
        <div className="min-h-screen bg-amber-50 p-4 md:p-8">
            <BackToHome theme="dark" />
            
            <div className="max-w-4xl mx-auto mt-8">
                {/* Cabecera con estado y botones de acción */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className={`bg-${estadoInfo.color}-600 px-6 py-4 text-white flex justify-between items-center`}>
                        <div className="flex items-center">
                            <EstadoIcono className="w-6 h-6 mr-2" />
                            <h1 className="text-xl font-bold">{estadoInfo.titulo}</h1>
                        </div>
                        <button 
                            onClick={() => router.push('/client-portal?section=presupuestos')}
                            className="text-white bg-white/20 px-4 py-2 rounded hover:bg-white/30 transition-colors flex items-center"
                        >
                            <FiArrowLeft className="mr-2" />
                            Volver
                        </button>
                    </div>
                    
                    <div className="p-6">
                        <p className="text-gray-600 mb-4">{estadoInfo.descripcion}</p>
                        
                        {/* Información básica */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 mb-2">{presupuesto.nombre}</h2>
                                <p className="text-gray-600">{presupuesto.descripcion}</p>
                                <div className="mt-2">
                                    <span className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full mr-2">
                                        {presupuesto.categoria}
                                    </span>
                                    <span className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                                        {presupuesto.material} • {presupuesto.acabado}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="bg-amber-50 rounded-lg p-4">
                                    <h3 className="font-bold text-amber-800 mb-2">Detalles del presupuesto</h3>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium">${presupuesto.presupuesto.subtotal.toFixed(2)}</span>
                                    </div>
                                    {presupuesto.presupuesto.descuento > 0 && (
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">Descuento:</span>
                                            <span className="font-medium text-green-600">-${presupuesto.presupuesto.descuento.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between border-t border-amber-200 pt-2 mt-2">
                                        <span className="text-gray-800 font-bold">Total:</span>
                                        <span className="font-bold text-amber-800">${presupuesto.presupuesto.total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-gray-600">
                                    <FiClock className="mr-2" />
                                    <span>Tiempo estimado: {presupuesto.presupuesto.tiempo_estimado}</span>
                                </div>
                                <div className="mt-2 flex items-center text-gray-600">
                                    <FiCalendar className="mr-2" />
                                    <span>Solicitado el: {new Date(presupuesto.fecha_creacion).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Dimensiones y especificaciones */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="px-6 py-4 bg-amber-100 border-b border-amber-200">
                        <h2 className="text-lg font-bold text-amber-800">Dimensiones y especificaciones</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-amber-50 p-4 rounded-lg">
                                <p className="text-sm text-amber-600 mb-1">Ancho</p>
                                <p className="text-xl font-bold text-amber-900">{presupuesto.dimensiones.ancho} cm</p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-lg">
                                <p className="text-sm text-amber-600 mb-1">Alto</p>
                                <p className="text-xl font-bold text-amber-900">{presupuesto.dimensiones.alto} cm</p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-lg">
                                <p className="text-sm text-amber-600 mb-1">Profundidad</p>
                                <p className="text-xl font-bold text-amber-900">{presupuesto.dimensiones.profundidad} cm</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="font-bold text-gray-700 mb-2">Especificaciones adicionales</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-start mb-3">
                                    <FiPackage className="mt-1 mr-2 text-amber-600" />
                                    <div>
                                        <p className="font-medium text-gray-700">Unidades</p>
                                        <p className="text-gray-600">{presupuesto.unidades}</p>
                                    </div>
                                </div>
                                {presupuesto.comentarios && (
                                    <div className="flex items-start">
                                        <FiMessageSquare className="mt-1 mr-2 text-amber-600" />
                                        <div>
                                            <p className="font-medium text-gray-700">Comentarios</p>
                                            <p className="text-gray-600">{presupuesto.comentarios}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Progreso del proyecto */}
                {presupuesto.estado !== 'rechazado' && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                        <div className="px-6 py-4 bg-amber-100 border-b border-amber-200">
                            <h2 className="text-lg font-bold text-amber-800">Progreso del proyecto</h2>
                        </div>
                        <div className="p-6">
                            {/* Barra de progreso */}
                            {presupuesto.progreso && (
                                <div className="mb-6">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Progreso actual:</span>
                                        <span className="text-sm font-medium text-amber-600">{presupuesto.progreso.porcentaje}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-amber-600 h-2.5 rounded-full"
                                            style={{ width: `${presupuesto.progreso.porcentaje}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        Etapa actual: {presupuesto.progreso.etapa_actual}
                                    </div>
                                </div>
                            )}

                            {/* Línea de tiempo del proceso */}
                            <div className="relative">
                                {etapas.map((etapa, index) => (
                                    <div key={etapa.id} className="mb-6 flex">
                                        <div className="flex flex-col items-center mr-4">
                                            <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
                                                etapa.completado ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-400'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            {index < etapas.length - 1 && (
                                                <div className={`w-0.5 h-full ${
                                                    etapa.completado && etapas[index + 1].completado
                                                        ? 'bg-amber-600' : 'bg-gray-200'
                                                }`}></div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`font-bold ${
                                                etapa.completado ? 'text-amber-800' : 'text-gray-500'
                                            }`}>{etapa.titulo}</h3>
                                            <p className={etapa.completado ? 'text-gray-600' : 'text-gray-400'}>
                                                {etapa.descripcion}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Imágenes del proyecto */}
                {presupuesto.imagenes && presupuesto.imagenes.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                        <div className="px-6 py-4 bg-amber-100 border-b border-amber-200">
                            <h2 className="text-lg font-bold text-amber-800">Imágenes de referencia</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {presupuesto.imagenes.map((img, index) => (
                                    <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-lg">
                                        <img 
                                            src={img} 
                                            alt={`Referencia ${index + 1}`} 
                                            className="w-full h-full object-cover transition-transform hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Historial de mensajes */}
                {presupuesto.mensajes && presupuesto.mensajes.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                        <div className="px-6 py-4 bg-amber-100 border-b border-amber-200">
                            <h2 className="text-lg font-bold text-amber-800">Comunicaciones</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {presupuesto.mensajes.map((mensaje, index) => (
                                    <div key={index} className={`p-4 rounded-lg ${
                                        mensaje.emisor === 'admin' ? 'bg-amber-50 border-l-4 border-amber-400' : 'bg-blue-50 border-l-4 border-blue-400'
                                    }`}>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium">{mensaje.emisor === 'admin' ? 'Carpintería' : 'Tú'}</span>
                                            <span className="text-sm text-gray-500">{new Date(mensaje.fecha).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-700">{mensaje.texto}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Botones de acción según estado */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-6">
                        <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                            <Link href="/client-portal?section=presupuestos">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Volver a presupuestos
                                </motion.button>
                            </Link>
                            
                            {presupuesto.estado === 'completado' && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Descargar factura
                                </motion.button>
                            )}
                            
                            {(presupuesto.estado === 'pendiente' || presupuesto.estado === 'aprobado') && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                                >
                                    Contactar al carpintero
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 