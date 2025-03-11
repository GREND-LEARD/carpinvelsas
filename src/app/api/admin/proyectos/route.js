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
    
    // Verificar que sea un administrador
    if (payload.rol !== 'admin') {
      return NextResponse.json(
        { message: 'No autorizado. Se requieren permisos de administrador.' },
        { status: 403 }
      );
    }
    
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
        notas_adicionales,
        usuario_id
      `)
      .order('fecha_solicitud', { ascending: false });
    
    // Filtrar por estado si se proporciona
    if (estado && estado !== 'todos') {
      query = query.eq('estado', estado);
    }
    
    // Ejecutar la consulta
    const { data: proyectos, error: proyectosError } = await query;
    
    if (proyectosError) {
      console.error('Error al obtener proyectos:', proyectosError);
      return NextResponse.json(
        { message: 'Error al obtener la lista de proyectos' },
        { status: 500 }
      );
    }
    
    // Obtener información de los clientes y los comentarios para cada proyecto
    const proyectosCompletos = await Promise.all(
      proyectos.map(async (proyecto) => {
        // Obtener información del cliente
        const { data: clienteData, error: clienteError } = await supabase
          .from('usuarios')
          .select('id, nombre, apellidos, email, telefono')
          .eq('id', proyecto.usuario_id)
          .single();
        
        if (clienteError) {
          console.error(`Error al obtener información del cliente para el proyecto ${proyecto.id}:`, clienteError);
          return {
            ...proyecto,
            cliente: { nombre: 'Cliente no encontrado', apellidos: '', email: '', telefono: '' },
            comentarios: []
          };
        }
        
        // Obtener comentarios del proyecto
        const { data: comentarios, error: comentariosError } = await supabase
          .from('comentarios_proyecto')
          .select(`
            id,
            mensaje,
            fecha,
            usuario_id
          `)
          .eq('proyecto_id', proyecto.id)
          .order('fecha', { ascending: true });
        
        if (comentariosError) {
          console.error(`Error al obtener comentarios para el proyecto ${proyecto.id}:`, comentariosError);
          return {
            ...proyecto,
            cliente: clienteData,
            comentarios: []
          };
        }
        
        // Determinar si el comentario es del admin o del cliente
        const comentariosFormateados = comentarios ? comentarios.map(comentario => ({
          ...comentario,
          admin: comentario.usuario_id !== proyecto.usuario_id
        })) : [];
        
        return {
          ...proyecto,
          cliente: clienteData,
          comentarios: comentariosFormateados
        };
      })
    );
    
    return NextResponse.json({ proyectos: proyectosCompletos });
    
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 