import { NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // In a real app, you'd look up the user in a database and verify the password hash.
    // For this demo, we'll use hardcoded credentials.
    const MOCK_USER = 'admin@example.com';
    const MOCK_PASSWORD = 'password';

    if (email === MOCK_USER && password === MOCK_PASSWORD) {
      const token = await createToken({ username: email });

      const response = NextResponse.json({ success: true, message: 'Login successful' });

      response.cookies.set('user-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });

      return response;
    } else {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}
