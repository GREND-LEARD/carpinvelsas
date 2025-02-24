import { SignJWT, jwtVerify } from 'jose';

const getSecretKey = () => {
    const secret = process.env.SUPABASE_JWT_SECRET;
    
    if (!secret || secret.length === 0) {
        console.warn('Using fallback JWT secret');
        const fallbackSecret = process.env.JWT_SECRET || 'fallback_secret_key';
        return new TextEncoder().encode(fallbackSecret);
    }
    
    return new TextEncoder().encode(secret);
};

const secretKey = getSecretKey();

export async function verifyToken(token) {
    try {
        if (!token) {
            console.error('No token provided');
            return null;
        }
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch (error) {
        console.error('Token verification error:', error.message);
        return null;
    }
}

export async function createToken(payload) {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(secretKey);
    return token;
}