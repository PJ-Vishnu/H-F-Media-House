
import type { PortfolioItem } from './portfolio.schema';
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export async function getPortfolioData(): Promise<PortfolioItem[] | null> {
  try {
    const res = await fetch(`${NEXT_PUBLIC_URL}/api/portfolio`, { cache: 'no-store' });
    if (!res.ok) {
      console.error("Failed to fetch portfolio data, status:", res.status);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return null;
  }
}
