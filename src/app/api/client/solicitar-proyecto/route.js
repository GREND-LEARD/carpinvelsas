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
    const requestData = await request.json();
    
    const {
      titulo,
      tipoProyecto,
      materialesPreferidos,
      medidas,
      descripcion,
      presupuestoEstimado,
      fechaDeseada,
      referencias,
      prioridad,
      notasAdicionales
    } = requestData;
    
    // Validar campos obligatorios
    if (!titulo || !descripcion) {
      return NextResponse.json(
        { message: 'El título y la descripción son campos obligatorios' },
        { status: 400 }
      );
    }
    
    // Obtener información del usuario
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('nombre, apellidos, email, telefono')
      .eq('id', payload.id)
      .single();
    
    if (userError) {
      console.error('Error al obtener datos del usuario:', userError);
      return NextResponse.json(
        { message: 'Error al obtener información del usuario' },
        { status: 500 }
      );
    }
    
    // Asegurarse de que los materiales preferidos son un array
    const materialesArray = Array.isArray(materialesPreferidos) 
      ? materialesPreferidos 
      : materialesPreferidos ? [materialesPreferidos] : [];
    
    // Crear la solicitud de proyecto
    const { data: solicitud, error: solicitudError } = await supabase
      .from('solicitudes_proyectos')
      .insert([
        {
          usuario_id: payload.id,
          titulo,
          tipo_proyecto: tipoProyecto,
          materiales_preferidos: materialesArray,
          medidas,
          descripcion,
          presupuesto_estimado: presupuestoEstimado ? parseFloat(presupuestoEstimado) : null,
          fecha_deseada: fechaDeseada || null,
          referencias,
          prioridad,
          notas_adicionales: notasAdicionales,
          estado: 'pendiente',
          fecha_solicitud: new Date().toISOString()
        }
      ])
      .select()
      .single();
    
    if (solicitudError) {
      console.error('Error al crear solicitud de proyecto:', solicitudError);
      return NextResponse.json(
        { message: `Error al guardar la solicitud de proyecto: ${solicitudError.message}` },
        { status: 500 }
      );
    }
    
    // Crear una notificación para el usuario
    const { error: notificacionError } = await supabase
      .from('notificaciones')
      .insert([
        {
          usuario_id: payload.id,
          tipo: 'proyecto',
          titulo: 'Solicitud de proyecto recibida',
          mensaje: `Tu solicitud para el proyecto "${titulo}" ha sido recibida correctamente. Pronto nos pondremos en contacto contigo.`,
          leida: false,
          fecha: new Date().toISOString(),
          proyecto_id: solicitud.id
        }
      ]);
    
    if (notificacionError) {
      console.error('Error al crear notificación:', notificacionError);
      // No devolvemos error, ya que la solicitud se creó correctamente
    }
    
    // Crear una notificación para los administradores
    const { data: admins, error: adminsError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('rol', 'admin');
    
    if (!adminsError && admins.length > 0) {
      const notificacionesAdmin = admins.map(admin => ({
        usuario_id: admin.id,
        tipo: 'admin_proyecto',
        titulo: 'Nueva solicitud de proyecto',
        mensaje: `${userData.nombre} ${userData.apellidos} ha solicitado un nuevo proyecto: "${titulo}"`,
        leida: false,
        fecha: new Date().toISOString(),
        proyecto_id: solicitud.id
      }));
      
      const { error: notiAdminError } = await supabase
        .from('notificaciones')
        .insert(notificacionesAdmin);
      
      if (notiAdminError) {
        console.error('Error al crear notificaciones para administradores:', notiAdminError);
      }
    }
    
    return NextResponse.json(
      { 
        message: 'Solicitud de proyecto creada correctamente',
        solicitud 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 