import { compare } from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validar datos de entrada
    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email y contraseña son obligatorios' }), { status: 400 });
    }

    // Buscar usuario en la base de datos
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, contraseña') // Solo seleccionar los datos necesarios
      .eq('email', email)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), { status: 404 });
    }

    // Comparar la contraseña ingresada con la almacenada
    const isValid = await compare(password, data.contraseña);
    if (!isValid) {
      return new Response(JSON.stringify({ message: 'Contraseña incorrecta' }), { status: 401 });
    }

    // Eliminar la contraseña antes de devolver la respuesta
    const { contraseña, ...userWithoutPassword } = data;

    return new Response(JSON.stringify({ message: 'Login exitoso', user: userWithoutPassword }), { status: 200 });

  } catch (error) {
    console.error('Error en el login:', error);
    return new Response(JSON.stringify({ message: error.message || 'Error en el servidor' }), { status: 500 });
  }
}