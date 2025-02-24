import { supabase } from '@/app/lib/supabaseClient';
import { verifyToken } from '@/app/utils/jwt';

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const payload = await verifyToken(token);

        if (!payload || payload.role !== 'client') {
            return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
        }

        const { data: projects, error } = await supabase
            .from('projects')
            .select('*')
            .eq('client_id', payload.userId)
            .order('fechaEntrega', { ascending: true });

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify(projects), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error del servidor' }), { status: 500 });
    }
}