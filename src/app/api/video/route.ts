
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { VideoData } from '@/modules/video/video.schema';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET /api/video
export async function GET() {
  try {
    const data = await db.getVideo();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch video data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/video
export async function PUT(req: Request) {
    const token = cookies().get('user-token')?.value;
    if (!token || !(await verifyAuth(token))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  try {
    const body: VideoData = await req.json();
    const updatedData = await db.updateVideo(body);
    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Failed to update video data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
