import { supabase } from '@/app/lib/supabaseClient';

// Obtener eventos (puedes filtrar por user_id usando query params)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');

  let query = supabase.from('eventos').select('*');
  if (user_id) {
    query = query.eq('user_id', user_id);
  }

  const { data, error } = await query;
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}

// Crear un nuevo evento
export async function POST(req) {
  const body = await req.json();
  const { title, start, end, user_id } = body;

  const { data, error } = await supabase
    .from('eventos')
    .insert([{ title, start, end, user_id }])
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 201 });
}

// Actualizar un evento existente
export async function PUT(req) {
  const body = await req.json();
  const { id, title, start, end } = body;

  const { data, error } = await supabase
    .from('eventos')
    .update({ title, start, end })
    .eq('id', id)
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}

// Eliminar un evento (se espera recibir el id como query param)
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const { data, error } = await supabase
    .from('eventos')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}
