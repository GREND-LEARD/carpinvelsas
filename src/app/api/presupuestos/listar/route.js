import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { verifyToken } from '@/app/utils/jwt';

export async function GET(request) {
    console.log("🔍 Iniciando API de listado de presupuestos");
    try {
        // Obtener parámetros de consulta
        const { searchParams } = new URL(request.url);
        const estado = searchParams.get('estado');
        const desde = searchParams.get('desde');
        const hasta = searchParams.get('hasta');
        const limite = parseInt(searchParams.get('limite') || '100');

        // Iniciar log de consulta
        console.log("📊 Parámetros de consulta:", { estado, desde, hasta, limite });
        
        // Validar token
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ 
                message: 'No autorizado', 
                presupuestos: [] 
            }, { status: 401 });
        }
        
        const token = authHeader.split(' ')[1];
        try {
            // Verificar el token
            const decoded = await verifyToken(token);
            console.log(`👤 Usuario autenticado: ${decoded.id}, Email: ${decoded.email || 'no disponible'}`);
            
            // Obtener información del usuario para verificar si es admin
            const { data: usuario, error: userError } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', decoded.id)
                .single();
                
            if (userError) {
                console.error("❌ Error al obtener usuario:", userError);
                return NextResponse.json({ 
                    message: 'Error al verificar permisos', 
                    error: userError.message,
                    presupuestos: []
                }, { status: 500 });
            }
            
            // Verificar si es admin - SOLUCIÓN: Aceptar tanto el campo 'rol' como el boolean 'admin'
            const esAdmin = usuario.rol === 'admin' || usuario.admin === true;
            console.log(`🔑 Usuario ${usuario.email} es admin: ${esAdmin ? 'Sí' : 'No'}, Rol: ${usuario.rol}, Admin flag: ${usuario.admin}`);
            
            // SOLUCIÓN: Consultar presupuestos directamente para administradores
            if (esAdmin) {
                console.log("👑 El usuario es administrador - Mostrando TODOS los presupuestos");
                
                // Consulta sin restricción de usuario para administradores
                let query = supabase
                    .from('presupuestos')
                    .select('*')
                    .order('fecha_creacion', { ascending: false })
                    .limit(limite);
                
                // Aplicar filtros opcionales
                if (estado && estado !== 'todos') {
                    query = query.eq('estado', estado);
                }
                
                if (desde) {
                    query = query.gte('fecha_creacion', desde);
                }
                
                if (hasta) {
                    query = query.lte('fecha_creacion', hasta);
                }
                
                const { data: presupuestos, error: presupuestosError } = await query;
                
                if (presupuestosError) {
                    console.error("❌ Error al obtener presupuestos para admin:", presupuestosError);
                    
                    // SOLUCIÓN: Incluso con error, vamos a intentar una consulta alternativa
                    try {
                        console.log("🔄 Intentando consulta directa sin RLS para administrador");
                        // Intentar una consulta SQL directa evitando RLS
                        const { data: presupuestosRaw } = await supabase.rpc('get_all_presupuestos_admin');
                        
                        return NextResponse.json({
                            message: 'Presupuestos recuperados mediante consulta alternativa',
                            presupuestos: presupuestosRaw || [],
                            total: presupuestosRaw?.length || 0,
                            error_original: presupuestosError.message
                        });
                    } catch (directError) {
                        console.error("❌ Error también en consulta alternativa:", directError);
                        // Seguir con el flujo normal y devolver el error original
                    }
                    
                    return NextResponse.json({
                        message: 'Error al obtener presupuestos',
                        error: presupuestosError.message,
                        presupuestos: []
                    }, { status: 500 });
                }
                
                console.log(`✅ Éxito: ${presupuestos?.length || 0} presupuestos encontrados para admin`);
                return NextResponse.json({
                    message: 'Presupuestos recuperados correctamente para administrador',
                    presupuestos: presupuestos || [],
                    total: presupuestos?.length || 0
                });
            } 
            
            // Para usuarios normales, mantener el comportamiento original
            console.log("👤 El usuario NO es administrador - Mostrando solo sus presupuestos");
            
            // Intentar consulta usando usuario_id
            console.log("🔍 Intentando consulta con usuario_id");
            const { data: presupuestosUsuarioId, error: errorUsuarioId } = await supabase
                .from('presupuestos')
                .select('*')
                .eq('usuario_id', decoded.id)
                .order('fecha_creacion', { ascending: false })
                .limit(limite);
                
            if (!errorUsuarioId && presupuestosUsuarioId && presupuestosUsuarioId.length > 0) {
                console.log(`✅ Éxito: ${presupuestosUsuarioId.length} presupuestos encontrados con usuario_id`);
                return NextResponse.json({
                    message: 'Presupuestos recuperados correctamente con usuario_id',
                    presupuestos: presupuestosUsuarioId,
                    total: presupuestosUsuarioId.length
                });
            }
            
            // Si no hay resultados o hay error, intentar con user_id
            console.log("🔍 Intentando consulta alternativa con user_id");
            const { data: presupuestosUserId, error: errorUserId } = await supabase
                .from('presupuestos')
                .select('*')
                .eq('user_id', decoded.id)
                .order('fecha_creacion', { ascending: false })
                .limit(limite);
                
            if (!errorUserId && presupuestosUserId && presupuestosUserId.length > 0) {
                console.log(`✅ Éxito: ${presupuestosUserId.length} presupuestos encontrados con user_id`);
                return NextResponse.json({
                    message: 'Presupuestos recuperados correctamente con user_id',
                    presupuestos: presupuestosUserId,
                    total: presupuestosUserId.length
                });
            }
            
            // Si ambas consultas fallaron, devolver array vacío con los errores
            const errores = [];
            if (errorUsuarioId) errores.push(`Error con usuario_id: ${errorUsuarioId.message}`);
            if (errorUserId) errores.push(`Error con user_id: ${errorUserId.message}`);
            
            console.log("⚠️ Ambas consultas fallaron o no hay presupuestos");
            return NextResponse.json({
                message: 'No se encontraron presupuestos para este usuario',
                errores: errores.length > 0 ? errores : undefined,
                presupuestos: [],
                total: 0
            });
            
        } catch (tokenError) {
            console.error("❌ Error al verificar el token:", tokenError);
            return NextResponse.json({ 
                message: 'Token inválido o expirado', 
                presupuestos: [] 
            }, { status: 401 });
        }
    } catch (error) {
        console.error("❌ Error general en API de presupuestos:", error);
        return NextResponse.json({ 
            message: 'Error del servidor', 
            error: error.message,
            presupuestos: [] 
        }, { status: 500 });
    }
} 