
import type { VideoData } from './video.schema';
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export async function getVideoData(): Promise<VideoData | null> {
    try {
        const res = await fetch(`${NEXT_PUBLIC_URL}/api/video`, { cache: 'no-store' });
        if (!res.ok) {
            console.error("Failed to fetch video data, status:", res.status);
            return null;
        }
        return res.json();
    } catch(error) {
        console.error("Error fetching video data:", error);
        return null;
    }
}
