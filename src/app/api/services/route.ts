import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import type { Service } from '@/modules/services/services.schema';

// GET /api/services
export async function GET() {
  try {
    const data = await db.getServices();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/services
export async function POST(req: Request) {
    try {
        const body: Omit<Service, 'id'> = await req.json();
        const newItem = await db.addService(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/services?id=...
export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Item ID is required' }, { status: 400 });
        }
        const body: Partial<Service> = await req.json();
        const updatedItem = await db.updateService(id, body);
        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/services?id=...
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Item ID is required' }, { status: 400 });
        }
        await db.deleteService(id);
        return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
