'use client';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) router.push('/login');
    }, [user]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/textura-madera.jpg')] bg-cover bg-center p-4">
            <div className="max-w-md w-full mx-auto p-8 bg-amber-50/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-amber-100">
                <h1 className="text-3xl font-bold text-amber-900 mb-8 text-center font-serif">
                    Bienvenido, {user?.nombre}!
                </h1>
                <p className="text-amber-700 text-center">
                    Has accedido al taller de CARPINVEL.
                </p>
            </div>
        </div>
    );
}