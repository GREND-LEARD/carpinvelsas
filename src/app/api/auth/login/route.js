import { compare } from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Validar datos de entrada
        if (!email || !password) {
            return new Response(
                JSON.stringify({ message: 'Email y contraseña son requeridos' }), 
                { status: 400 }
            );
        }

        // Buscar usuario por email
        const { data: user, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return new Response(
                JSON.stringify({ message: 'Usuario no encontrado' }), 
                { status: 401 }
            );
        }

        // Verificar contraseña
        const validPassword = await compare(password, user.contraseña);
        if (!validPassword) {
            return new Response(
                JSON.stringify({ message: 'Contraseña incorrecta' }), 
                { status: 401 }
            );
        }

        // Eliminar la contraseña del objeto usuario antes de enviarlo
        delete user.contraseña;

        return new Response(JSON.stringify({
            message: 'Login exitoso',
            user: user
        }), { status: 200 });

    } catch (error) {
        console.error('Error en login:', error);
        return new Response(
            JSON.stringify({ message: 'Error del servidor' }), 
            { status: 500 }
        );
    }
}