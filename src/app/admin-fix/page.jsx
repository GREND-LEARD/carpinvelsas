'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCheck, FiAlertTriangle, FiRefreshCw, FiLock, FiUnlock, FiShield, FiUser, FiDatabase } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminFix() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [tokenInfo, setTokenInfo] = useState(null);
    const [dbInfo, setDbInfo] = useState(null);
    const [error, setError] = useState(null);
    const [correctionStarted, setCorrectionStarted] = useState(false);
    const [correctionSuccess, setCorrectionSuccess] = useState(false);
    const [status, setStatus] = useState('Verificando autenticación...');

    useEffect(() => {
        const checkAuthStatus = async () => {
            setLoading(true);
            setError(null);
            setStatus('Verificando autenticación...');
            
            try {
                // Verificar si hay token
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No hay sesión activa. Por favor inicia sesión primero.');
                    setLoading(false);
                    return;
                }
                
                // Verificar info del usuario
                setStatus('Obteniendo información del usuario...');
                const response = await fetch('/api/debug/usuario', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al verificar usuario');
                }
                
                const data = await response.json();
                setTokenInfo(data.token_info);
                setDbInfo(data.database_info);
                
                if (data.rol_correcto) {
                    if (data.token_info.rol === 'admin') {
                        setStatus('El usuario ya tiene rol de administrador correctamente configurado.');
                    } else {
                        setStatus('El usuario no tiene rol de administrador (ni en token ni en base de datos).');
                    }
                } else {
                    setStatus('¡Encontrado problema! Hay una discrepancia entre el rol en el token y la base de datos.');
                }
            } catch (error) {
                console.error('Error al verificar estado:', error);
                setError(error.message || 'Error al verificar estado');
            } finally {
                setLoading(false);
            }
        };
        
        checkAuthStatus();
    }, []);
    
    const corregirRol = async () => {
        setCorrectionStarted(true);
        setStatus('Corrigiendo rol de administrador...');
        
        try {
            const token = localStorage.getItem('token');
            
            // 1. Intentar actualizar en la base de datos
            const response = await fetch('/api/auth/update-rol', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    rol: 'admin'
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar rol');
            }
            
            const data = await response.json();
            
            // 2. Regenerar token con rol admin
            setStatus('Regenerando token de autenticación...');
            const tokenResponse = await fetch('/api/auth/refresh-token', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!tokenResponse.ok) {
                throw new Error('Error al regenerar token');
            }
            
            const tokenData = await tokenResponse.json();
            
            // 3. Actualizar token en localStorage
            localStorage.setItem('token', tokenData.token);
            
            // 4. Actualizar información del usuario en localStorage
            const userJson = localStorage.getItem('user');
            if (userJson) {
                const user = JSON.parse(userJson);
                user.rol = 'admin';
                localStorage.setItem('user', JSON.stringify(user));
            }
            
            // 5. Volver a verificar
            const checkResponse = await fetch('/api/debug/usuario', {
                headers: {
                    'Authorization': `Bearer ${tokenData.token}`
                }
            });
            
            if (!checkResponse.ok) {
                throw new Error('Error al verificar después de la corrección');
            }
            
            const checkData = await checkResponse.json();
            setTokenInfo(checkData.token_info);
            setDbInfo(checkData.database_info);
            
            setCorrectionSuccess(true);
            setStatus('¡Rol corregido correctamente! Ahora tienes permisos de administrador.');
        } catch (error) {
            console.error('Error al corregir rol:', error);
            setError(error.message || 'Error al corregir rol');
            setStatus('Ocurrió un error al intentar corregir el rol.');
        } finally {
            setCorrectionStarted(false);
        }
    };
    
    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };
    
    return (
        <div className="min-h-screen bg-amber-50 p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-amber-600 px-6 py-4 flex items-center">
                    <FiShield className="w-6 h-6 text-white mr-2" />
                    <h1 className="text-xl text-white font-bold">Herramienta de Diagnóstico de Rol de Administrador</h1>
                </div>
                
                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-amber-700">{status}</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                            <div className="flex items-center">
                                <FiAlertTriangle className="w-6 h-6 mr-2" />
                                <p>{error}</p>
                            </div>
                            <div className="mt-4 flex justify-center">
                                <button 
                                    onClick={cerrarSesion} 
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Cerrar sesión e intentar de nuevo
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-amber-800 mb-4">Diagnóstico</h2>
                                <div className="bg-amber-50 p-4 rounded-lg mb-4">
                                    <p className="text-amber-700 mb-2">Estado: {status}</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h3 className="font-bold text-amber-800 flex items-center mb-2">
                                                <FiLock className="mr-2" /> Información en Token
                                            </h3>
                                            {tokenInfo && (
                                                <div className="space-y-2">
                                                    <p><span className="font-medium">ID:</span> {tokenInfo.id}</p>
                                                    <p><span className="font-medium">Email:</span> {tokenInfo.email}</p>
                                                    <p className={`font-medium ${tokenInfo.rol === 'admin' ? 'text-green-600' : 'text-red-600'}`}>
                                                        Rol: {tokenInfo.rol || 'No especificado'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <h3 className="font-bold text-amber-800 flex items-center mb-2">
                                                <FiDatabase className="mr-2" /> Información en Base de Datos
                                            </h3>
                                            {dbInfo && (
                                                <div className="space-y-2">
                                                    <p><span className="font-medium">ID:</span> {dbInfo.id}</p>
                                                    <p><span className="font-medium">Nombre:</span> {dbInfo.nombre}</p>
                                                    <p><span className="font-medium">Email:</span> {dbInfo.email}</p>
                                                    <p className={`font-medium ${dbInfo.rol === 'admin' ? 'text-green-600' : 'text-red-600'}`}>
                                                        Rol: {dbInfo.rol || 'No especificado'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-amber-800 mb-4">Acciones</h2>
                                
                                <div className="flex flex-col md:flex-row gap-4">
                                    {(tokenInfo?.rol !== 'admin' || dbInfo?.rol !== 'admin') && !correctionSuccess && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={corregirRol}
                                            disabled={correctionStarted}
                                            className={`flex items-center justify-center px-6 py-3 bg-amber-600 text-white rounded-lg ${
                                                correctionStarted ? 'opacity-70 cursor-not-allowed' : 'hover:bg-amber-700'
                                            }`}
                                        >
                                            {correctionStarted ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Corrigiendo...
                                                </>
                                            ) : (
                                                <>
                                                    <FiUnlock className="mr-2" />
                                                    Corregir rol de administrador
                                                </>
                                            )}
                                        </motion.button>
                                    )}
                                    
                                    {correctionSuccess && (
                                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 flex items-center">
                                            <FiCheck className="w-6 h-6 mr-2" />
                                            <p>¡Rol corregido correctamente! Ahora tienes permisos de administrador.</p>
                                        </div>
                                    )}
                                    
                                    <Link href="/dashboard">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                        >
                                            <FiUser className="mr-2" />
                                            Volver al Dashboard
                                        </motion.button>
                                    </Link>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => window.location.reload()}
                                        className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        <FiRefreshCw className="mr-2" />
                                        Actualizar diagnóstico
                                    </motion.button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 