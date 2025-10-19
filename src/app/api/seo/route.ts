
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { SEOData } from '@/modules/seo/seo.schema';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET /api/seo
export async function GET() {
  try {
    const data = await db.getSEO();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch SEO data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/seo
export async function PUT(req: Request) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  try {
    const body: SEOData = await req.json();
    const updatedData = await db.updateSEO(body);
    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Failed to update SEO data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
