import { verifyToken } from '@/app/utils/jwt';

export async function GET(request) {
    try {
        console.log('Solicitud de validación de token recibida');
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            console.log('No se encontró encabezado de autorización');
            return Response.json({ valid: false, message: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log('No se encontró token en el encabezado');
            return Response.json({ valid: false, message: 'Invalid authorization format' }, { status: 401 });
        }

        console.log('Verificando token...');
        const payload = await verifyToken(token);

        if (!payload) {
            console.log('Token inválido o expirado');
            return Response.json({ valid: false, message: 'Invalid or expired token' }, { status: 401 });
        }

        console.log('Token válido, payload:', { id: payload.id, rol: payload.rol });
        return Response.json({ 
            valid: true, 
            user: {
                id: payload.id,
                email: payload.email,
                rol: payload.rol
            } 
        }, { status: 200 });
    } catch (error) {
        console.error('Error validando token:', error);
        return Response.json({ 
            valid: false, 
            message: error.message || 'Error validating token' 
        }, { status: 500 });
    }
}