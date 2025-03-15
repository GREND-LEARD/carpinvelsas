import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { verifyToken } from '@/app/utils/jwt';

export async function POST(request) {
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
    
    // Obtener datos del cuerpo de la solicitud
    const { id, estado, presupuesto, fechaEntrega, comentario, notificarCliente } = await request.json();
    
    // Validar campos requeridos
    if (!id || !estado) {
      return NextResponse.json(
        { message: 'El ID del proyecto y el estado son obligatorios' },
        { status: 400 }
      );
    }
    
    // Consultar el proyecto para obtener información
    const { data: proyecto, error: proyectoError } = await supabase
      .from('solicitudes_proyectos')
      .select('usuario_id, titulo')
      .eq('id', id)
      .single();
    
    if (proyectoError) {
      console.error('Error al obtener información del proyecto:', proyectoError);
      return NextResponse.json(
        { message: 'Error al obtener información del proyecto' },
        { status: 500 }
      );
    }
    
    // Preparar datos para actualizar
    const datosActualizar = {
      estado,
      fecha_actualizacion: new Date().toISOString()
    };
    
    // Añadir campos opcionales si están presentes
    if (presupuesto !== undefined) {
      datosActualizar.presupuesto = presupuesto;
    }
    
    if (fechaEntrega) {
      datosActualizar.fecha_entrega = fechaEntrega;
    }
    
    // Actualizar el proyecto
    const { data: proyectoActualizado, error: actualizarError } = await supabase
      .from('solicitudes_proyectos')
      .update(datosActualizar)
      .eq('id', id)
      .select()
      .single();
    
    if (actualizarError) {
      console.error('Error al actualizar el proyecto:', actualizarError);
      return NextResponse.json(
        { message: 'Error al actualizar el proyecto' },
        { status: 500 }
      );
    }
    
    // Si se proporcionó un comentario, guardarlo
    if (comentario) {
      const { error: comentarioError } = await supabase
        .from('comentarios_proyecto')
        .insert([
          {
            proyecto_id: id,
            usuario_id: payload.id,
            mensaje: comentario,
            fecha: new Date().toISOString()
          }
        ]);
      
      if (comentarioError) {
        console.error('Error al guardar el comentario:', comentarioError);
        // No fallamos la operación completa si falla el comentario
      }
    }
    
    // Si se solicitó notificar al cliente, crear una notificación
    if (notificarCliente) {
      // Crear mensaje basado en el nuevo estado
      let tituloNotificacion = 'Actualización en tu proyecto';
      let mensajeNotificacion = `Tu proyecto "${proyecto.titulo}" ha sido actualizado.`;
      
      if (estado === 'aprobado') {
        tituloNotificacion = 'Proyecto aprobado';
        mensajeNotificacion = `Tu proyecto "${proyecto.titulo}" ha sido aprobado y entrará en fase de producción.`;
      } else if (estado === 'en_progreso') {
        tituloNotificacion = 'Proyecto en producción';
        mensajeNotificacion = `Tu proyecto "${proyecto.titulo}" ha entrado en fase de producción.`;
      } else if (estado === 'completado') {
        tituloNotificacion = 'Proyecto completado';
        mensajeNotificacion = `¡Buenas noticias! Tu proyecto "${proyecto.titulo}" ha sido completado.`;
      } else if (estado === 'rechazado') {
        tituloNotificacion = 'Proyecto rechazado';
        mensajeNotificacion = `Lamentamos informarte que tu proyecto "${proyecto.titulo}" ha sido rechazado.`;
      }
      
      const { error: notificacionError } = await supabase
        .from('notificaciones')
        .insert([
          {
            usuario_id: proyecto.usuario_id,
            tipo: 'proyecto',
            titulo: tituloNotificacion,
            mensaje: mensajeNotificacion,
            leida: false,
            fecha: new Date().toISOString(),
            proyecto_id: id
          }
        ]);
      
      if (notificacionError) {
        console.error('Error al crear notificación:', notificacionError);
        // No fallamos la operación completa si falla la notificación
      }
    }
    
    return NextResponse.json({
      message: 'Proyecto actualizado correctamente',
      proyecto: proyectoActualizado
    });
    
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 