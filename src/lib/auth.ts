// In a real app, use a library like 'jose' or 'jsonwebtoken'.
// This is a simplified mock for demonstration purposes.
const SECRET_KEY = process.env.JWT_SECRET || 'your-super-secret-key-that-is-at-least-32-characters-long';

// This function simulates creating a JWT.
export async function createToken(payload: { username: string }) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  
  const claims = { ...payload, iat: Math.floor(Date.now() / 1000) };
  const encodedPayload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  
  // In a real JWT, this would use HMAC with SHA256. We'll simulate it.
  // This is NOT a secure signature.
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = Buffer.from(`${signatureInput}.${SECRET_KEY}`).toString('base64url');
  
  return `${signatureInput}.${signature}`;
}

// This function simulates verifying a JWT.
export async function verifyAuth(token: string): Promise<{ username: string } | null> {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = Buffer.from(`${signatureInput}.${SECRET_KEY}`).toString('base64url');
    
    if (signature !== expectedSignature) {
      console.error("Signature verification failed");
      return null;
    }
    
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    
    return payload as { username: string };
  } catch (error) {
    console.error("Error verifying auth token:", error);
    return null;
  }
}
