
import type { Service } from './services.schema';
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export async function getServicesData(): Promise<Service[] | null> {
  try {
    const res = await fetch(`${NEXT_PUBLIC_URL}/api/services`, { cache: 'no-store' });
    if (!res.ok) {
      console.error("Failed to fetch services data, status:", res.status);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching services data:", error);
    return null;
  }
}
