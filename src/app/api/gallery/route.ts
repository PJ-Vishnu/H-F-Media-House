
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import type { GalleryImage } from '@/modules/gallery/gallery.schema';
import fs from 'fs';
import path from 'path';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET /api/gallery
export async function GET() {
  try {
    const data = await db.getGallery();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch gallery:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/gallery
export async function POST(req: Request) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body = await req.json();
        const newImage = await db.addGalleryImage(body);
        return NextResponse.json(newImage, { status: 201 });
    } catch (error) {
        console.error('Failed to add gallery image:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/gallery?id=...
export async function PUT(req: NextRequest) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Image ID is required' }, { status: 400 });
        }
        const body: Partial<GalleryImage> = await req.json();
        const updatedImage = await db.updateGalleryImage(id, body);
        return NextResponse.json(updatedImage, { status: 200 });
    } catch (error) {
        console.error('Failed to update gallery image:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


// DELETE /api/gallery?id=...
export async function DELETE(req: NextRequest) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Image ID is required' }, { status: 400 });
        }

        const imageToDelete = await db.getGalleryImageById(id);
        
        await db.deleteGalleryImage(id);
        
        if (imageToDelete && imageToDelete.src) {
            const filePath = path.join(process.cwd(), 'public', imageToDelete.src);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch (fileError) {
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
