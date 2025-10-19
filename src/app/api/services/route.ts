
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import type { Service } from '@/modules/services/services.schema';
import fs from 'fs';
import path from 'path';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET /api/services
export async function GET() {
  try {
    const data = await db.getServices();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/services
export async function POST(req: Request) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body: Omit<Service, 'id'> = await req.json();
        const newItem = await db.addService(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error('Failed to add service:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/services?id=...
export async function PUT(req: NextRequest) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Item ID is required' }, { status: 400 });
        }
        const body: Partial<Service> = await req.json();
        const updatedItem = await db.updateService(id, body);
        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        console.error('Failed to update service:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/services?id=...
export async function DELETE(req: NextRequest) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Item ID is required' }, { status: 400 });
        }
        const itemToDelete = await db.getServiceById(id);

        await db.deleteService(id);
        
        if (itemToDelete && itemToDelete.image) {
            // Reconstruct the filesystem path from the /api/media URL
            const urlPath = itemToDelete.image.replace('/api/media/', '');
            const filePath = path.join(process.cwd(), 'public/uploads', urlPath);

            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch (fileError) {
                    // Log the error but don't cause the request to fail,
                    // as the database entry is already deleted.
                    console.error(`Failed to delete file: ${filePath}`, fileError);
                }
            }
        }
        
        return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Failed to delete service:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
