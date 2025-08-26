import { NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const admin = await db.getAdmin();

    // NOTE: This is a highly insecure way to check passwords and is for demo purposes only.
    // In a real app, you would use a library like bcrypt to compare a hashed password.
    if (email === admin.email && password === admin.password_DO_NOT_STORE_IN_PLAIN_TEXT) {
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
