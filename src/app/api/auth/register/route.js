import { hash } from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';

export async function POST(req) {
  try {
    const { name, email, password, rol, apellido = "No especificado" } = await req.json();

    // Validar datos de entrada
    if (!name || !email || !password) {
      return Response.json(
        { message: 'Todos los campos son obligatorios' }, 
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const { data: existingUser, error: searchError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (searchError && searchError.code !== 'PGRST116') {
      console.error('Error al buscar usuario:', searchError);
      return Response.json(
        { message: 'Error al verificar usuario existente' }, 
        { status: 500 }
      );
    }

    if (existingUser) {
      return Response.json(
        { message: 'El usuario ya existe' }, 
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await hash(password, 12);

    // Validar el rol
    const validRoles = ['admin', 'usuario', 'client'];
    const userRole = rol && validRoles.includes(rol) ? rol : 'usuario';

    // Estructura actualizada del usuario según el esquema real
    const newUser = {
      nombre: name,
      apellido: apellido,
      email: email,
      password_hash: hashedPassword,
      rol: userRole,
      activo: true
    };

    // Insertar usuario en la tabla 'usuarios'
    const { data, error } = await supabase
      .from('usuarios')
      .insert([newUser])
      .select();

    if (error) {
      console.error('Error al insertar usuario:', error);
      return Response.json(
        { message: error.message || 'No se pudo registrar el usuario' }, 
        { status: 500 }
      );
    }

    return Response.json({ 
      message: 'Usuario registrado correctamente', 
      user: {
        id: data[0].id,
        nombre: data[0].nombre,
        apellido: data[0].apellido,
        email: data[0].email,
        rol: data[0].rol
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error en el registro:', error);
    return Response.json({ 
      message: error.message || 'Error en el servidor' 
    }, { status: 500 });
  }
}