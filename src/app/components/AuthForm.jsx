'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';

const AuthForm = ({ isLogin }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '',
        rol: 'client',
        adminCode: '' // Nuevo campo para el código de admin
    });
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
            setError('Por favor, complete todos los campos');
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

        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        try {
            // Preparar datos para enviar (sin el código de admin)
            const dataToSend = isLogin ? {
                email: formData.email,
                password: formData.password
            } : {
                ...formData,
                adminCode: undefined
            };

            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Ocurrió un error');

            if (isLogin) {
                // Guardar datos del usuario y token
                localStorage.setItem('user', JSON.stringify(data.user));
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                // Asegurarse de que la redirección ocurra después de guardar los datos
                setTimeout(() => {
                    const redirectPath = data.user.rol === 'admin' ? '/dashboard' : '/client-portal';
                    router.push(redirectPath);
                }, 100);
            } else {
                // Si es registro exitoso, redirigir al login
                router.push('/login');
            }
        } catch (err) {
            setError(err.message);
            setFormData((prev) => ({ ...prev, password: '' }));
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
                            <FiUser className="absolute top-3 left-3 text-amber-600" size={20} />
                            <input type="text" placeholder="Tu nombre" className="w-full pl-10 pr-4 py-3 bg-amber-100/50 rounded-lg focus:ring-2 ring-amber-500 border-none"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </motion.div>

                        {/* Selector de rol */}
                        <motion.div 
                            initial={{ x: -20, opacity: 0 }} 
                            animate={{ x: 0, opacity: 1 }} 
                            transition={{ delay: 0.15 }} 
                            className="relative"
                        >
                            <label className="block text-amber-700 text-sm mb-2 font-medium">Tipo de cuenta</label>
                            <select
                                className="w-full pl-4 pr-8 py-3 bg-amber-100/50 rounded-lg focus:ring-2 ring-amber-500 border-none appearance-none text-amber-900"
                                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                                value={formData.rol}
                            >
                                <option value="client">Cliente</option>
                                <option value="admin">Administrador</option>
                            </select>
                            <div className="absolute right-3 top-[2.7rem] pointer-events-none text-amber-600">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Campo de código de administrador */}
                        {formData.rol === 'admin' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="relative"
                            >
                                <label className="block text-amber-700 text-sm mb-2 font-medium">
                                    Código de Administrador
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute top-3 left-3 text-amber-600" size={20} />
                                    <input
                                        type="password"
                                        placeholder="Ingresa el código secreto"
                                        className="w-full pl-10 pr-4 py-3 bg-amber-100/50 rounded-lg focus:ring-2 ring-amber-500 border-none"
                                        onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                                        required={formData.rol === 'admin'}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </>
                )}

                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="relative">
                    <FiMail className="absolute top-3 left-3 text-amber-600" size={20} />
                    <input type="email" placeholder="correo@artesania.com" className="w-full pl-10 pr-4 py-3 bg-amber-100/50 rounded-lg focus:ring-2 ring-amber-500 border-none"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </motion.div>

                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="relative">
                    <FiLock className="absolute top-3 left-3 text-amber-600" size={20} />
                    <input type="password" placeholder="Contraseña maestra" className="w-full pl-10 pr-4 py-3 bg-amber-100/50 rounded-lg focus:ring-2 ring-amber-500 border-none"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                </motion.div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={isLoading} className="w-full bg-amber-700 hover:bg-amber-600 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
                    {isLoading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiLock className="inline" />}
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