
import type { Testimonial } from './testimonials.schema';
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export async function getTestimonialsData(): Promise<Testimonial[] | null> {
  try {
    const res = await fetch(`${NEXT_PUBLIC_URL}/api/testimonials`, { cache: 'no-store' });
    if (!res.ok) {
      console.error("Failed to fetch testimonials data, status:", res.status);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching testimonials data:", error);
    return null;
  }
}
