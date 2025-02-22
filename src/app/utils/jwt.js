import { SignJWT, jwtVerify } from 'jose';

const getSecretKey = () => {
    const secret = process.env.SUPABASE_JWT_SECRET;
    
    if (!secret) {
        console.warn('Using fallback JWT secret');
        return new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key');
    }
    
    return new TextEncoder().encode(secret);
};

const secretKey = getSecretKey();

export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch (error) {
        console.error('Token verification error:', error);
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