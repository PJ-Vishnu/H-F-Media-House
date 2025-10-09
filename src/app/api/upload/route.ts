import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import admin from 'firebase-admin';

// =================================================================================
// IMPORTANT: Firebase Admin Initialization
// =================================================================================
// This code initializes the Firebase Admin SDK, which is necessary for server-side
// actions like uploading files to Cloud Storage.
//
// To make this work, you need to:
// 1. Go to your Firebase project settings -> Service accounts.
// 2. Click "Generate new private key" to download your service account JSON file.
// 3. DO NOT commit this file to your repository.
// 4. Set the following environment variables in your deployment environment
//    (e.g., in Firebase App Hosting's secret manager):
//    - FIREBASE_PROJECT_ID
//    - FIREBASE_PRIVATE_KEY (copy the full private key, including the "-----BEGIN..." parts, and replace newlines with `\n`)
//    - FIREBASE_CLIENT_EMAIL
//    - FIREBASE_STORAGE_BUCKET (e.g., your-project-id.appspot.com)
//
// If these variables are not set, the upload will fail.
// =================================================================================

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

if (!admin.apps.length) {
  if (serviceAccount.projectId && serviceAccount.privateKey && serviceAccount.clientEmail) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: storageBucket,
      });
      console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
      console.error("Firebase Admin SDK initialization error:", error);
    }
  } else {
    console.warn("Firebase Admin credentials not found. Uploads will fail. Please set environment variables.");
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.webm'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(req: NextRequest) {
  if (!storageBucket || admin.apps.length === 0 || !admin.app().options.credential) {
    console.error("Firebase Storage is not configured. Check environment variables and service account initialization.");
    return NextResponse.json({ success: false, message: 'Server configuration error: Storage not available.' }, { status: 500 });
  }

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

    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = admin.storage().bucket();

    const timestamp = Date.now();
    const originalName = path.basename(file.name, extension);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    
    // The path in Cloud Storage will be `uploads/section/filename`
    const destination = `uploads/${section}/${timestamp}-${sanitizedName}${extension}`;

    const blob = bucket.file(destination);
    await blob.save(buffer, {
        metadata: { contentType: file.type },
        public: true, // Make the file publicly accessible
    });

    // The public URL of the file.
    const publicUrl = blob.publicUrl();

    return NextResponse.json({ success: true, filePath: publicUrl }, { status: 200 });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, message: `Upload failed: ${error.message}` }, { status: 500 });
  }
}
