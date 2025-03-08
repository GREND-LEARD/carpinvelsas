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
                { message: 'Token inválido o expirado' },
                { status: 401 }
            );
        }
        
        // Verificar que el usuario existe y es admin
        const { data: usuario, error: userError } = await supabase
            .from('usuarios')
            .select('id, rol')
            .eq('id', decoded.id)
            .single();
            
        if (userError || !usuario) {
            return NextResponse.json(
                { message: 'Error al verificar usuario', error: userError?.message || 'Usuario no encontrado' },
                { status: 404 }
            );
        }
        
        // Solo los administradores pueden enviar mensajes a través de este endpoint
        if (usuario.rol !== 'admin') {
            return NextResponse.json(
                { message: 'No autorizado: Se requieren privilegios de administrador' },
                { status: 403 }
            );
        }
        
        // Obtener datos del body
        const requestData = await request.json();
        const { presupuestoId, mensaje } = requestData;
        
        if (!presupuestoId || !mensaje || !mensaje.trim()) {
            return NextResponse.json(
                { message: 'Se requiere el ID del presupuesto y un mensaje' },
                { status: 400 }
            );
        }
        
        // Verificar que el presupuesto existe
        const { data: presupuestoCheck, error: presupuestoCheckError } = await supabase
            .from('presupuestos')
            .select('id')
            .eq('id', presupuestoId)
            .single();
            
        if (presupuestoCheckError) {
            // Si es un error porque el presupuesto no existe
            if (presupuestoCheckError.code === 'PGRST116') {
                return NextResponse.json(
                    { message: 'Presupuesto no encontrado' },
                    { status: 404 }
                );
            }
            
            // Si es error por tabla no existente
            if (presupuestoCheckError.message && presupuestoCheckError.message.includes('does not exist')) {
                return NextResponse.json(
                    { 
                        message: 'La tabla de presupuestos no existe',
                        error: presupuestoCheckError.message,
                        tabla_no_existe: true
                    },
                    { status: 404 }
                );
            }
            
            // Otros errores
            return NextResponse.json(
                { message: 'Error al verificar presupuesto', error: presupuestoCheckError.message },
                { status: 500 }
            );
        }
        
        // Verificar si existe la tabla de mensajes, si no, crearla
        let mensajesTableExists = true;
        try {
            const { error: tableCheckError } = await supabase
                .from('mensajes_presupuestos')
                .select('id')
                .limit(1);
                
            if (tableCheckError && tableCheckError.message.includes('does not exist')) {
                mensajesTableExists = false;
                
                // Crear tabla de mensajes
                await supabase.rpc('crear_tabla_mensajes_presupuestos');
                
                // Verificar que se haya creado correctamente
                const { error: checkAfterCreateError } = await supabase
                    .from('mensajes_presupuestos')
                    .select('id')
                    .limit(1);
                    
                if (checkAfterCreateError) {
                    throw new Error('No se pudo crear la tabla de mensajes');
                }
                
                mensajesTableExists = true;
            }
        } catch (error) {
            console.error('Error al verificar/crear tabla de mensajes:', error);
            
            // Intentar crear la tabla manualmente usando SQL
            try {
                await supabase.rpc('ejecutar_sql', {
                    sql_query: `
                        CREATE TABLE IF NOT EXISTS public.mensajes_presupuestos (
                            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                            presupuesto_id UUID REFERENCES public.presupuestos(id) ON DELETE CASCADE,
                            fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                            texto TEXT NOT NULL,
                            emisor VARCHAR(50) NOT NULL,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                        );
                    `
                });
                
                mensajesTableExists = true;
            } catch (sqlError) {
                console.error('Error al crear tabla con SQL:', sqlError);
                
                // Si también falla la creación manual, simular un éxito para desarrollo
                // pero advertir al usuario
                return NextResponse.json(
                    { 
                        message: 'Mensaje guardado en modo simulación (la tabla no existe)',
                        simulado: true,
                        error: error.message
                    },
                    { status: 200 }
                );
            }
        }
        
        // Añadir el mensaje
        if (mensajesTableExists) {
            const { data: mensajeData, error: mensajeError } = await supabase
                .from('mensajes_presupuestos')
                .insert({
                    presupuesto_id: presupuestoId,
                    texto: mensaje,
                    emisor: 'admin',
                    fecha: new Date().toISOString()
                })
                .select();
                
            if (mensajeError) {
                return NextResponse.json(
                    { message: 'Error al guardar el mensaje', error: mensajeError.message },
                    { status: 500 }
                );
            }
            
            return NextResponse.json({
                message: 'Mensaje guardado correctamente',
                data: mensajeData[0]
            });
        }
        
        // Si llegamos aquí, algo salió mal pero no sabemos exactamente qué
        return NextResponse.json(
            { message: 'No se pudo procesar el mensaje por un error desconocido' },
            { status: 500 }
        );
        
    } catch (error) {
        console.error('Error al procesar mensaje:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor', error: error.message },
            { status: 500 }
        );
    }
} 