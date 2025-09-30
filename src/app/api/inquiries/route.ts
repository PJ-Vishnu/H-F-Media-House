
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import type { Inquiry } from '@/modules/inquiries/inquiries.schema';

// GET /api/inquiries
export async function GET() {
  try {
    const data = await db.getInquiries();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch inquiries: ", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/inquiries
export async function POST(req: Request) {
    try {
        const body: Omit<Inquiry, 'id' | 'createdAt'> = await req.json();
        if (!body.email || !body.message) {
            return NextResponse.json({ message: 'Email and message are required' }, { status: 400 });
        }
        const newItem = await db.addInquiry(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error("Failed to create inquiry: ", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/inquiries?id=...
export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Inquiry ID is required' }, { status: 400 });
        }
        await db.deleteInquiry(id);
        return NextResponse.json({ message: 'Inquiry deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete inquiry:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
