'use client';
import AuthForm from '@/app/components/AuthForm';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/textura-madera-2.jpg')] bg-cover bg-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <AuthForm isLogin={false} />
        </div>
    );
}