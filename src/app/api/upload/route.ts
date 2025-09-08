import { NextRequest, NextResponse } from 'next/server';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

// Disable the default body parser to allow multer to handle the stream
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

// We will create multer middleware on-the-fly for each request
const getUploadMiddleware = (section: string) => {
  const sectionDir = path.join(UPLOADS_DIR, section);
  
  // Ensure section-specific directory exists
  fs.mkdirSync(sectionDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, sectionDir);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const originalName = path.basename(file.originalname, path.extname(file.originalname));
      const extension = path.extname(file.originalname).toLowerCase();
      cb(null, `${timestamp}-${originalName.replace(/[^a-zA-Z0-9]/g, '_')}${extension}`);
    }
  });

  return multer({
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
  }).single('file');
}

export async function POST(req: NextRequest) {
  const section = req.nextUrl.searchParams.get('section') || 'general';

  if (!section.match(/^[a-zA-Z0-9_-]+$/)) {
      return NextResponse.json({ success: false, message: 'Invalid section name.' }, { status: 400 });
  }

  const upload = getUploadMiddleware(section);
  const promisifiedUpload = promisify(upload);

  // We need to cast `req` and create a dummy `res` for the middleware to work
  const reqAsAny = req as any;
  const resAsAny = {} as any;

  try {
    // Await the promisified middleware to handle the upload
    await promisifiedUpload(reqAsAny, resAsAny);
    
    const file = reqAsAny.file;
    if (!file) {
      return NextResponse.json({ success: false, message: 'File not uploaded.' }, { status: 400 });
    }

    // Construct the public URL path for the uploaded file
    const filePath = `/uploads/${section}/${file.filename}`;
    
    return NextResponse.json({ success: true, filePath }, { status: 200 });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, message: `Upload failed: ${error.message}` }, { status: 500 });
  }
}
