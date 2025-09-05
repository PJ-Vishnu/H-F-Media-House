import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const secretKey = process.env.JWT_SECRET || 'your-super-secret-key-that-is-at-least-32-characters-long';
const key = new TextEncoder().encode(secretKey);

export async function createToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Token expires in 1 day
    .sign(key);
}

export async function verifyAuth(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}

    