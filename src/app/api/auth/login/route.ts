import { NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const admin = await db.getAdmin();

    if (!admin || !admin.email || !admin.passwordHash) {
        return NextResponse.json({ success: false, message: 'Admin account not configured' }, { status: 500 });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (email === admin.email && isPasswordValid) {
      const token = await createToken({ email: admin.email, role: 'admin' });

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
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}

    