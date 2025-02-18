import { hash } from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Validar datos de entrada
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: 'Todos los campos son obligatorios' }), { status: 400 });
    }

    // Verificar si el usuario ya existe
    const { data: existingUser, error: userError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return new Response(JSON.stringify({ message: 'El usuario ya existe' }), { status: 409 });
    }

    // Hashear la contraseña
    const hashedPassword = await hash(password, 12);

    // Insertar usuario en la tabla 'usuarios'
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          nombre: name,
          email,
          contraseña: hashedPassword,
          rol: 'usuario', // Proporciona un valor para el campo 'rol'
          creado_en: new Date().toISOString(),
          actualizado_en: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error al insertar usuario:', error);
      throw new Error('No se pudo registrar el usuario');
    }

    // Confirmar el registro exitoso
    return new Response(JSON.stringify({ message: 'Usuario registrado correctamente', user: data[0] }), { status: 201 });

  } catch (error) {
    console.error('Error en el registro:', error);
    return new Response(JSON.stringify({ message: error.message || 'Error en el servidor' }), { status: 500 });
  }
}