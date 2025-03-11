import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { verifyToken } from '@/app/utils/jwt';
import bcrypt from 'bcryptjs';

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
    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Contraseña actual y nueva son requeridas' },
        { status: 400 }
      );
    }
    
    // Verificar que la nueva contraseña cumpla con los requisitos
    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'La nueva contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }
    
    // Obtener contraseña actual del usuario
    const { data: usuario, error: errorUsuario } = await supabase
      .from('usuarios')
      .select('password_hash')
      .eq('id', payload.id)
      .single();
    
    if (errorUsuario) {
      console.error('Error al obtener contraseña actual:', errorUsuario);
      return NextResponse.json(
        { message: 'Error al verificar contraseña actual' },
        { status: 500 }
      );
    }
    
    // Verificar que la contraseña actual sea correcta
    const contraseñaValida = await bcrypt.compare(currentPassword, usuario.password_hash);
    
    if (!contraseñaValida) {
      return NextResponse.json(
        { message: 'La contraseña actual es incorrecta' },
        { status: 401 }
      );
    }
    
    // Hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Actualizar contraseña
    const { error: errorActualizar } = await supabase
      .from('usuarios')
      .update({
        password_hash: hashedPassword,
        ultima_actualizacion: new Date().toISOString()
      })
      .eq('id', payload.id);
    
    if (errorActualizar) {
      console.error('Error al actualizar contraseña:', errorActualizar);
      return NextResponse.json(
        { message: 'Error al actualizar contraseña' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Contraseña actualizada correctamente'
    });
    
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
} 