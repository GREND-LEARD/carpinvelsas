'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.message) {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setFormData({ name: '', email: '', message: '' });
            }, 3000);
        } else {
            alert("Por favor, completa todos los campos.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('https://www.toptal.com/designers/subtlepatterns/uploads/wood_pattern.png')] bg-repeat">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="bg-white/90 p-11 rounded-lg shadow-lg w-[350px] text-center"
            >
                <h2 className="font-serif text-[#5a3e1b] text-2xl mb-4">Contacto - Carpintería</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Tu Nombre"
                        className="w-full p-2.5 border-2 border-[#8b5a2b] rounded-md text-base bg-[#fff8f0]"
                    />
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="Tu Correo"
                        className="w-full p-2.5 border-2 border-[#8b5a2b] rounded-md text-base bg-[#fff8f0]"
                    />
                    <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tu Mensaje"
                        className="w-full p-2.5 border-2 border-[#8b5a2b] rounded-md text-base bg-[#fff8f0] h-[100px] resize-none"
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#8b5a2b] text-white p-2.5 rounded-md text-base cursor-pointer hover:bg-[#6d4420] transition-all hover:scale-105"
                    >
                        Enviar
                    </button>
                </form>
                {showSuccess && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-600 mt-2.5"
                    >
                        ¡Mensaje enviado con éxito!
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
}