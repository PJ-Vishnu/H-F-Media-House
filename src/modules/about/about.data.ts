
import type { AboutData } from './about.schema';
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export async function getAboutData(): Promise<AboutData | null> {
  try {
    const res = await fetch(`${NEXT_PUBLIC_URL}/api/about`, { cache: 'no-store' });
    if (!res.ok) {
        console.error("Failed to fetch about data, status:", res.status);
        return null;
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching about data:", error);
    return null;
  }
}
