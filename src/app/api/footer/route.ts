import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { FooterData } from '@/lib/definitions';

// GET /api/footer
export async function GET() {
  try {
    const data = await db.getFooter();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/footer
export async function PUT(req: Request) {
  try {
    const body: FooterData = await req.json();
    const updatedData = await db.updateFooter(body);
    return NextResponse.json(updatedData);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
