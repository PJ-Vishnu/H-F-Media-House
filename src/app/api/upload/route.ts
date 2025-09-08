import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.webm'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

// Ensure base upload directory exists
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const section = formData.get('section') as string | null;
    
    if (!file) {
      return NextResponse.json({ success: false, message: 'File not found in form data.' }, { status: 400 });
    }
    
    if (!section || !section.match(/^[a-zA-Z0-9_-]+$/)) {
      return NextResponse.json({ success: false, message: 'Invalid or missing section name.' }, { status: 400 });
    }
    
    const extension = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json({ success: false, message: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}` }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, message: `File size exceeds the limit of ${MAX_FILE_SIZE / 1024 / 1024}MB.` }, { status: 400 });
    }

    const sectionDir = path.join(UPLOADS_DIR, section);
    fs.mkdirSync(sectionDir, { recursive: true });

    const timestamp = Date.now();
    const originalName = path.basename(file.name, extension);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}${extension}`;
    const filePath = path.join(sectionDir, filename);

    if (!file.stream) {
         return NextResponse.json({ success: false, message: 'ReadableStream not supported or file is empty.' }, { status: 400 });
    }
    const fileStream = file.stream();
    const writeStream = fs.createWriteStream(filePath);

    // This is the correct way to pipe a web stream to a node stream
    // @ts-ignore - NodeJS.ReadableStream is compatible with ReadableStream for pipeline
    await pipeline(fileStream, writeStream);

    const publicPath = `/uploads/${section}/${filename}`;
    
    return NextResponse.json({ success: true, filePath: publicPath }, { status: 200 });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, message: `Upload failed: ${error.message}` }, { status: 500 });
  }
}
