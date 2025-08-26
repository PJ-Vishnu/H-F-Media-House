import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/testimonials
export async function GET() {
  try {
    const data = await db.getTestimonials();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
