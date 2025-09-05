import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { ContactData } from '@/modules/contact/contact.schema';
import { sanitizeObject } from '@/lib/utils';

// GET /api/contact
export async function GET() {
  try {
    const data = await db.getContact();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/contact
export async function PUT(req: Request) {
  try {
    const body: ContactData = await req.json();
    const sanitizedData = sanitizeObject(body);
    const updatedData = await db.updateContact(sanitizedData);
    return NextResponse.json(updatedData);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

    