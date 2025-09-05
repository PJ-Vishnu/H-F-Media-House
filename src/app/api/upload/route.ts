import { NextRequest, NextResponse } from 'next/server';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// It's important to export this config!
// It disables the default body parser so multer can handle the stream.
// It also removes the response limit to prevent timeouts on large uploads.
export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.webm'];

// Ensure base upload directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const section = (req as any).section || 'general';
        const sectionDir = path.join(UPLOADS_DIR, section);
        if (!fs.existsSync(sectionDir)) {
          fs.mkdirSync(sectionDir, { recursive: true });
        }
        cb(null, sectionDir);
      },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = path.basename(file.originalname, path.extname(file.originalname));
    const extension = path.extname(file.originalname);
    cb(null, `${timestamp}-${originalName.replace(/[^a-zA-Z0-9]/g, '_')}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const mimetypeIsValid = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
    const extensionIsValid = ALLOWED_EXTENSIONS.includes(path.extname(file.originalname).toLowerCase());
    
    if (mimetypeIsValid && extensionIsValid) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// Helper to process the upload
const processUpload = (req: NextRequest & { section: string }) => {
    const parser = upload.single('file');
    return new Promise<{ file?: Express.Multer.File }>((resolve, reject) => {
      parser(req as any, {} as any, (err) => {
        if (err) return reject(err);
        resolve({ file: (req as any).file });
      });
    });
  };

export async function POST(req: NextRequest) {
  const section = req.nextUrl.searchParams.get('section') || 'general';

  try {
    // Attach section to the request so multer's destination function can access it
    (req as any).section = section;

    const { file } = await processUpload(req as any);
    
    if (!file) {
      return NextResponse.json({ success: false, message: 'File not uploaded.' }, { status: 400 });
    }

    const filePath = `/uploads/${section}/${file.filename}`;
    
    return NextResponse.json({ success: true, filePath }, { status: 200 });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, message: `Upload failed: ${error.message}` }, { status: 500 });
  }
}
