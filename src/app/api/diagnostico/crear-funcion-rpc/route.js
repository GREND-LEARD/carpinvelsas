import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { verifyToken } from '@/app/utils/jwt';

export async function POST(request) {
    console.log("🛠️ Configurando función RPC en Supabase");
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
        const tokenData = await verifyToken(token);
        
        if (!tokenData || !tokenData.id) {
            return NextResponse.json(
                { error: "Token inválido o expirado" },
                { status: 401 }
            );
        }
        
        // Verificar si es admin
        const { data: usuario, error: userError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', tokenData.id)
            .single();
            
        if (userError || !usuario) {
            return NextResponse.json(
                { error: "Error al verificar permisos de administrador" },
                { status: 403 }
            );
        }
        
        const esAdmin = usuario.rol === 'admin' || usuario.admin === true;
        if (!esAdmin) {
            return NextResponse.json(
                { error: "Solo los administradores pueden crear funciones RPC" },
                { status: 403 }
            );
        }
        
        // Crear la función RPC en Supabase
        const crearFuncionSQL = `
            CREATE OR REPLACE FUNCTION get_all_presupuestos_admin()
            RETURNS SETOF presupuestos
            LANGUAGE plpgsql
            SECURITY DEFINER -- Importante: Ejecuta con los permisos del creador
            AS $$
            BEGIN
                RETURN QUERY
                SELECT * FROM presupuestos
                ORDER BY fecha_creacion DESC;
            END;
            $$;
            
            -- Comentar si no se desea crear una segunda función
            CREATE OR REPLACE FUNCTION get_presupuestos_by_usuario(usuario_id_param UUID)
            RETURNS SETOF presupuestos
            LANGUAGE plpgsql
            SECURITY DEFINER
            AS $$
            BEGIN
                RETURN QUERY
                SELECT * FROM presupuestos
                WHERE usuario_id = usuario_id_param OR user_id = usuario_id_param
                ORDER BY fecha_creacion DESC;
            END;
            $$;
        `;
        
        try {
            // Ejecutar la consulta SQL para crear la función
            const { data, error } = await supabase.rpc('exec_sql', { sql: crearFuncionSQL });
            
            if (error) {
                console.error("❌ Error al crear función RPC:", error);
                
                // Si falla porque la función exec_sql no existe, mostrar un mensaje específico
                if (error.message.includes('exec_sql')) {
                    return NextResponse.json({
                        success: false,
                        message: "La función exec_sql no está habilitada en tu instancia de Supabase",
                        error: error.message,
                        manual_steps: `
                            Para crear las funciones manualmente, sigue estos pasos:
                            1. Ve al dashboard de Supabase
                            2. Selecciona "SQL Editor"
                            3. Crea un nuevo query y pega el siguiente código:
                            
                            ${crearFuncionSQL}
                            
                            4. Ejecuta la consulta
                        `
                    });
                }
                
                return NextResponse.json({
                    success: false,
                    message: "Error al crear función RPC",
                    error: error.message
                }, { status: 500 });
            }
            
            return NextResponse.json({
                success: true,
                message: "Funciones RPC creadas correctamente",
                data: data
            });
            
        } catch (sqlError) {
            console.error("❌ Error al ejecutar SQL:", sqlError);
            
            return NextResponse.json({
                success: false,
                message: "Error al ejecutar SQL para crear función",
                error: sqlError.message,
                sql: crearFuncionSQL
            }, { status: 500 });
        }
        
    } catch (error) {
        console.error("❌ Error general:", error);
        
        return NextResponse.json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        }, { status: 500 });
    }
} 