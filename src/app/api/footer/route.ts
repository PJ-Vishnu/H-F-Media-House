
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { FooterData } from '@/modules/footer/footer.schema';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET /api/footer
export async function GET() {
  try {
    const data = await db.getFooter();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch footer data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/footer
export async function PUT(req: Request) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  try {
    const body: FooterData = await req.json();
    const updatedData = await db.updateFooter(body);
    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Failed to update footer data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
