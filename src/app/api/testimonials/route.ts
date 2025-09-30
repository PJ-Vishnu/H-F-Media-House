
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import type { Testimonial } from '@/modules/testimonials/testimonials.schema';

// GET /api/testimonials
export async function GET() {
  try {
    const data = await db.getTestimonials();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/testimonials
export async function POST(req: Request) {
    try {
        const body: Omit<Testimonial, 'id'> = await req.json();
        const newItem = await db.addTestimonial(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error("Failed to add testimonial:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/testimonials?id=...
export async function PUT(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Item ID is required' }, { status: 400 });
        }
        const body: Partial<Testimonial> = await req.json();
        const updatedItem = await db.updateTestimonial(id, body);
        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        console.error("Failed to update testimonial:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/testimonials?id=...
export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Item ID is required' }, { status: 400 });
        }
        await db.deleteTestimonial(id);
        return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete testimonial:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
