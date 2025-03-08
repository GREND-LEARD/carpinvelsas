'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiCheck, FiDatabase, FiInfo, FiLock, FiRefreshCw, FiUser } from 'react-icons/fi';

export default function DiagnosticoPresupuestos() {
    const router = useRouter();
    const [diagnosticoData, setDiagnosticoData] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [creandoRPC, setCreandoRPC] = useState(false);
    const [rpcCreada, setRpcCreada] = useState(false);
    
    const realizarDiagnostico = async () => {
        setCargando(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('auth_token') || 
                         localStorage.getItem('token') || 
                         localStorage.getItem('jwt_token');
            
            if (!token) {
                const keys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    keys.push(localStorage.key(i));
                }
                
                setError(`No hay token de autenticación. Por favor, inicia sesión nuevamente. Claves disponibles: ${keys.join(', ')}`);
                setCargando(false);
                return;
            }
            
            console.log("Token encontrado: " + token.substring(0, 10) + "...");
            
            const response = await fetch('/api/diagnostico/presupuestos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            setDiagnosticoData(data);
            
        } catch (err) {
            console.error('Error en diagnóstico:', err);
            setError(err.message || 'Error al realizar el diagnóstico');
        } finally {
            setCargando(false);
        }
    };
    
    useEffect(() => {
        realizarDiagnostico();
    }, []);
    
    const formatearJSON = (obj) => {
        if (!obj) return 'null';
        try {
            return JSON.stringify(obj, null, 2);
        } catch (err) {
            return String(obj);
        }
    };
    
    const resolverProblema = async () => {
        setCargando(true);
        try {
            const token = localStorage.getItem('auth_token') || 
                         localStorage.getItem('token') || 
                         localStorage.getItem('jwt_token');
                         
            if (!token) {
                setError("No se encontró un token de autenticación");
                setCargando(false);
                return;
            }
            
            const response = await fetch('/api/diagnostico/resolver-admin', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            await realizarDiagnostico();
            alert('¡La solución ha sido aplicada! Intenta revisar el panel de administrador ahora.');
            
        } catch (err) {
            console.error('Error al resolver:', err);
            setError(err.message || 'Error al resolver el problema');
        } finally {
            setCargando(false);
        }
    };
    
    const crearFuncionRPC = async () => {
        setCreandoRPC(true);
        setRpcCreada(false);
        try {
            const token = localStorage.getItem('auth_token') || 
                         localStorage.getItem('token') || 
                         localStorage.getItem('jwt_token');
                         
            if (!token) {
                setError("No se encontró un token de autenticación");
                setCreandoRPC(false);
                return;
            }
            
            const response = await fetch('/api/diagnostico/crear-funcion-rpc', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `Error ${response.status}`);
            }
            
            setRpcCreada(true);
            alert('¡Función RPC creada correctamente! Ahora deberías poder ver los presupuestos en el panel de administrador.');
            await realizarDiagnostico();
            
        } catch (err) {
            console.error('Error al crear función RPC:', err);
            setError(err.message || 'Error al crear función RPC');
        } finally {
            setCreandoRPC(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-6">
            <div className="mb-6 flex justify-between items-center">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-amber-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    onClick={() => router.push('/client-portal')}
                >
                    <span>Volver al Portal</span>
                </motion.button>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 ${cargando ? 'bg-gray-400' : 'bg-amber-600 text-white'}`}
                    onClick={realizarDiagnostico}
                    disabled={cargando}
                >
                    <FiRefreshCw className={cargando ? "animate-spin" : ""} />
                    <span>Actualizar diagnóstico</span>
                </motion.button>
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-amber-900">Diagnóstico de Presupuestos</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <h3 className="flex items-center gap-2 font-bold"><FiAlertTriangle /> Error</h3>
                    <p>{error}</p>
                </div>
            )}
            
            {cargando && (
                <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-900"></div>
                </div>
            )}
            
            {!cargando && diagnosticoData && (
                <div className="space-y-6">
                    {/* Resumen y acciones recomendadas */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-amber-600"
                    >
                        <h2 className="text-2xl font-bold mb-3 text-amber-800">Diagnóstico General</h2>
                        
                        <div className="mb-4 text-lg">
                            {diagnosticoData.presupuestos?.length > 0 ? (
                                <div className="flex items-center gap-2 text-green-600">
                                    <FiCheck size={24} />
                                    <span>Se encontraron {diagnosticoData.presupuestos?.length} presupuestos en el sistema.</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-amber-600">
                                    <FiAlertTriangle size={24} />
                                    <span>No se encontraron presupuestos en el sistema.</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-amber-50 p-4 rounded-lg">
                            <h3 className="font-bold flex items-center gap-2 mb-2">
                                <FiInfo size={20} />
                                Problema Detectado
                            </h3>
                            {diagnosticoData?.usuario?.rol === 'admin' ? (
                                <p>Eres un administrador pero no puedes ver los presupuestos debido a un problema con las políticas de seguridad de Supabase.</p>
                            ) : (
                                <p>Tu cuenta no tiene permisos de administrador. Rol actual: {diagnosticoData?.usuario?.rol || 'desconocido'}</p>
                            )}
                        </div>
                        
                        <div className="mt-4">
                            <h3 className="font-bold mb-2">Solución Recomendada:</h3>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>Actualizar tu cuenta para garantizar que tienes el rol de administrador correcto</li>
                                <li>Modificar las políticas de seguridad para permitir el acceso como administrador</li>
                                <li>Ajustar el código de la API para eludir las políticas de seguridad RLS</li>
                            </ol>
                            
                            <div className="flex flex-col md:flex-row gap-3 mt-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-6 py-3 rounded-md shadow-md font-bold"
                                    onClick={resolverProblema}
                                    disabled={cargando}
                                >
                                    {cargando ? "Aplicando..." : "Aplicar Solución Automática"}
                                </motion.button>
                                
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-amber-100 border border-amber-600 text-amber-900 px-6 py-3 rounded-md shadow-md font-bold flex items-center justify-center gap-2"
                                    onClick={crearFuncionRPC}
                                    disabled={creandoRPC || rpcCreada}
                                >
                                    {creandoRPC ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-amber-900 border-t-transparent rounded-full"></div>
                                            Creando Función...
                                        </>
                                    ) : rpcCreada ? (
                                        <>
                                            <FiCheck />
                                            Función RPC Creada
                                        </>
                                    ) : (
                                        "Crear Función RPC Adicional"
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Información del Usuario */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-amber-800">
                            <FiUser />
                            Información del Usuario
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-amber-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Datos del Usuario</h3>
                                <ul className="space-y-2">
                                    <li><strong>ID:</strong> {diagnosticoData?.usuario?.id}</li>
                                    <li><strong>Email:</strong> {diagnosticoData?.usuario?.email}</li>
                                    <li><strong>Nombre:</strong> {diagnosticoData?.usuario?.nombre} {diagnosticoData?.usuario?.apellido}</li>
                                    <li><strong>Rol:</strong> {diagnosticoData?.usuario?.rol}</li>
                                    <li><strong>Admin (boolean):</strong> {diagnosticoData?.usuario?.admin ? 'Sí' : 'No'}</li>
                                </ul>
                            </div>
                            
                            <div className="bg-amber-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Token de Autenticación</h3>
                                <ul className="space-y-2">
                                    <li><strong>Token válido:</strong> {diagnosticoData?.tokenValido ? 'Sí' : 'No'}</li>
                                    <li><strong>ID en Token:</strong> {diagnosticoData?.tokenUserId}</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Información de la Tabla */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-amber-800">
                            <FiDatabase />
                            Estructura de Datos
                        </h2>
                        
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Estructura de la Tabla Presupuestos</h3>
                            <div className="bg-gray-100 p-4 rounded overflow-x-auto">
                                <pre>{formatearJSON(diagnosticoData?.estructuraTabla)}</pre>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Políticas de Seguridad */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-amber-800">
                            <FiLock />
                            Políticas de Seguridad
                        </h2>
                        
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Políticas RLS de Presupuestos</h3>
                            <ul className="bg-amber-50 p-4 rounded-lg">
                                <li className="mb-2">
                                    <strong>Para usuarios normales:</strong>
                                    <code className="block bg-gray-100 p-2 mt-1 rounded">
                                        usuario_id = auth.uid()
                                    </code>
                                </li>
                                <li>
                                    <strong>Para administradores:</strong>
                                    <code className="block bg-gray-100 p-2 mt-1 rounded">
                                        (SELECT rol FROM usuarios WHERE id = auth.uid()) = 'admin'
                                    </code>
                                </li>
                            </ul>
                        </div>
                        
                        <p className="text-amber-700">
                            <strong>Nota:</strong> Si tu cuenta usa el campo <code>admin = true</code> pero la política verifica <code>rol = 'admin'</code>, esto puede causar el problema observado.
                        </p>
                    </motion.div>
                    
                    {/* Presupuestos en el Sistema */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold mb-3 text-amber-800">Presupuestos en el Sistema</h2>
                        
                        {diagnosticoData.presupuestos?.length > 0 ? (
                            <div>
                                <p className="mb-3">Se encontraron {diagnosticoData.presupuestos.length} presupuestos:</p>
                                
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white rounded-lg">
                                        <thead className="bg-amber-100">
                                            <tr>
                                                <th className="py-2 px-4 text-left">ID</th>
                                                <th className="py-2 px-4 text-left">Nombre</th>
                                                <th className="py-2 px-4 text-left">Usuario ID</th>
                                                <th className="py-2 px-4 text-left">Estado</th>
                                                <th className="py-2 px-4 text-left">Fecha</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {diagnosticoData.presupuestos.map((presupuesto) => (
                                                <tr key={presupuesto.id} className="border-b border-gray-200">
                                                    <td className="py-2 px-4">{presupuesto.id.substring(0, 8)}...</td>
                                                    <td className="py-2 px-4">{presupuesto.nombre}</td>
                                                    <td className="py-2 px-4">
                                                        {presupuesto.usuario_id 
                                                            ? presupuesto.usuario_id.substring(0, 8) + '...'
                                                            : presupuesto.user_id 
                                                                ? presupuesto.user_id.substring(0, 8) + '...' 
                                                                : 'N/A'}
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            presupuesto.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                                                            presupuesto.estado === 'rechazado' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {presupuesto.estado}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        {new Date(presupuesto.fecha_creacion).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-amber-50 p-4 rounded-lg text-center">
                                <p className="text-amber-800">No se encontraron presupuestos en el sistema.</p>
                                <p className="text-sm mt-2">Esto podría indicar que:</p>
                                <ul className="text-sm list-disc pl-5 mt-1 text-left">
                                    <li>No hay presupuestos creados en la base de datos</li>
                                    <li>Las políticas de seguridad están bloqueando el acceso</li>
                                    <li>El token de autenticación no tiene permisos suficientes</li>
                                </ul>
                            </div>
                        )}
                    </motion.div>
                    
                    {/* Datos Completos */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold mb-3 text-amber-800">Datos Completos (Modo Desarrollo)</h2>
                        
                        <div className="bg-gray-100 p-4 rounded overflow-x-auto">
                            <pre>{formatearJSON(diagnosticoData)}</pre>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
} 