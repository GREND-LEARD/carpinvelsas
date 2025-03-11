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
    
    // Obtener datos del cuerpo de la solicitud
    const { proyecto_id, mensaje } = await request.json();
    
    // Validar campos obligatorios
    if (!proyecto_id || !mensaje) {
      return NextResponse.json(
        { message: 'El ID del proyecto y el mensaje son obligatorios' },
        { status: 400 }
      );
    }
    
    // Verificar que el proyecto pertenece al usuario
    const { data: proyecto, error: proyectoError } = await supabase
      .from('solicitudes_proyectos')
      .select('id, usuario_id')
      .eq('id', proyecto_id)
      .single();
    
    if (proyectoError) {
      console.error('Error al verificar proyecto:', proyectoError);
      return NextResponse.json(
        { message: 'Error al verificar el proyecto' },
        { status: 500 }
      );
    }
    
    // Verificar que el usuario es el propietario del proyecto o un administrador
    if (proyecto.usuario_id !== payload.id && payload.rol !== 'admin') {
      return NextResponse.json(
        { message: 'No tienes permisos para comentar en este proyecto' },
        { status: 403 }
      );
    }
    
    // Crear el comentario
    const fechaActual = new Date().toISOString();
    const { data: comentario, error: comentarioError } = await supabase
      .from('comentarios_proyecto')
      .insert({
        proyecto_id,
        usuario_id: payload.id,
        mensaje,
        fecha: fechaActual
      })
      .select('id, mensaje, fecha, usuario_id')
      .single();
    
    if (comentarioError) {
      console.error('Error al crear comentario:', comentarioError);
      return NextResponse.json(
        { message: 'Error al guardar el comentario' },
        { status: 500 }
      );
    }
    
    // Obtener información del usuario para incluir en la respuesta
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios')
      .select('nombre, apellidos, rol')
      .eq('id', payload.id)
      .single();
    
    if (usuarioError) {
      console.error('Error al obtener información del usuario:', usuarioError);
    }
    
    // Si el comentario es del cliente, crear notificación para administradores
    if (payload.rol !== 'admin') {
      const { data: admins, error: adminsError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('rol', 'admin');
      
      if (!adminsError && admins.length > 0) {
        const notificacionesAdmin = admins.map(admin => ({
          usuario_id: admin.id,
          tipo: 'comentario',
          titulo: 'Nuevo comentario en proyecto',
          mensaje: `${usuario?.nombre || 'Un cliente'} ha comentado en el proyecto #${proyecto_id}`,
          leida: false,
          fecha: fechaActual,
          proyecto_id
        }));
        
        const { error: notificacionError } = await supabase
          .from('notificaciones')
          .insert(notificacionesAdmin);
        
        if (notificacionError) {
          console.error('Error al crear notificaciones para administradores:', notificacionError);
        }
      }
    } else {
      // Si el comentario es del admin, crear notificación para el cliente
      const { error: notificacionError } = await supabase
        .from('notificaciones')
        .insert({
          usuario_id: proyecto.usuario_id,
          tipo: 'comentario',
          titulo: 'Nuevo comentario en tu proyecto',
          mensaje: 'El equipo de Carpintería Vela ha respondido a tu proyecto',
          leida: false,
          fecha: fechaActual,
          proyecto_id
        });
      
      if (notificacionError) {
        console.error('Error al crear notificación para el cliente:', notificacionError);
      }
    }
    
    // Formatear el comentario para la respuesta
    const comentarioFormateado = {
      ...comentario,
      admin: usuario?.rol === 'admin',
      usuario: {
        nombre: usuario?.nombre || '',
        apellidos: usuario?.apellidos || '',
        rol: usuario?.rol || ''
      }
    };
    
    return NextResponse.json({
      message: 'Comentario guardado correctamente',
      comentario: comentarioFormateado
    });
    
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 