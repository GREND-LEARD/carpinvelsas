"use client";
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClientPortal() {
    const { user, hasRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!hasRole('client')) {
            router.push('/unauthorized');
        }
    }, []);

    return (
        <div>
            <h1>Portal del Cliente</h1>
            {/* Contenido del portal del cliente */}
        </div>
    );
}
