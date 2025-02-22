'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Verificar autenticación solo cuando isLoading sea false
        if (!isLoading) {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (!token || !savedUser) {
                router.push('/login');
                return;
            }

            // Si hay roles permitidos, verificar el rol del usuario
            if (allowedRoles.length > 0 && user) {
                if (!allowedRoles.includes(user.rol)) {
                    router.push(user.rol === 'admin' ? '/dashboard' : '/client-portal');
                }
            }
        }
    }, [isLoading, user, router, allowedRoles]);

    // Mostrar loading mientras se verifica la autenticación
    if (isLoading) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center">
                <div className="h-16 w-16 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Si no hay usuario autenticado, no renderizar nada
    if (!isAuthenticated) return null;

    return children;
};

export default ProtectedRoute;