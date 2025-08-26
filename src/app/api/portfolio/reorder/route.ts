import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/portfolio/reorder
export async function POST(req: Request) {
  try {
    const { orderedIds }: { orderedIds: string[] } = await req.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }
    const updatedPortfolio = await db.reorderPortfolio(orderedIds);
    return NextResponse.json(updatedPortfolio);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
