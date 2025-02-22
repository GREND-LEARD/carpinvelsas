import { SignJWT, jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || '/oeYJo2rGv0XHWt7YpqTBq0ugRQPhO99Y3QbcPUEgUqD81WWXn0N+37MELHLYEticW/Q/JYsh2w3eoLIppZCiw==');

export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch (error) {
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