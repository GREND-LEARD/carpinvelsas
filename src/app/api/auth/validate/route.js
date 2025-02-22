import { verifyToken } from '@/app/utils/jwt';

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ valid: false }), { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const isValid = await verifyToken(token);

        if (!isValid) {
            return new Response(JSON.stringify({ valid: false }), { status: 401 });
        }

        return new Response(JSON.stringify({ valid: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ valid: false }), { status: 401 });
    }
}