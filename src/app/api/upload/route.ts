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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // The section is now passed as a query parameter in the POST request
    const section = (req.query.section as string) || 'general';
    const sectionDir = path.join(UPLOADS_DIR, section);
    // Ensure section-specific directory exists
    fs.mkdirSync(sectionDir, { recursive: true });
    cb(null, sectionDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = path.basename(file.originalname, path.extname(file.originalname));
    const extension = path.extname(file.originalname).toLowerCase();
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
}).single('file');

// Promisify the upload middleware
const uploadMiddleware = promisify(upload);

export async function POST(req: NextRequest) {
  // We need to pass query params to multer's destination function.
  // This is a common workaround as multer's types don't directly expose NextRequest.
  // We cast `req` to `any` to attach the query object for multer to use.
  const reqAsAny = req as any;
  reqAsAny.query = { section: req.nextUrl.searchParams.get('section') || 'general' };
  
  // We also need a response object for multer, which we can fake for this purpose.
  const resAsAny = {} as any;

  try {
    // Await the promisified middleware to handle the upload
    await uploadMiddleware(reqAsAny, resAsAny);
    
    const file = reqAsAny.file;
    if (!file) {
      return NextResponse.json({ success: false, message: 'File not uploaded.' }, { status: 400 });
    }

    // Construct the public URL path for the uploaded file
    const section = reqAsAny.query.section;
    const filePath = `/uploads/${section}/${file.filename}`;
    
    return NextResponse.json({ success: true, filePath }, { status: 200 });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, message: `Upload failed: ${error.message}` }, { status: 500 });
  }
}
