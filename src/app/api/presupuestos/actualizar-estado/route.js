import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { verifyToken } from '@/app/utils/jwt';

// Estados y su correspondiente progreso por defecto
const PROGRESO_POR_ESTADO = {
    'pendiente': 10,
    'en_proceso': 30,
    'aceptado': 50,
    'completado': 100,
    'rechazado': 0
};

// Mensajes automáticos según el estado
const MENSAJES_ESTADO = {
    'pendiente': 'Hemos recibido tu solicitud y será revisada pronto por nuestro equipo.',
    'en_proceso': 'Tu presupuesto está siendo evaluado por nuestro equipo técnico. Te informaremos cuando tengamos una decisión.',
    'aceptado': '¡Buenas noticias! Tu presupuesto ha sido aprobado. Nos pondremos en contacto contigo para coordinar los próximos pasos.',
    'completado': '¡Proyecto completado con éxito! Gracias por confiar en nosotros. Esperamos que disfrutes de tu nuevo mueble.',
    'rechazado': 'Lamentamos informarte que no podemos proceder con tu presupuesto en los términos actuales. Te invitamos a contactarnos para discutir alternativas.'
};

// Etapas correspondientes a cada estado
const ETAPA_POR_ESTADO = {
    'pendiente': 'Solicitud recibida, pendiente de revisión',
    'en_proceso': 'Presupuesto en evaluación por el equipo técnico',
    'aceptado': 'Proyecto aprobado y en planificación',
    'completado': 'Proyecto finalizado',
    'rechazado': 'Presupuesto rechazado'
};

export async function PUT(request) {
    try {
        // Verificar autenticación
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json(
                { message: 'No se proporcionó token de autenticación' },
                { status: 401 }
            );
        }
        
        const token = authHeader.split(' ')[1];
        
        // Validar token
        let decoded;
        try {
            decoded = await verifyToken(token);
        } catch (tokenError) {
            return NextResponse.json(
                { message: 'Token inválido o expirado', error: tokenError.message },
                { status: 401 }
            );
        }
        
        if (!decoded || !decoded.id) {
            return NextResponse.json(
                { message: 'Token inválido o malformado' },
                { status: 401 }
            );
        }
        
        // Verificar rol de administrador
        const { data: usuario, error: userError } = await supabase
            .from('usuarios')
            .select('rol')
            .eq('id', decoded.id)
            .single();
        
        if (userError) {
            return NextResponse.json(
                { message: 'Error al verificar permisos de usuario', error: userError.message },
                { status: 500 }
            );
        }
        
        if (!usuario || usuario.rol !== 'admin') {
            return NextResponse.json(
                { message: 'Acceso denegado. Se requieren permisos de administrador' },
                { status: 403 }
            );
        }
        
        // Obtener datos del presupuesto a actualizar
        const requestData = await request.json();
        const { presupuestoId, estado, mensaje, progreso } = requestData;
        
        if (!presupuestoId || !estado) {
            return NextResponse.json(
                { message: 'Se requiere el ID del presupuesto y el nuevo estado' },
                { status: 400 }
            );
        }
        
        // Preparar datos para actualización
        const datosActualizacion = { 
            estado, 
            fecha_actualizacion: new Date().toISOString()
        };
        
        // Añadir o actualizar información de progreso
        let porcentajeProgreso = progreso;
        if (typeof porcentajeProgreso !== 'number') {
            porcentajeProgreso = PROGRESO_POR_ESTADO[estado] || 0;
        }
        
        // Asegurarnos de que el campo progreso exista en la tabla
        try {
            datosActualizacion.progreso = {
                porcentaje: porcentajeProgreso,
                etapa_actual: ETAPA_POR_ESTADO[estado] || `Estado: ${estado}`,
                fecha_actualizacion: new Date().toISOString()
            };
            
            if (estado === 'completado') {
                datosActualizacion.progreso.fecha_completado = new Date().toISOString();
            }
        } catch (e) {
            console.warn('Error al preparar datos de progreso:', e.message);
        }
        
        // Actualizar estado del presupuesto
        const { data: presupuesto, error: updateError } = await supabase
            .from('presupuestos')
            .update(datosActualizacion)
            .eq('id', presupuestoId)
            .select()
            .single();
        
        if (updateError) {
            return NextResponse.json(
                { message: 'Error al actualizar el estado del presupuesto', error: updateError.message },
                { status: 500 }
            );
        }
        
        // Añadir registro en tabla de progreso si existe
        try {
            const { error: tableCheckError } = await supabase
                .from('progreso_presupuestos')
                .select('id')
                .limit(1);
                
            if (!tableCheckError) {
                await supabase
                    .from('progreso_presupuestos')
                    .insert({
                        presupuesto_id: presupuestoId,
                        porcentaje: porcentajeProgreso,
                        etapa_actual: ETAPA_POR_ESTADO[estado] || `Estado: ${estado}`,
                        fecha: new Date().toISOString()
                    });
            }
        } catch (e) {
            console.warn('No se pudo registrar progreso en tabla separada:', e.message);
        }
        
        // Añadir mensaje automático sobre el cambio de estado
        try {
            const { error: tableCheckError } = await supabase
                .from('mensajes_presupuestos')
                .select('id')
                .limit(1);
                
            if (!tableCheckError) {
                // Usar mensaje proporcionado o mensaje automático
                const mensajeTexto = mensaje || MENSAJES_ESTADO[estado] || `El estado del presupuesto ha cambiado a: ${estado}`;
                
                await supabase
                    .from('mensajes_presupuestos')
                    .insert({
                        presupuesto_id: presupuestoId,
                        texto: mensajeTexto,
                        emisor: 'admin',
                        fecha: new Date().toISOString()
                    });
            }
        } catch (e) {
            console.warn('No se pudo crear mensaje automático:', e.message);
        }
        
        return NextResponse.json({
            message: 'Estado del presupuesto actualizado correctamente',
            presupuesto
        });
        
    } catch (error) {
        return NextResponse.json(
            { message: 'Error interno del servidor', error: error.message },
            { status: 500 }
        );
    }
} 