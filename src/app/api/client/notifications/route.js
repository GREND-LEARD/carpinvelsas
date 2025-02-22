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

        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', payload.userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify(notifications), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error del servidor' }), { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const payload = await verifyToken(token);
        const { notificationId } = await request.json();

        if (!payload || payload.role !== 'client') {
            return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
        }

        const { data, error } = await supabase
            .from('notifications')
            .update({ leida: true })
            .eq('id', notificationId)
            .eq('user_id', payload.userId);

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error del servidor' }), { status: 500 });
    }
}