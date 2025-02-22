"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { verifyToken } from '../utils/jwt';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Verificar si hay datos en localStorage
                const savedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');

                if (savedUser && token) {
                    // Validar el token con el servidor
                    const response = await fetch('/api/auth/validate', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        setUser(JSON.parse(savedUser));
                    } else {
                        // Si el token no es válido, limpiar todo
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        router.push('/login');
                    }
                }
            } catch (error) {
                console.error('Auth initialization failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        router.push(userData.rol === 'admin' ? '/dashboard' : '/client-portal');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    const hasRole = (role) => {
        return user?.rol === role;
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isLoading,
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