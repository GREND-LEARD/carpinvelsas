'use client';
import ClientNavBar from '@/components/layout/ClientNavBar';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

export default function ClientPortalLayout({ children }) {
    return (
        <ProtectedRoute allowedRoles={['client']}>
            <div className="min-h-screen bg-[url('/textura-madera.jpg')] bg-cover bg-fixed">
                <div className="min-h-screen backdrop-blur-xl bg-amber-900/30">
                    <ClientNavBar />
                    <AnimatePresence mode="wait">
                        <motion.main
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="container mx-auto px-4 py-8"
                        >
                            {children}
                        </motion.main>
                    </AnimatePresence>
                </div>
            </div>
        </ProtectedRoute>
    );
} 