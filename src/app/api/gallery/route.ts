import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import type { GalleryImage } from '@/modules/gallery/gallery.schema';

// GET /api/gallery
export async function GET() {
  try {
    const data = await db.getGallery();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/gallery
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newImage = await db.addGalleryImage(body);
        return NextResponse.json(newImage, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/gallery?id=...
export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Image ID is required' }, { status: 400 });
        }
        const body: Partial<GalleryImage> = await req.json();
        const updatedImage = await db.updateGalleryImage(id, body);
        return NextResponse.json(updatedImage, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


// DELETE /api/gallery?id=...
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Image ID is required' }, { status: 400 });
        }
        await db.deleteGalleryImage(id);
        return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
