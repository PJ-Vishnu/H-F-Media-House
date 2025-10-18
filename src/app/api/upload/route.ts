import { NextRequest, NextResponse } from 'next/server';
import { UPLOADS_DIR } from '@/lib/db';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.webm'];


export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const section = formData.get('section') as string | 'general';
    
    if (!file) {
        return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }

    const extension = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return NextResponse.json({ success: false, message: 'Invalid file type.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ success: false, message: 'File size exceeds limit.' }, { status: 400 });
    }

    const sectionPath = path.join(UPLOADS_DIR, section);
    if (!fs.existsSync(sectionPath)) {
        fs.mkdirSync(sectionPath, { recursive: true });
    }

    const timestamp = Date.now();
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const filename = `${timestamp}-${sanitizedOriginalName}`;
    const filePath = path.join(sectionPath, filename);
    const fileUrlPath = `/uploads/${section}/${filename}`;

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await fs.promises.writeFile(filePath, buffer);

        return NextResponse.json({ success: true, filePath: fileUrlPath });

    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json({ success: false, message: 'File upload failed' }, { status: 500 });
    }
}
