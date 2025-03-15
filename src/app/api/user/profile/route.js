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
    
    // Obtener información del usuario
    const { data: usuario, error } = await supabase
      .from('usuarios')
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
      .eq('id', payload.id)
      .single();
    
    if (error) {
      console.error('Error al obtener perfil:', error);
      return NextResponse.json(
        { message: 'Error al obtener información del perfil' },
        { status: 500 }
      );
    }
    
    if (!usuario) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    // No incluir información sensible en la respuesta
    delete usuario.password;
    
    return NextResponse.json({
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