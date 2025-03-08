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
        } catch (error) {
            return NextResponse.json(
                { message: 'Token inválido o expirado' },
                { status: 401 }
            );
        }
        
        // Obtener el ID del presupuesto
        const url = new URL(request.url);
        const presupuestoId = url.searchParams.get('id');
        
        if (!presupuestoId) {
            return NextResponse.json(
                { message: 'Se requiere el ID del presupuesto' },
                { status: 400 }
            );
        }
        
        // Verificar que el usuario existe
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
        
        // Consultar el presupuesto
        let query = supabase
            .from('presupuestos')
            .select('*')
            .eq('id', presupuestoId);
            
        // Si no es admin, verificar que el presupuesto pertenezca al usuario
        if (usuario.rol !== 'admin') {
            query = query.eq('usuario_id', usuario.id);
        }
        
        const { data: presupuesto, error: presupuestoError } = await query.single();
        
        if (presupuestoError) {
            // Si es error por no encontrar el presupuesto
            if (presupuestoError.code === 'PGRST116') {
                return NextResponse.json(
                    { message: 'Presupuesto no encontrado o no tienes permisos para verlo' },
                    { status: 404 }
                );
            }
            
            // Si es error por tabla no existente
            if (presupuestoError.message && presupuestoError.message.includes('does not exist')) {
                return NextResponse.json(
                    { 
                        message: 'La tabla de presupuestos no existe',
                        error: presupuestoError.message,
                        tabla_no_existe: true
                    },
                    { status: 404 }
                );
            }
            
            // Otros errores
            return NextResponse.json(
                { message: 'Error al consultar presupuesto', error: presupuestoError.message },
                { status: 500 }
            );
        }
        
        // Obtener mensajes relacionados con el presupuesto (si existe la tabla)
        try {
            const { data: mensajes, error: mensajesError } = await supabase
                .from('mensajes_presupuestos')
                .select('*')
                .eq('presupuesto_id', presupuestoId)
                .order('fecha', { ascending: true });
                
            // Si hay mensajes y no hubo error, adjuntarlos al presupuesto
            if (!mensajesError && mensajes) {
                presupuesto.mensajes = mensajes;
            }
        } catch (error) {
            // No hacer nada, simplemente no habrá mensajes
            console.log('La tabla de mensajes no existe o error al consultar mensajes');
        }
        
        // Obtener progreso si el presupuesto está en proceso
        if (presupuesto.estado === 'en_proceso' || presupuesto.estado === 'completado') {
            try {
                const { data: progreso, error: progresoError } = await supabase
                    .from('progreso_presupuestos')
                    .select('*')
                    .eq('presupuesto_id', presupuestoId)
                    .order('fecha', { ascending: false })
                    .limit(1)
                    .single();
                    
                // Si hay datos de progreso y no hubo error, adjuntarlos al presupuesto
                if (!progresoError && progreso) {
                    presupuesto.progreso = progreso;
                } else {
                    // Si no hay datos de progreso específicos, crear uno genérico
                    presupuesto.progreso = {
                        porcentaje: presupuesto.estado === 'completado' ? 100 : 50,
                        etapa_actual: presupuesto.estado === 'completado' ? 
                            'Proyecto completado' : 'En fabricación',
                        siguiente_actualizacion: presupuesto.estado === 'completado' ? 
                            'N/A - Proyecto terminado' : 'Próximamente'
                    };
                }
            } catch (error) {
                // Si hay error, crear progreso genérico
                presupuesto.progreso = {
                    porcentaje: presupuesto.estado === 'completado' ? 100 : 50,
                    etapa_actual: presupuesto.estado === 'completado' ? 
                        'Proyecto completado' : 'En fabricación',
                    siguiente_actualizacion: presupuesto.estado === 'completado' ? 
                        'N/A - Proyecto terminado' : 'Próximamente'
                };
            }
        }
        
        return NextResponse.json({
            message: 'Presupuesto obtenido correctamente',
            presupuesto
        });
        
    } catch (error) {
        console.error('Error al obtener detalles del presupuesto:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor', error: error.message },
            { status: 500 }
        );
    }
} 