
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { ContactData } from '@/modules/contact/contact.schema';
import { sanitizeObject } from '@/lib/utils';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET /api/contact
export async function GET() {
  try {
    const data = await db.getContact();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch contact data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/contact
export async function PUT(req: Request) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  try {
    const body: ContactData = await req.json();
    const sanitizedData = sanitizeObject(body);
    const updatedData = await db.updateContact(sanitizedData);
    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Failed to update contact:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
