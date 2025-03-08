"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            try {
                setIsLoading(true);
                // Verificar si hay datos en localStorage
                const savedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                console.log('Inicializando autenticación:', { 
                    hasUserData: !!savedUser, 
                    hasToken: !!token 
                });

                if (savedUser && token) {
                    try {
                        // Validar el token con el servidor
                        const response = await fetch('/api/auth/validate', {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        const data = await response.json();

                        if (response.ok && data.valid) {
                            const userData = JSON.parse(savedUser);
                            console.log('Token válido, usuario autenticado:', userData.email);
                            setUser(userData);
                        } else {
                            console.log('Token inválido, limpiando datos de sesión');
                            await logout(false); // Logout sin redirección
                        }
                    } catch (error) {
                        console.error('Error validando token:', error);
                        await logout(false); // Logout sin redirección
                    }
                } else {
                    console.log('No hay datos de sesión');
                }
            } catch (error) {
                console.error('Error inicializando autenticación:', error);
                setAuthError('Error al inicializar la autenticación');
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (userData, token) => {
        try {
            console.log('Iniciando sesión con:', userData);
            
            // Validar que exista un token
            if (!token) {
                throw new Error('No se proporcionó un token de autenticación');
            }
            
            // Guardar en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('auth_token', token); // Duplicamos el token con ambos nombres para compatibilidad
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Actualizar estado
            setUser(userData);
            setAuthError(null);
            
            // Redireccionar según rol
            const redirectPath = userData.rol === 'admin' ? '/dashboard' : '/productos';
            console.log(`Redirigiendo a: ${redirectPath}`);
            router.push(redirectPath);
            
            return true;
        } catch (error) {
            console.error('Error en login:', error);
            setAuthError(error.message);
            return false;
        }
    };

    const logout = async (shouldRedirect = true) => {
        try {
            // Limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('auth_token'); // Eliminar también la versión duplicada
            localStorage.removeItem('user');
            
            // Actualizar estado
            setUser(null);
            
            // Redireccionar si es necesario
            if (shouldRedirect) {
                console.log('Sesión cerrada, redirigiendo a login');
                router.push('/login');
            }
        } catch (error) {
            console.error('Error en logout:', error);
        }
    };

    const hasRole = (role) => {
        return user?.rol === role;
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isLoading,
            authError,
            login, 
            logout,
            hasRole,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);