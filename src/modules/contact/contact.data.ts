
import type { ContactData } from './contact.schema';
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export async function getContactData(): Promise<ContactData | null> {
    try {
        const res = await fetch(`${NEXT_PUBLIC_URL}/api/contact`, { cache: 'no-store' });
        if (!res.ok) {
            console.error("Failed to fetch contact data, status:", res.status);
            return null;
        }
        return res.json();
    } catch(error) {
        console.error("Error fetching contact data:", error);
        return null;
    }
}
