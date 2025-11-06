
import type { GalleryImage } from './gallery.schema';
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export async function getGalleryData(): Promise<GalleryImage[] | null> {
  try {
    const res = await fetch(`${NEXT_PUBLIC_URL}/api/gallery`, { cache: 'no-store' });
    if (!res.ok) {
      console.error("Failed to fetch gallery data, status:", res.status);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching gallery data:", error);
    return null;
  }
}
