import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { verifyToken } from '@/app/utils/jwt';

export async function GET(request) {
  try {
    // Verificar autenticación mediante token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token no proporcionado' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);
    
    if (!payload || !payload.id) {
      return NextResponse.json(
        { message: 'Token no válido' },
        { status: 401 }
      );
    }

    console.log('Token verificado exitosamente');
    
    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');
    
    // Consulta base
    let query = supabase
      .from('solicitudes_proyectos')
      .select(`
        id,
        titulo,
        descripcion,
        tipo_proyecto,
        materiales_preferidos,
        medidas,
        presupuesto_estimado,
        presupuesto,
        fecha_solicitud,
        fecha_deseada,
        fecha_entrega,
        referencias,
        estado,
        prioridad,
        notas_adicionales
      `);
    
    // Filtrar proyectos del usuario actual
    if (payload.rol !== 'admin') {
      query = query.eq('usuario_id', payload.id);
    }
    
    // Filtrar por estado si se proporciona
    if (estado && estado !== 'todos') {
      query = query.eq('estado', estado);
    }
    
    // Ordenar por fecha de solicitud (más recientes primero)
    query = query.order('fecha_solicitud', { ascending: false });
    
    // Ejecutar la consulta
    const { data: proyectos, error: proyectosError } = await query;
    
    if (proyectosError) {
      console.error('Error al obtener proyectos:', proyectosError);
      return NextResponse.json(
        { message: 'Error al obtener la lista de proyectos' },
        { status: 500 }
      );
    }
    
    // Obtener comentarios para cada proyecto
    const proyectosConComentarios = await Promise.all(
      proyectos.map(async (proyecto) => {
        const { data: comentarios, error: comentariosError } = await supabase
          .from('comentarios_proyecto')
          .select(`
            id,
            mensaje,
            fecha,
            usuario_id,
            usuarios:usuario_id (nombre, apellidos, rol)
          `)
          .eq('proyecto_id', proyecto.id)
          .order('fecha', { ascending: true });
        
        if (comentariosError) {
          console.error(`Error al obtener comentarios para el proyecto ${proyecto.id}:`, comentariosError);
          return {
            ...proyecto,
            comentarios: []
          };
        }
        
        // Formatear comentarios con información de quién lo envió
        const comentariosFormateados = comentarios.map(c => ({
          id: c.id,
          mensaje: c.mensaje,
          fecha: c.fecha,
          usuario: c.usuarios,
          admin: c.usuarios?.rol === 'admin'
        }));
        
        return {
          ...proyecto,
          comentarios: comentariosFormateados
        };
      })
    );
    
    return NextResponse.json({ proyectos: proyectosConComentarios });
    
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    return NextResponse.json(
      { message: 'Error al obtener la lista de proyectos' },
      { status: 500 }
    );
  }
} 