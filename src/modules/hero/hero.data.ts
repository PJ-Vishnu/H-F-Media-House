
import type { HeroData } from './hero.schema';
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export async function getHeroData(): Promise<HeroData | null> {
  try {
    const res = await fetch(`${NEXT_PUBLIC_URL}/api/hero`, { cache: 'no-store' });
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        console.error('Failed to fetch hero data');
        return null;
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
