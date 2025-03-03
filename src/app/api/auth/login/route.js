import { compare } from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';
import { createToken } from '@/app/utils/jwt';

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        
        // Validar datos de entrada
        if (!email || !password) {
            return Response.json(
                { message: 'Email y contraseña son requeridos' }, 
                { status: 400 }
            );
        }

        // Buscar usuario por email
        const { data: user, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            console.error('Error al buscar usuario:', error);
            return Response.json(
                { message: 'Usuario no encontrado' }, 
                { status: 401 }
            );
        }

        if (!user) {
            return Response.json(
                { message: 'Usuario no encontrado' }, 
                { status: 401 }
            );
        }

        // Verificar si existe el campo de contraseña
        if (!user.password_hash) {
            console.error('No se encontró campo de password_hash en el usuario');
            return Response.json(
                { message: 'Error en la estructura de usuario' }, 
                { status: 500 }
            );
        }

        // Verificar contraseña
        const validPassword = await compare(password, user.password_hash);
        
        if (!validPassword) {
            return Response.json(
                { message: 'Contraseña incorrecta' }, 
                { status: 401 }
            );
        }

        // Crear objeto de usuario para la respuesta
        const userData = {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            rol: user.rol || 'usuario'
        };

        // Generar token JWT
        const token = await createToken({
            id: user.id,
            email: user.email,
            rol: userData.rol
        });

        return Response.json({
            user: userData,
            token: token
        }, { status: 200 });
    } catch (error) {
        console.error('Error en login:', error);
        return Response.json(
            { message: error.message || 'Error en la autenticación' }, 
            { status: 500 }
        );
    }
}