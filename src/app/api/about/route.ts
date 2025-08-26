import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { AboutData } from '@/modules/about/about.schema';

// GET /api/about
export async function GET() {
  try {
    const data = await db.getAbout();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/about
export async function PUT(req: Request) {
  try {
    const body: AboutData = await req.json();
    const updatedData = await db.updateAbout(body);
    return NextResponse.json(updatedData);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
