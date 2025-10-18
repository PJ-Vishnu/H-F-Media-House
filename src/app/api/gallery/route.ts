
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import type { GalleryImage } from '@/modules/gallery/gallery.schema';
import fs from 'fs';
import path from 'path';

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
        const id = req.nextUrl.searchParams.get('id');
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
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Image ID is required' }, { status: 400 });
        }

        // First, get the image data to find the file path
        const imageToDelete = await db.getGalleryImageById(id);
        
        // Then, delete the record from the database
        await db.deleteGalleryImage(id);
        
        // Finally, delete the file from the filesystem
        if (imageToDelete && imageToDelete.src) {
            const filePath = path.join(process.cwd(), 'public', imageToDelete.src);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch (fileError) {
                    // Log the error but don't fail the request, as the DB entry is gone.
                    console.error(`Failed to delete file: ${filePath}`, fileError);
                }
            }
        }
        
        return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Gallery delete error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
