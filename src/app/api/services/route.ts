import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/services
export async function GET() {
  try {
    const data = await db.getServices();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
