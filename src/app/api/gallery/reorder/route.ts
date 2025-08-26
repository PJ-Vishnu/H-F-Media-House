import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/gallery/reorder
export async function POST(req: Request) {
  try {
    const { orderedIds }: { orderedIds: string[] } = await req.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }
    const updatedGallery = await db.reorderGallery(orderedIds);
    return NextResponse.json(updatedGallery);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
