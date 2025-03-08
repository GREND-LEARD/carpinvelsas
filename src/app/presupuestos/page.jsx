'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { FiChevronDown, FiPlus, FiMinus, FiDollarSign, FiTool, FiInfo, FiFileText, FiUpload, FiXCircle, FiClock } from 'react-icons/fi';
import Link from 'next/link';
import BackToHome from '@/components/navigation/BackToHome';

// Precios base por categoría (en pesos)
const PRECIOS_BASE = {
    'mesa': 1200,
    'silla': 800,
    'armario': 2500,
    'cama': 3000,
    'escritorio': 1800,
    'estanteria': 1500,
    'personalizado': 2000
};

// Multiplicadores de precio por material
const MULTIPLICADORES_MATERIAL = {
    'pino': 1.0,
    'roble': 1.8,
    'nogal': 2.2,
    'cedro': 1.6,
    'caoba': 2.5,
    'haya': 1.4
};

// Multiplicadores de precio por acabado
const MULTIPLICADORES_ACABADO = {
    'natural': 1.0,
    'barnizado': 1.2,
    'lacado': 1.5,
    'pintado': 1.3,
    'envejecido': 1.4
};

export default function PresupuestoPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    
    // Estado para el formulario
    const [formData, setFormData] = useState({
        categoria: 'mesa',
        nombre: '',
        descripcion: '',
        material: 'pino',
        acabado: 'natural',
        ancho: 100,
        alto: 75,
        profundidad: 60,
        unidades: 1,
        comentarios: '',
        archivos: []
    });
    
    // Estado para la previsualización del presupuesto
    const [presupuesto, setPresupuesto] = useState({
        subtotal: 0,
        descuento: 0,
        total: 0,
        tiempoEstimado: '2-3 semanas'
    });
    
    // Estado para mensajes
    const [mensaje, setMensaje] = useState(null);
    const [cargando, setCargando] = useState(false);
    
    // Estado para imágenes de referencia
    const [imagenes, setImagenes] = useState([]);
    const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);

    // Calcular presupuesto cuando cambia el formulario
    useEffect(() => {
        calcularPresupuesto();
    }, [formData]);

    // Función para calcular el presupuesto
    const calcularPresupuesto = () => {
        // Precio base según categoría
        let precio = PRECIOS_BASE[formData.categoria] || PRECIOS_BASE.personalizado;
        
        // Ajustar por dimensiones (precio por m³)
        const volumen = (formData.ancho * formData.alto * formData.profundidad) / 1000000; // cm³ a m³
        precio = precio + (precio * volumen * 0.5);
        
        // Ajustar por material
        precio = precio * (MULTIPLICADORES_MATERIAL[formData.material] || 1);
        
        // Ajustar por acabado
        precio = precio * (MULTIPLICADORES_ACABADO[formData.acabado] || 1);
        
        // Multiplicar por unidades
        precio = precio * formData.unidades;
        
        // Aplicar descuento para clientes registrados (5%)
        const descuento = isAuthenticated ? precio * 0.05 : 0;
        
        // Calcular tiempo estimado
        let tiempoEstimado = '2-3 semanas';
        if (formData.unidades > 5) {
            tiempoEstimado = '4-6 semanas';
        } else if (formData.categoria === 'armario' || formData.categoria === 'estanteria') {
            tiempoEstimado = '3-4 semanas';
        }
        
        setPresupuesto({
            subtotal: precio,
            descuento: descuento,
            total: precio - descuento,
            tiempoEstimado: tiempoEstimado
        });
    };

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        // Para campos numéricos, asegurar que el valor sea numérico
        if (type === 'number') {
            const numeroValido = Math.max(1, parseInt(value) || 0);
            setFormData({
                ...formData,
                [name]: numeroValido
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // Manejar cambios en las imágenes
    const handleImagenes = (e) => {
        const archivos = Array.from(e.target.files);
        
        // Validar que sean imágenes y no más de 3
        const imagenesValidas = archivos.filter(archivo => 
            archivo.type.startsWith('image/') && imagenes.length + archivos.length <= 3
        );
        
        // Crear URLs para vista previa
        const nuevasImagenes = imagenesValidas.map(archivo => ({
            archivo,
            url: URL.createObjectURL(archivo),
            nombre: archivo.name
        }));
        
        setImagenes([...imagenes, ...nuevasImagenes]);
        setFormData({
            ...formData,
            archivos: [...formData.archivos, ...imagenesValidas]
        });
    };

    // Eliminar imagen
    const eliminarImagen = (index) => {
        const nuevasImagenes = [...imagenes];
        URL.revokeObjectURL(nuevasImagenes[index].url);
        nuevasImagenes.splice(index, 1);
        setImagenes(nuevasImagenes);
        
        const nuevosArchivos = [...formData.archivos];
        nuevosArchivos.splice(index, 1);
        setFormData({
            ...formData,
            archivos: nuevosArchivos
        });
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setMensaje(null);
        
        try {
            // Validaciones
            if (!formData.nombre.trim()) {
                throw new Error('Por favor, indique un nombre para el proyecto');
            }
            
            if (!isAuthenticated) {
                // Si no está autenticado, redirigir a login
                setMensaje({
                    tipo: 'info',
                    texto: 'Necesitas iniciar sesión para guardar tu presupuesto. Te redirigiremos al login.'
                });
                
                // Guardar datos temporalmente en localStorage
                localStorage.setItem('presupuesto_temporal', JSON.stringify(formData));
                
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
                
                return;
            }
            
            // Crear FormData para enviar archivos
            const formDataObj = new FormData();
            formDataObj.append('datos', JSON.stringify({
                ...formData,
                presupuesto: presupuesto
            }));
            
            // Añadir archivos
            formData.archivos.forEach((archivo, index) => {
                formDataObj.append(`archivo_${index}`, archivo);
            });
            
            // Enviar a la API
            const token = localStorage.getItem('token');
            const response = await fetch('/api/presupuestos/crear', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataObj
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al enviar el presupuesto');
            }
            
            // Éxito
            setMensaje({
                tipo: 'success',
                texto: 'Presupuesto enviado correctamente. Te contactaremos pronto.'
            });
            
            // Resetear formulario
            setFormData({
                categoria: 'mesa',
                nombre: '',
                descripcion: '',
                material: 'pino',
                acabado: 'natural',
                ancho: 100,
                alto: 75,
                profundidad: 60,
                unidades: 1,
                comentarios: '',
                archivos: []
            });
            
            setImagenes([]);
            
            // Redirigir al portal de cliente después de 2 segundos
            setTimeout(() => {
                router.push('/client-portal?section=presupuestos');
            }, 2000);
            
        } catch (error) {
            console.error('Error:', error);
            setMensaje({
                tipo: 'error',
                texto: error.message || 'Ha ocurrido un error al procesar tu solicitud'
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-[url('/taller-bg.jpg')] bg-cover bg-fixed">
            <div className="min-h-screen backdrop-blur-sm bg-amber-900/20 py-24 px-4 md:px-8">
                {/* Navegación */}
                <BackToHome showBack={true} theme="dark" />
                
                {/* Encabezado */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-50 mb-4">
                        Presupuesto Personalizado
                    </h1>
                    <p className="text-xl text-amber-100 max-w-3xl mx-auto">
                        Diseña tu mueble ideal y recibe un presupuesto estimado al instante. 
                        Después de enviarlo, nuestros artesanos lo revisarán y te contactarán para afinar los detalles.
                    </p>
                </motion.div>

                {/* Contenedor principal */}
                <div className="max-w-6xl mx-auto bg-amber-50/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl">
                    <div className="grid md:grid-cols-5">
                        {/* Formulario - 3 columnas en desktop */}
                        <div className="md:col-span-3 p-8">
                            <form onSubmit={handleSubmit}>
                                {/* Sección: Detalles Básicos */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-serif text-amber-900 border-b border-amber-200 pb-2 mb-4">
                                        Detalles Básicos
                                    </h3>
                                    
                                    <div className="mb-4">
                                        <label className="block text-amber-800 mb-2 font-medium">
                                            Categoría de Mueble
                                        </label>
                                        <select 
                                            name="categoria"
                                            value={formData.categoria}
                                            onChange={handleChange}
                                            className="w-full bg-amber-100/50 border-amber-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        >
                                            <option value="mesa">Mesa</option>
                                            <option value="silla">Silla</option>
                                            <option value="armario">Armario</option>
                                            <option value="cama">Cama</option>
                                            <option value="escritorio">Escritorio</option>
                                            <option value="estanteria">Estantería</option>
                                            <option value="personalizado">Otro (Personalizado)</option>
                                        </select>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-amber-800 mb-2 font-medium">
                                            Nombre del Proyecto
                                        </label>
                                        <input 
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Ej: Mesa de comedor familiar"
                                            className="w-full bg-amber-100/50 border-amber-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-amber-800 mb-2 font-medium">
                                            Descripción Breve
                                        </label>
                                        <textarea 
                                            name="descripcion"
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Describe brevemente el mueble que necesitas..."
                                            className="w-full bg-amber-100/50 border-amber-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
                                    </div>
                                </div>
                                
                                {/* Sección: Materiales y Acabados */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-serif text-amber-900 border-b border-amber-200 pb-2 mb-4">
                                        Materiales y Acabados
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-amber-800 mb-2 font-medium">
                                                Material Principal
                                            </label>
                                            <select 
                                                name="material"
                                                value={formData.material}
                                                onChange={handleChange}
                                                className="w-full bg-amber-100/50 border-amber-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            >
                                                <option value="pino">Pino</option>
                                                <option value="roble">Roble</option>
                                                <option value="nogal">Nogal</option>
                                                <option value="cedro">Cedro</option>
                                                <option value="caoba">Caoba</option>
                                                <option value="haya">Haya</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-amber-800 mb-2 font-medium">
                                                Acabado
                                            </label>
                                            <select 
                                                name="acabado"
                                                value={formData.acabado}
                                                onChange={handleChange}
                                                className="w-full bg-amber-100/50 border-amber-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            >
                                                <option value="natural">Natural (Aceite)</option>
                                                <option value="barnizado">Barnizado</option>
                                                <option value="lacado">Lacado</option>
                                                <option value="pintado">Pintado</option>
                                                <option value="envejecido">Envejecido</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Sección: Dimensiones */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-serif text-amber-900 border-b border-amber-200 pb-2 mb-4">
                                        Dimensiones
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-amber-800 mb-2 font-medium">
                                                Ancho (cm)
                                            </label>
                                            <div className="flex items-center">
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({...formData, ancho: Math.max(10, formData.ancho - 10)})}
                                                    className="bg-amber-200 text-amber-800 px-3 py-2 rounded-l-lg hover:bg-amber-300"
                                                >
                                                    <FiMinus />
                                                </button>
                                                <input 
                                                    type="number"
                                                    name="ancho"
                                                    value={formData.ancho}
                                                    onChange={handleChange}
                                                    min="10"
                                                    className="w-full text-center bg-amber-100/50 border-amber-200 py-2"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({...formData, ancho: formData.ancho + 10})}
                                                    className="bg-amber-200 text-amber-800 px-3 py-2 rounded-r-lg hover:bg-amber-300"
                                                >
                                                    <FiPlus />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-amber-800 mb-2 font-medium">
                                                Alto (cm)
                                            </label>
                                            <div className="flex items-center">
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({...formData, alto: Math.max(10, formData.alto - 10)})}
                                                    className="bg-amber-200 text-amber-800 px-3 py-2 rounded-l-lg hover:bg-amber-300"
                                                >
                                                    <FiMinus />
                                                </button>
                                                <input 
                                                    type="number"
                                                    name="alto"
                                                    value={formData.alto}
                                                    onChange={handleChange}
                                                    min="10"
                                                    className="w-full text-center bg-amber-100/50 border-amber-200 py-2"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({...formData, alto: formData.alto + 10})}
                                                    className="bg-amber-200 text-amber-800 px-3 py-2 rounded-r-lg hover:bg-amber-300"
                                                >
                                                    <FiPlus />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-amber-800 mb-2 font-medium">
                                                Profundidad (cm)
                                            </label>
                                            <div className="flex items-center">
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({...formData, profundidad: Math.max(10, formData.profundidad - 10)})}
                                                    className="bg-amber-200 text-amber-800 px-3 py-2 rounded-l-lg hover:bg-amber-300"
                                                >
                                                    <FiMinus />
                                                </button>
                                                <input 
                                                    type="number"
                                                    name="profundidad"
                                                    value={formData.profundidad}
                                                    onChange={handleChange}
                                                    min="10"
                                                    className="w-full text-center bg-amber-100/50 border-amber-200 py-2"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({...formData, profundidad: formData.profundidad + 10})}
                                                    className="bg-amber-200 text-amber-800 px-3 py-2 rounded-r-lg hover:bg-amber-300"
                                                >
                                                    <FiPlus />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <label className="block text-amber-800 mb-2 font-medium">
                                            Cantidad de Unidades
                                        </label>
                                        <div className="flex items-center max-w-xs">
                                            <button 
                                                type="button"
                                                onClick={() => setFormData({...formData, unidades: Math.max(1, formData.unidades - 1)})}
                                                className="bg-amber-200 text-amber-800 px-3 py-2 rounded-l-lg hover:bg-amber-300"
                                            >
                                                <FiMinus />
                                            </button>
                                            <input 
                                                type="number"
                                                name="unidades"
                                                value={formData.unidades}
                                                onChange={handleChange}
                                                min="1"
                                                className="w-full text-center bg-amber-100/50 border-amber-200 py-2"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setFormData({...formData, unidades: formData.unidades + 1})}
                                                className="bg-amber-200 text-amber-800 px-3 py-2 rounded-r-lg hover:bg-amber-300"
                                            >
                                                <FiPlus />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Sección: Imágenes de Referencia */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-serif text-amber-900 border-b border-amber-200 pb-2 mb-4">
                                        Imágenes de Referencia (Opcional)
                                    </h3>
                                    
                                    <div className="mb-4">
                                        <label className="flex items-center justify-center w-full h-32 px-4 border-2 border-amber-300 border-dashed rounded-lg cursor-pointer bg-amber-100/50 hover:bg-amber-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FiUpload className="w-8 h-8 mb-3 text-amber-700" />
                                                <p className="mb-2 text-sm text-amber-800">
                                                    <span className="font-medium">Haz clic para subir</span> o arrastra imágenes aquí
                                                </p>
                                                <p className="text-xs text-amber-600">
                                                    PNG, JPG o JPEG (máx. 3 imágenes)
                                                </p>
                                            </div>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                multiple
                                                onChange={handleImagenes}
                                                disabled={imagenes.length >= 3}
                                            />
                                        </label>
                                    </div>
                                    
                                    {imagenes.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {imagenes.map((imagen, index) => (
                                                <div key={index} className="relative group">
                                                    <img 
                                                        src={imagen.url} 
                                                        alt={`Referencia ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <button 
                                                        type="button"
                                                        onClick={() => eliminarImagen(index)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-70 hover:opacity-100"
                                                    >
                                                        <FiXCircle size={20} />
                                                    </button>
                                                    <p className="text-xs text-amber-700 mt-1 truncate">
                                                        {imagen.nombre}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Sección: Comentarios Adicionales */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-serif text-amber-900 border-b border-amber-200 pb-2 mb-4">
                                        Comentarios Adicionales
                                    </h3>
                                    
                                    <div>
                                        <textarea 
                                            name="comentarios"
                                            value={formData.comentarios}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Indícanos cualquier detalle adicional o requisito especial para tu mueble..."
                                            className="w-full bg-amber-100/50 border-amber-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
                                    </div>
                                </div>
                                
                                {/* Mensaje de estado */}
                                {mensaje && (
                                    <div className={`p-4 mb-6 rounded-lg ${
                                        mensaje.tipo === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 
                                        mensaje.tipo === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
                                        'bg-blue-100 text-blue-700 border border-blue-200'
                                    }`}>
                                        {mensaje.texto}
                                    </div>
                                )}
                                
                                {/* Botón de envío */}
                                <div className="flex justify-end">
                                    <motion.button
                                        type="submit"
                                        disabled={cargando}
                                        whileTap={{ scale: 0.95 }}
                                        className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-amber-700 rounded-lg shadow-md hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                                    >
                                        {cargando ? (
                                            <>
                                                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <FiFileText className="w-5 h-5 mr-2" />
                                                Enviar Solicitud
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                        
                        {/* Vista previa - 2 columnas en desktop */}
                        <div className="md:col-span-2 bg-[url('/textura-madera.jpg')] bg-cover">
                            <div className="h-full backdrop-blur-sm bg-amber-800/80 p-8 text-amber-50">
                                <h3 className="text-2xl font-serif border-b border-amber-600 pb-2 mb-6">
                                    Resumen del Presupuesto
                                </h3>
                                
                                {/* Detalles del proyecto */}
                                <div className="mb-6 bg-amber-900/40 rounded-lg p-4">
                                    <h4 className="font-medium text-xl mb-2">Detalles del Proyecto</h4>
                                    
                                    <div className="space-y-2 text-amber-100">
                                        <p><span className="font-medium">Tipo:</span> {formData.categoria.charAt(0).toUpperCase() + formData.categoria.slice(1)}</p>
                                        
                                        <p><span className="font-medium">Nombre:</span> {formData.nombre || 'Sin especificar'}</p>
                                        
                                        <p><span className="font-medium">Material:</span> {formData.material.charAt(0).toUpperCase() + formData.material.slice(1)}</p>
                                        
                                        <p><span className="font-medium">Acabado:</span> {formData.acabado.charAt(0).toUpperCase() + formData.acabado.slice(1)}</p>
                                        
                                        <p><span className="font-medium">Dimensiones:</span> {formData.ancho} × {formData.alto} × {formData.profundidad} cm</p>
                                        
                                        <p><span className="font-medium">Unidades:</span> {formData.unidades}</p>
                                    </div>
                                </div>
                                
                                {/* Presupuesto estimado */}
                                <div className="mb-6 bg-amber-900/40 rounded-lg p-4">
                                    <h4 className="font-medium text-xl mb-2">Presupuesto Estimado</h4>
                                    
                                    <div className="space-y-3 text-amber-100">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>${presupuesto.subtotal.toFixed(2)}</span>
                                        </div>
                                        
                                        {presupuesto.descuento > 0 && (
                                            <div className="flex justify-between text-amber-300">
                                                <span>Descuento (Usuario registrado):</span>
                                                <span>-${presupuesto.descuento.toFixed(2)}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between border-t border-amber-600 pt-2 font-bold text-xl">
                                            <span>Total Estimado:</span>
                                            <span>${presupuesto.total.toFixed(2)}</span>
                                        </div>
                                        
                                        <div className="text-amber-300 text-sm italic mt-2">
                                            * Este es un presupuesto estimado. El precio final puede variar según los detalles específicos del proyecto.
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Tiempo de entrega */}
                                <div className="mb-6 bg-amber-900/40 rounded-lg p-4">
                                    <h4 className="font-medium text-xl mb-2">Tiempo de Entrega</h4>
                                    
                                    <div className="flex items-center text-amber-100">
                                        <FiClock className="mr-2" />
                                        <span>Tiempo estimado: {presupuesto.tiempoEstimado}</span>
                                    </div>
                                </div>
                                
                                {/* Información adicional */}
                                <div className="bg-amber-700/50 rounded-lg p-4 text-amber-100 text-sm">
                                    <div className="flex items-start">
                                        <FiInfo className="text-amber-300 mr-2 mt-1" />
                                        <p>
                                            Al enviar este formulario, un artesano especializado revisará los detalles y te contactará para confirmar el presupuesto. 
                                            Si estás de acuerdo, se solicitará un depósito del 30% para comenzar la producción.
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Si no está autenticado, mostrar mensaje para iniciar sesión */}
                                {!isAuthenticated && (
                                    <div className="mt-6 bg-amber-900/60 rounded-lg p-4 border border-amber-600">
                                        <h4 className="font-medium text-xl mb-2 text-amber-300">¿Ya tienes una cuenta?</h4>
                                        <p className="text-amber-100 mb-4">
                                            Inicia sesión para guardar tus presupuestos y recibir un 5% de descuento.
                                        </p>
                                        <Link href="/login" className="inline-block px-4 py-2 bg-amber-500 text-amber-900 font-medium rounded-lg hover:bg-amber-400 transition">
                                            Iniciar Sesión
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 