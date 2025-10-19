
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { UPLOADS_DIR } from '@/lib/db';
import { lookup } from 'mime-types';

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePathParts = params.path;
    if (!filePathParts || filePathParts.length === 0) {
      return new NextResponse('File path is required', { status: 400 });
    }

    // Securely join the path segments
    const relativePath = path.join(...filePathParts);
    
    // Prevent directory traversal attacks by ensuring the final path is within the UPLOADS_DIR
    const absolutePath = path.join(UPLOADS_DIR, relativePath);
    if (!absolutePath.startsWith(UPLOADS_DIR)) {
        return new NextResponse('Forbidden', { status: 403 });
    }
    
    // Check if file exists
    await fs.access(absolutePath);

    // Read file and determine content type
    const fileBuffer = await fs.readFile(absolutePath);
    const mimeType = lookup(absolutePath) || 'application/octet-stream';

    // Return the file with correct headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': String(fileBuffer.length),
      },
    });
  } catch (error) {
    // Check if the error is a file not found error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return new NextResponse('File not found', { status: 404 });
    }
    
    console.error('Media streaming error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
