import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { verifyToken } from '@/app/utils/jwt';

export async function GET(request) {
    try {
        // Verificar autenticación
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { message: 'No autorizado: Token no proporcionado' },
                { status: 401 }
            );
        }
        
        const token = authHeader.split(' ')[1];
        
        // Verificar token
        let decoded;
        try {
            decoded = await verifyToken(token);
            console.log('DEBUG - Token decodificado:', {
                id: decoded.id,
                email: decoded.email,
                rol: decoded.rol
            });
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
        
        // Obtener información del usuario desde la base de datos
        const { data: usuario, error: userError } = await supabase
            .from('usuarios')
            .select('id, nombre, email, rol')
            .eq('id', decoded.id)
            .single();
            
        if (userError) {
            return NextResponse.json(
                { message: 'Error al consultar usuario en la base de datos', error: userError.message },
                { status: 500 }
            );
        }
        
        if (!usuario) {
            return NextResponse.json(
                { message: 'Usuario no encontrado en la base de datos' },
                { status: 404 }
            );
        }
        
        // Comparar la información del token con la base de datos
        return NextResponse.json({
            message: 'Información de usuario',
            token_info: {
                id: decoded.id,
                email: decoded.email || 'No proporcionado en el token',
                rol: decoded.rol || 'No proporcionado en el token'
            },
            database_info: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol || 'No especificado'
            },
            rol_correcto: decoded.rol === usuario.rol,
            token_completo: decoded
        });
        
    } catch (error) {
        console.error('Error en debug usuario:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor', error: error.message },
            { status: 500 }
        );
    }
} 