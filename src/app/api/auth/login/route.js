import { compare } from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';
import { createToken } from '@/app/utils/jwt';

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        
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

        // Generar un token JWT real
        const token = await createToken({
            id: user.id,
            email: user.email,
            rol: user.rol
        });

        // Modificar la respuesta para incluir el rol
        return new Response(JSON.stringify({
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol // Asegúrate de que este campo exista en tu base de datos
            },
            token: token
        }), { 
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        return new Response(
            JSON.stringify({ message: error.message || 'Error en la autenticación' }), 
            { status: 400 }
        );
    }
}