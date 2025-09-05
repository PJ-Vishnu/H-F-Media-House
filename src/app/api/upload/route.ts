import { NextRequest, NextResponse } from 'next/server';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.webm'];

// Ensure base upload directory exists
if (!fs.existsSync(UPLOADS_DIR)) {  fs.mkdirSync(UPLOADS_DIR, { recursive: true });}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const section = (req as any).query?.section || 'general';
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
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
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

// We need to wrap multer in a way that works with Next.js Edge/Node.js runtimes.
// This is a common pattern for using middleware that relies on the Node.js `req`, `res` objects.
const runMiddleware = (req: any, res: any, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, let multer handle it
    // Increase timeout for large file uploads
    responseLimit: false,
  },
};

export async function POST(req: NextRequest) {
  const section = req.nextUrl.searchParams.get('section') || 'general';

  // We need to create a mock response object for multer
  const res: any = {
    // mock methods to prevent errors
    status: (code: number) => res,
    json: (body: any) => {
      // we'll handle the actual response ourselves
    },
    setHeader: (name: string, value: string) => {},
    end: () => {},
  };

  try {
    // Attach query to the request object for multer's destination function
    (req as any).query = { section };
    
    await runMiddleware(req, res, upload.single('file'));
    
    // If multer ran successfully, the file is uploaded.
    // The `file` object is attached to the request by multer.
    const file = (req as any).file;
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

    