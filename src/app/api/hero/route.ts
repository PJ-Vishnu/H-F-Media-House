import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { HeroData } from '@/modules/hero/hero.schema';
import { sanitizeObject } from '@/lib/utils';


// GET /api/hero
export async function GET() {
  try {
    const data = await db.getHero();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/hero
export async function PUT(req: Request) {
  try {
    const body: HeroData = await req.json();
    const sanitizedData = sanitizeObject(body);
    const updatedData = await db.updateHero(sanitizedData);
    return NextResponse.json(updatedData);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

    