
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { AboutData } from '@/modules/about/about.schema';
import { sanitizeObject } from '@/lib/utils';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET /api/about
export async function GET() {
  try {
    const data = await db.getAbout();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch about data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/about
export async function PUT(req: Request) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  try {
    const body: AboutData = await req.json();
    const sanitizedData = sanitizeObject(body);
    const updatedData = await db.updateAbout(sanitizedData);
    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Failed to update about data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
