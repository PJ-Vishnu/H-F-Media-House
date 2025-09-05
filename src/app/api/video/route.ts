import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { VideoData } from '@/modules/video/video.schema';

// GET /api/video
export async function GET() {
  try {
    const data = await db.getVideo();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/video
export async function PUT(req: Request) {
  try {
    const body: VideoData = await req.json();
    const updatedData = await db.updateVideo(body);
    return NextResponse.json(updatedData);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
