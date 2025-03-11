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
    const {
      nombre,
      apellidos,
      telefono,
      direccion,
      ciudad,
      codigo_postal,
      provincia
    } = await request.json();
    
    // Preparar objeto con los datos a actualizar
    const datosActualizar = {
      nombre,
      apellidos,
      telefono,
      direccion,
      ciudad,
      codigo_postal,
      provincia,
      ultima_actualizacion: new Date().toISOString()
    };
    
    // Actualizar información del usuario
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .update(datosActualizar)
      .eq('id', payload.id)
      .select(`
        id,
        nombre,
        apellidos,
        email,
        telefono,
        direccion,
        ciudad,
        codigo_postal,
        provincia,
        rol,
        fecha_registro,
        ultima_actualizacion
      `)
      .single();
    
    if (error) {
      console.error('Error al actualizar perfil:', error);
      return NextResponse.json(
        { message: 'Error al actualizar información del perfil' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Perfil actualizado correctamente',
      usuario
    });
    
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 