import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { verifyToken } from '@/app/utils/jwt';

export async function GET(request) {
    try {
        console.log('API - Recibida solicitud para obtener presupuestos de usuario');
        
        // 1. Obtener y verificar el token de autenticación
        const token = request.headers.get('authorization')?.split(' ')[1];
        
        if (!token) {
            console.log('API - Error: No se proporcionó token');
            return NextResponse.json(
                { message: 'No se proporcionó token de autenticación' },
                { status: 401 }
            );
        }
        
        let decoded;
        try {
            decoded = await verifyToken(token);
            console.log('API - Token verificado para usuario ID:', decoded?.id);
        } catch (tokenError) {
            console.error('API - Error al verificar token:', tokenError);
            return NextResponse.json(
                { message: 'Token inválido o expirado' },
                { status: 401 }
            );
        }
        
        if (!decoded || !decoded.id) {
            console.log('API - Error: Token sin ID de usuario');
            return NextResponse.json(
                { message: 'Token inválido o malformado' },
                { status: 401 }
            );
        }
        
        // 2. Validar que el usuario existe
        console.log('API - Verificando usuario en Supabase');
        const { data: usuario, error: userError } = await supabase
            .from('usuarios')
            .select('id')
            .eq('id', decoded.id)
            .single();
        
        if (userError) {
            console.error('API - Error al buscar usuario:', userError);
            return NextResponse.json(
                { message: 'Error al verificar usuario', error: userError.message },
                { status: 500 }
            );
        }
        
        if (!usuario) {
            console.log('API - Error: Usuario no encontrado');
            return NextResponse.json(
                { message: 'Usuario no encontrado' },
                { status: 404 }
            );
        }
        
        // 3. Obtener parámetros de consulta
        const searchParams = request.nextUrl.searchParams;
        const estado = searchParams.get('estado');
        const orden = searchParams.get('orden') || 'desc';
        console.log('API - Parámetros:', { estado, orden });
        
        // Verificar si la tabla existe
        console.log('API - Verificando existencia de la tabla presupuestos');
        const { error: tableCheckError } = await supabase
            .from('presupuestos')
            .select('id')
            .limit(1);
            
        if (tableCheckError) {
            // Si hay un error específico de "relation does not exist"
            if (tableCheckError.message && tableCheckError.message.includes('does not exist')) {
                console.error('API - Error: La tabla presupuestos no existe:', tableCheckError);
                return NextResponse.json(
                    { 
                        message: 'La tabla de presupuestos no existe en la base de datos', 
                        error: tableCheckError.message,
                        tabla_no_existe: true,
                        presupuestos: [] // Devolver array vacío para que el cliente lo maneje
                    },
                    { status: 404 }
                );
            }
        }
        
        // 4. Consultar presupuestos del usuario
        console.log('API - Consultando presupuestos del usuario:', usuario.id);
        
        // Verificar que la conexión a Supabase funciona correctamente
        const { data: testData, error: testError } = await supabase
            .from('usuarios')
            .select('id')
            .eq('id', usuario.id)
            .single();
            
        if (testError) {
            console.error('API - Error en la conexión con Supabase:', testError);
            return NextResponse.json({
                message: 'Error de conexión con la base de datos',
                error: testError.message,
                presupuestos: []
            }, { status: 500 });
        }
            
        // Obtener la URL de Supabase para depuración
        const supabaseUrl = supabase.supabaseUrl;
        console.log('API - URL de Supabase:', supabaseUrl);
        
        // Intentar listar tablas (solo para depuración)
        try {
            const { data: tablas, error: errorTablas } = await supabase
                .rpc('listar_tablas_publicas');
                
            if (!errorTablas) {
                console.log('API - Tablas disponibles:', tablas);
            } else {
                console.log('API - No se pudieron listar las tablas:', errorTablas.message);
            }
        } catch (e) {
            console.log('API - Función listar_tablas_publicas no existe:', e.message);
        }
        
        // Probar un query directo
        try {
            console.log('API - Verificando tabla presupuestos con query directo');
            const { data: checkData, error: checkError } = await supabase
                .from('presupuestos')
                .select('id')
                .limit(1);
                
            if (checkError) {
                console.error('API - Error al verificar tabla presupuestos:', checkError);
            } else {
                console.log('API - La tabla presupuestos existe y es accesible');
            }
        } catch (e) {
            console.error('API - Error inesperado al verificar tabla:', e);
        }
        
        // Verificar la estructura de la tabla para saber qué campo usar
        console.log('API - Verificando estructura de la tabla presupuestos');
        let usarCampoUserId = false;
        
        try {
            const { data: columnInfo, error: columnError } = await supabase
                .from('information_schema.columns')
                .select('column_name')
                .eq('table_name', 'presupuestos')
                .eq('table_schema', 'public');
                
            if (!columnError && columnInfo) {
                console.log('API - Columnas encontradas en tabla presupuestos:', 
                    columnInfo.map(col => col.column_name).join(', '));
                
                // Comprobar si existe usuario_id o user_id
                const tieneUsuarioId = columnInfo.some(col => col.column_name === 'usuario_id');
                const tieneUserId = columnInfo.some(col => col.column_name === 'user_id');
                
                console.log('API - Tiene campo usuario_id:', tieneUsuarioId);
                console.log('API - Tiene campo user_id:', tieneUserId);
                
                // Si no hay usuario_id pero sí hay user_id, usamos ese campo
                if (!tieneUsuarioId && tieneUserId) {
                    usarCampoUserId = true;
                }
            }
        } catch (e) {
            console.warn('API - Error al verificar estructura de tabla:', e.message);
        }
        
        // Ahora consultar los presupuestos del usuario con el campo correcto
        let query;
        
        if (usarCampoUserId) {
            console.log('API - Usando campo user_id para consulta');
            
            query = supabase
                .from('presupuestos')
                .select('*')
                .eq('user_id', usuario.id)
                .order('fecha_creacion', { ascending: orden === 'asc' });
        } else {
            console.log('API - Usando campo usuario_id para consulta');
            
            query = supabase
                .from('presupuestos')
                .select('*')
                .eq('usuario_id', usuario.id)
                .order('fecha_creacion', { ascending: orden === 'asc' });
        }
        
        // Verificar el tipo de usuario.id
        console.log('API - Tipo de usuario.id:', typeof usuario.id);
        
        // Filtrar por estado si se especificó
        if (estado) {
            query = query.eq('estado', estado);
        }
        
        // Intentar también con el otro campo si la primera consulta falla
        let errorPrimerConsulta = null;
        let presupuestos = null;
        
        // Ejecutar la primera consulta
        console.log('API - Ejecutando primera consulta...');
        
        try {
            const { data: presupuestosData, error: presupuestosError } = await query;
            
            if (presupuestosError) {
                console.error('API - Error detallado al consultar presupuestos:', {
                    code: presupuestosError.code,
                    message: presupuestosError.message,
                    details: presupuestosError.details,
                    hint: presupuestosError.hint,
                    userId: usuario.id
                });
                
                errorPrimerConsulta = presupuestosError;
            } else {
                presupuestos = presupuestosData;
            }
        } catch (e) {
            console.error('API - Error inesperado al consultar presupuestos:', e);
            errorPrimerConsulta = e;
        }
        
        // Si la primera consulta falló, intentar con el otro campo (usuario_id <-> user_id)
        if (errorPrimerConsulta && !presupuestos) {
            console.log('API - La primera consulta falló, intentando con el otro campo...');
            
            let segundaQuery;
            
            if (usarCampoUserId) {
                // Si antes usamos user_id, ahora probar con usuario_id
                segundaQuery = supabase
                    .from('presupuestos')
                    .select('*')
                    .eq('usuario_id', usuario.id)
                    .order('fecha_creacion', { ascending: orden === 'asc' });
            } else {
                // Si antes usamos usuario_id, ahora probar con user_id
                segundaQuery = supabase
                    .from('presupuestos')
                    .select('*')
                    .eq('user_id', usuario.id)
                    .order('fecha_creacion', { ascending: orden === 'asc' });
            }
            
            // Aplicar filtro de estado si se especificó
            if (estado) {
                segundaQuery = segundaQuery.eq('estado', estado);
            }
            
            try {
                console.log('API - Ejecutando segunda consulta con campo alternativo...');
                const { data: presupuestosData2, error: presupuestosError2 } = await segundaQuery;
                
                if (presupuestosError2) {
                    console.error('API - Error en segunda consulta:', {
                        code: presupuestosError2.code,
                        message: presupuestosError2.message,
                        details: presupuestosError2.details,
                        hint: presupuestosError2.hint
                    });
                    
                    // Si ambas consultas fallaron, reportar el error original
                    return NextResponse.json({
                        message: 'Error al obtener los presupuestos',
                        error: errorPrimerConsulta.message,
                        details: errorPrimerConsulta.details,
                        code: errorPrimerConsulta.code,
                        tabla_no_existe: errorPrimerConsulta.message?.includes('does not exist'),
                        presupuestos: [] // Devolver array vacío para que el cliente lo maneje
                    }, { status: 500 });
                } else {
                    console.log(`API - Segunda consulta exitosa: ${presupuestosData2?.length || 0} presupuestos encontrados`);
                    presupuestos = presupuestosData2;
                }
            } catch (e) {
                console.error('API - Error inesperado en segunda consulta:', e);
                
                // Reportar el error original
                return NextResponse.json({
                    message: 'Error al obtener los presupuestos',
                    error: errorPrimerConsulta.message,
                    details: errorPrimerConsulta.details,
                    code: errorPrimerConsulta.code,
                    tabla_no_existe: errorPrimerConsulta.message?.includes('does not exist'),
                    presupuestos: [] // Devolver array vacío para que el cliente lo maneje
                }, { status: 500 });
            }
        }
        
        // Verificar resultado
        console.log(`API - Presupuestos encontrados: ${presupuestos?.length || 0} para usuario ${usuario.id}`);
        
        // 5. Formatear presupuestos para la respuesta
        const presupuestosFormateados = presupuestos?.map(presupuesto => {
            // Calcular días transcurridos desde la creación
            const fechaCreacion = new Date(presupuesto.fecha_creacion);
            const diasTranscurridos = Math.floor((new Date() - fechaCreacion) / (1000 * 60 * 60 * 24));
            
            // Formatear fecha para mostrar
            const fechaFormateada = fechaCreacion.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            
            return {
                id: presupuesto.id,
                nombre: presupuesto.nombre,
                categoria: presupuesto.categoria,
                material: presupuesto.material,
                acabado: presupuesto.acabado,
                unidades: presupuesto.unidades,
                dimensiones: presupuesto.dimensiones,
                total: presupuesto.presupuesto.total,
                estado: presupuesto.estado,
                fecha: fechaFormateada,
                dias_transcurridos: diasTranscurridos,
                tiempo_estimado: presupuesto.presupuesto.tiempo_estimado,
                imagenes: presupuesto.imagenes
            };
        }) || [];
        
        return NextResponse.json({
            message: 'Presupuestos obtenidos correctamente',
            presupuestos: presupuestosFormateados
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error al obtener presupuestos:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
} 