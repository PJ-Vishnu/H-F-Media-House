
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { HeroData } from '@/modules/hero/hero.schema';
import { sanitizeObject } from '@/lib/utils';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET /api/hero
export async function GET() {
  try {
    const data = await db.getHero();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch hero data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/hero
export async function PUT(req: Request) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

  try {
    const body: HeroData = await req.json();
    const sanitizedData = sanitizeObject(body);
    const updatedData = await db.updateHero(sanitizedData);
    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Failed to update hero data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
