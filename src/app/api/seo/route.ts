import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { SEOData } from '@/modules/seo/seo.schema';

// GET /api/seo
export async function GET() {
  try {
    const data = await db.getSEO();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/seo
export async function PUT(req: Request) {
  try {
    const body: SEOData = await req.json();
    const updatedData = await db.updateSEO(body);
    return NextResponse.json(updatedData);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
