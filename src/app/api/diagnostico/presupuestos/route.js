import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { verifyToken } from '@/app/utils/jwt';

export async function GET(request) {
    console.log("📊 Iniciando diagnóstico de presupuestos");
    
    try {
        // Verificar el token de autenticación
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: "No autorizado - Token no proporcionado" },
                { status: 401 }
            );
        }
        
        const token = authHeader.split(' ')[1];
        let tokenData;
        let tokenValido = false;
        let tokenUserId = null;
        
        try {
            tokenData = await verifyToken(token);
            tokenValido = !!tokenData;
            tokenUserId = tokenData?.id;
            console.log(`🔐 Token verificado para usuario ID: ${tokenData?.id}`);
        } catch (tokenError) {
            console.error("❌ Error al verificar token:", tokenError);
        }
        
        if (!tokenValido || !tokenUserId) {
            return NextResponse.json(
                { error: "Token inválido o expirado" },
                { status: 401 }
            );
        }
        
        // Obtener información del usuario
        const { data: usuario, error: userError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', tokenUserId)
            .single();
            
        let usuarioInfo = {
            error: userError ? userError.message : null
        };
        
        if (usuario) {
            usuarioInfo = usuario;
            console.log(`👤 Usuario: ${usuario.email}, Rol: ${usuario.rol}, Admin: ${usuario.admin}`);
        } else {
            console.error("❌ Error al obtener información del usuario:", userError);
        }
        
        // Verificar estructura de la tabla presupuestos
        const { data: columnas, error: columnasError } = await supabase
            .from('information_schema.columns')
            .select('column_name, data_type, is_nullable')
            .eq('table_name', 'presupuestos')
            .eq('table_schema', 'public');
        
        let estructuraTabla = {
            error: columnasError ? columnasError.message : null,
            columnas: columnas,
            tieneUsuarioId: false,
            tieneUserId: false,
            camposUsuarioEncontrados: {}
        };
        
        if (columnas && columnas.length > 0) {
            estructuraTabla.tieneUsuarioId = columnas.some(col => col.column_name === 'usuario_id');
            estructuraTabla.tieneUserId = columnas.some(col => col.column_name === 'user_id');
            console.log(`🔍 Estructura de la tabla: usuario_id(${estructuraTabla.tieneUsuarioId}), user_id(${estructuraTabla.tieneUserId})`);
        }
        
        // Intentar obtener presupuestos usando la API normal (sin bypass)
        let presupuestosAPI = [];
        let presupuestosAPIError = null;
        
        try {
            // Simular una llamada a la API normal con el token
            const apiResponse = await fetch(new URL('/api/presupuestos/listar', request.url).toString(), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (apiResponse.ok) {
                const apiData = await apiResponse.json();
                presupuestosAPI = apiData.presupuestos || [];
                console.log(`🔄 Obtenidos ${presupuestosAPI.length} presupuestos a través de la API`);
            } else {
                presupuestosAPIError = `Error ${apiResponse.status}: ${apiResponse.statusText}`;
                console.error("❌ Error al obtener presupuestos via API:", presupuestosAPIError);
            }
        } catch (apiError) {
            presupuestosAPIError = apiError.message;
            console.error("❌ Error al llamar a la API de presupuestos:", apiError);
        }
        
        // Obtener todos los presupuestos directamente (bypasseando RLS)
        const { data: presupuestos, error: presupuestosError } = await supabase
            .from('presupuestos')
            .select('*')
            .order('fecha_creacion', { ascending: false });
            
        let cantidadPresupuestos = presupuestos ? presupuestos.length : 0;
        console.log(`📋 Total de presupuestos en la BD: ${cantidadPresupuestos}`);
        
        // Analizar qué campos de usuario se están usando
        if (presupuestos && presupuestos.length > 0) {
            const presupuestosConUsuarioId = presupuestos.filter(p => p.usuario_id).length;
            const presupuestosConUserId = presupuestos.filter(p => p.user_id).length;
            
            estructuraTabla.presupuestosConUsuarioId = presupuestosConUsuarioId;
            estructuraTabla.presupuestosConUserId = presupuestosConUserId;
            
            if (presupuestosConUsuarioId > 0) {
                estructuraTabla.camposUsuarioEncontrados.usuario_id = presupuestosConUsuarioId;
            }
            
            if (presupuestosConUserId > 0) {
                estructuraTabla.camposUsuarioEncontrados.user_id = presupuestosConUserId;
            }
            
            console.log(`🔍 Presupuestos con usuario_id: ${presupuestosConUsuarioId}, con user_id: ${presupuestosConUserId}`);
        }
        
        // Verificar presupuestos del usuario actual
        let presupuestosUsuario = [];
        let presupuestosUsuarioError = null;
        
        if (tokenUserId) {
            // Intentar con usuario_id
            const { data: userBudgets1, error: userBudgetsError1 } = await supabase
                .from('presupuestos')
                .select('*')
                .eq('usuario_id', tokenUserId);
                
            // Intentar con user_id
            const { data: userBudgets2, error: userBudgetsError2 } = await supabase
                .from('presupuestos')
                .select('*')
                .eq('user_id', tokenUserId);
                
            const budgets1 = userBudgets1 || [];
            const budgets2 = userBudgets2 || [];
            
            presupuestosUsuario = [...budgets1, ...budgets2];
            
            if (userBudgetsError1 && userBudgetsError2) {
                presupuestosUsuarioError = `Error con usuario_id: ${userBudgetsError1.message}, Error con user_id: ${userBudgetsError2.message}`;
            }
            
            console.log(`👤 Presupuestos del usuario actual: ${presupuestosUsuario.length}`);
        }
        
        // Obtener las políticas RLS
        let politicasRLS = [];
        let politicasError = null;
        
        try {
            const { data: policies, error: policiesError } = await supabase
                .from('pg_policies')
                .select('*')
                .eq('tablename', 'presupuestos');
                
            if (policies) {
                politicasRLS = policies;
                console.log(`🔒 Se encontraron ${policies.length} políticas RLS para presupuestos`);
            } else if (policiesError) {
                politicasError = policiesError.message;
                console.error("❌ Error al obtener políticas RLS:", policiesError);
            }
        } catch (policyError) {
            politicasError = policyError.message;
            console.error("❌ Error al consultar políticas:", policyError);
        }
        
        return NextResponse.json({
            tokenValido,
            tokenUserId,
            usuario: usuarioInfo,
            estructuraTabla,
            presupuestos,
            presupuestosError: presupuestosError ? presupuestosError.message : null,
            presupuestosUsuario,
            presupuestosUsuarioError,
            presupuestosAPI,
            presupuestosAPIError,
            politicasRLS,
            politicasError,
            cantidad_presupuestos: cantidadPresupuestos,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error("❌ Error en diagnóstico:", error);
        return NextResponse.json(
            { 
                error: error.message || "Error al realizar el diagnóstico",
                stack: error.stack,
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
} 