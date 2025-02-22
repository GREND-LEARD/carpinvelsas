import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, hasRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        // Redirección basada en roles
        if (hasRole('admin')) {
            router.push('/dashboard');
        } else if (hasRole('client')) {
            router.push('/client-portal');
        }
    }, [user]);

    return children;
};