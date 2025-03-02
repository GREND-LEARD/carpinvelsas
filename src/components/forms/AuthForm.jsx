'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiLock, FiMail, FiUser, FiPhone, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';

const AuthForm = ({ isLogin }) => {
    const router = useRouter();
    const { login } = useAuth();
    
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '',
        rol: 'client',
        adminCode: ''
    });
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [debugInfo, setDebugInfo] = useState(null);

    const validateForm = () => {
        // Resetear mensajes
        setError('');
        setSuccess('');
        
        if (!formData.email) {
            setError('Por favor, ingresa tu correo electrónico');
            return false;
        }
        
        if (!formData.password) {
            setError('Por favor, ingresa tu contraseña');
            return false;
        }
        
        if (!isLogin && !formData.name) {
            setError('Por favor, ingresa tu nombre');
            return false;
        }
        
        if (!isLogin && formData.rol === 'admin' && formData.adminCode !== '9966') {
            setError('Código de administrador incorrecto');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        setDebugInfo(null);
        
        console.log(`Iniciando ${isLogin ? 'login' : 'registro'} con datos:`, 
            { email: formData.email, rol: formData.rol });
    
        if (!validateForm()) {
            setIsLoading(false);
            return;
        }
    
        try {
            const dataToSend = isLogin ? {
                email: formData.email,
                password: formData.password
            } : {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                rol: formData.rol
            };
    
            console.log('Enviando solicitud al endpoint:', isLogin ? 'login' : 'registro');
            
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
    
            const data = await response.json();
            console.log('Respuesta recibida:', { status: response.status, data });
            
            // Guardar información de depuración
            setDebugInfo({
                status: response.status,
                data: data,
                ok: response.ok
            });
    
            if (!response.ok) {
                throw new Error(data.message || 'Error en el servidor');
            }
    
            if (isLogin) {
                // Login exitoso
                setSuccess('Login exitoso. Redirigiendo...');
                console.log('Datos de usuario recibidos:', data.user);
                console.log('Token recibido:', data.token ? 'Sí (presente)' : 'No (ausente)');
                
                if (!data.user || !data.token) {
                    throw new Error('Respuesta incompleta del servidor');
                }
                
                // Pequeña pausa para mostrar el mensaje de éxito
                setTimeout(() => {
                    login(data.user, data.token);
                }, 1000);
            } else {
                // Registro exitoso
                setSuccess('¡Registro exitoso! Redirigiendo al login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || `Error en la ${isLogin ? 'autenticación' : 'registro'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full mx-auto p-8 bg-amber-50/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-amber-100">
            <motion.h2 initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-3xl font-bold text-amber-900 mb-8 text-center font-serif">
                {isLogin ? 'Bienvenido Artesano' : 'Únete al Taller'}
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                    <>
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="relative">
                            <FiUser className="absolute top-3 left-3 text-[#4F3422]" size={20} />
                            <input 
                                type="text" 
                                placeholder="Tu nombre" 
                                className="w-full pl-10 pr-4 py-3 bg-amber-100/50 rounded-lg focus:ring-2 ring-amber-500 border-none text-[#4F3422]"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                required 
                            />
                        </motion.div>

                        <motion.div 
                            initial={{ x: -20, opacity: 0 }} 
                            animate={{ x: 0, opacity: 1 }} 
                            transition={{ delay: 0.15 }} 
                            className="relative"
                        >
                            <label className="block text-[#4F3422] text-sm mb-2 font-medium">Tipo de cuenta</label>
                            <select
                                className="w-full pl-4 pr-8 py-3 bg-amber-100/50 rounded-lg focus:ring-2 ring-amber-500 border-none appearance-none text-[#4F3422]"
                                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                                value={formData.rol}
                            >
                                <option value="client">Cliente</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </motion.div>

                        {formData.rol === 'admin' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative"
                            >
                                <label className="block text-[#4F3422] text-sm mb-2 font-medium">
                                    Código de Administrador
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute top-3 left-3 text-[#4F3422]" size={20} />
                                    <input
                                        type="password"
                                        placeholder="Ingresa el código secreto"
                                        className="w-full pl-10 pr-4 py-3 bg-amber-100/50 rounded-lg focus:ring-2 ring-amber-500 border-none text-[#4F3422]"
                                        onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                                        required={formData.rol === 'admin'}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </>
                )}

                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="relative">
                    <FiMail className="absolute top-3 left-3 text-[#4F3422]" size={20} />
                    <input 
                        type="email" 
                        placeholder="correo@artesania.com" 
                        className="w-full pl-10 pr-4 py-3 bg-amber-100/50 rounded-lg focus:ring-2 ring-amber-500 border-none text-[#4F3422]"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        required 
                    />
                </motion.div>

                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="relative">
                    <FiLock className="absolute top-3 left-3 text-[#4F3422]" size={20} />
                    <input 
                        type="password" 
                        placeholder="Contraseña maestra" 
                        className="w-full pl-10 pr-4 py-3 bg-amber-100/50 rounded-lg focus:ring-2 ring-amber-500 border-none text-[#4F3422]"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                        required 
                    />
                </motion.div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="flex items-center p-3 bg-red-100 text-red-700 rounded"
                    >
                        <FiAlertCircle className="mr-2" />
                        <span>{error}</span>
                    </motion.div>
                )}

                {success && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="flex items-center p-3 bg-green-100 text-green-700 rounded"
                    >
                        <span>{success}</span>
                    </motion.div>
                )}

                <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    disabled={isLoading} 
                    className="w-full bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <FiLock className="inline" />
                    )}
                    {isLogin ? 'Acceder al Taller' : 'Registrar'}
                </motion.button>
            </form>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center text-amber-700">
                {isLogin ? (
                    <>
                        ¿Primera vez en el taller?
                        <button onClick={() => router.push('/register')} className="ml-2 text-amber-900 font-semibold hover:underline">Crea tu cuenta</button>
                    </>
                ) : (
                    <>
                        ¿Ya tienes cuenta?
                        <button onClick={() => router.push('/login')} className="ml-2 text-amber-900 font-semibold hover:underline">Inicia sesión</button>
                    </>
                )}
            </motion.p>
        </motion.div>
    );
};

export default AuthForm;