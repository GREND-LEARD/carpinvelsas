import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { verifyToken } from '@/app/utils/jwt';

export async function POST(request) {
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
        
        // Obtener datos de la solicitud
        const { rol } = await request.json();
        
        if (!rol) {
            return NextResponse.json(
                { message: 'Se requiere especificar el rol' },
                { status: 400 }
            );
        }
        
        // Actualizar rol en la base de datos
        const { data: usuario, error: updateError } = await supabase
            .from('usuarios')
            .update({ rol })
            .eq('id', decoded.id)
            .select('id, nombre, email, rol')
            .single();
            
        if (updateError) {
            return NextResponse.json(
                { message: 'Error al actualizar rol', error: updateError.message },
                { status: 500 }
            );
        }
        
        return NextResponse.json({
            message: 'Rol actualizado correctamente',
            usuario
        });
        
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor', error: error.message },
            { status: 500 }
        );
    }
} 