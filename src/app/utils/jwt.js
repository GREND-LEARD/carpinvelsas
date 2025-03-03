import { SignJWT, jwtVerify } from 'jose';

const getSecretKey = () => {
    const secret = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET;
    
    if (!secret || secret.length === 0) {
        console.warn('⚠️ No se encontró clave JWT en variables de entorno, usando clave de respaldo');
        return new TextEncoder().encode('fallback_secret_for_development_only');
    }
    
    return new TextEncoder().encode(secret);
};

const secretKey = getSecretKey();

export async function verifyToken(token) {
    try {
        if (!token) {
            console.error('Error JWT: No se proporcionó token');
            return null;
        }

        const secretKey = getSecretKey();
        const { payload } = await jwtVerify(token, secretKey);
        
        console.log('Token verificado exitosamente');
        return payload;
    } catch (error) {
        console.error('Error verificando JWT:', error.message);
        // Detalles más específicos sobre errores comunes
        if (error.code === 'ERR_JWT_EXPIRED') {
            console.error('Token expirado');
        } else if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
            console.error('Firma de token inválida');
        }
        return null;
    }
}

export async function createToken(payload) {
    try {
        if (!payload || !payload.id) {
            console.error('Error JWT: Datos insuficientes para crear token');
            throw new Error('Datos de usuario insuficientes');
        }

        const secretKey = getSecretKey();
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(secretKey);
        
        console.log('Token JWT creado exitosamente');
        return token;
    } catch (error) {
        console.error('Error creando JWT:', error);
        throw error;
    }
}