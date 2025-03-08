import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { verifyToken, createToken } from '@/app/utils/jwt';

export async function POST(request) {
    try {
        // Verificar autenticación actual
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { message: 'No autorizado: Token no proporcionado' },
                { status: 401 }
            );
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verificar token actual
        let decoded;
        try {
            decoded = await verifyToken(token);
        } catch (error) {
            return NextResponse.json(
                { message: 'Token inválido o expirado', error: error.message },
                { status: 401 }
            );
        }
        
        if (!decoded || !decoded.id) {
            return NextResponse.json(
                { message: 'Token inválido o malformado' },
                { status: 401 }
            );
        }
        
        // Obtener datos actualizados del usuario
        const { data: usuario, error: userError } = await supabase
            .from('usuarios')
            .select('id, email, nombre, rol')
            .eq('id', decoded.id)
            .single();
            
        if (userError || !usuario) {
            return NextResponse.json(
                { message: 'Error al obtener datos de usuario', error: userError?.message || 'Usuario no encontrado' },
                { status: 500 }
            );
        }
        
        // Crear nuevo token con datos actualizados
        const nuevoToken = await createToken({
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol || 'user' // Usar el rol actualizado de la BD
        });
        
        return NextResponse.json({
            message: 'Token regenerado correctamente',
            token: nuevoToken,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
                rol: usuario.rol
            }
        });
        
    } catch (error) {
        console.error('Error al refrescar token:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor', error: error.message },
            { status: 500 }
        );
    }
} 