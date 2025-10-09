import multer, { StorageEngine } from 'multer';
import { NextApiRequest } from 'next';
import fs from 'fs';
import path from 'path';

export const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');

// Ensure the base uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function getStorage(section: string = 'general'): StorageEngine {
    const sectionPath = path.join(UPLOADS_DIR, section);
    if (!fs.existsSync(sectionPath)) {
        fs.mkdirSync(sectionPath, { recursive: true });
    }

    return multer.diskStorage({
        destination: sectionPath,
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            const originalName = file.originalname.replace(/\s+/g, '_');
            cb(null, `${timestamp}-${originalName}`);
        },
    });
}
