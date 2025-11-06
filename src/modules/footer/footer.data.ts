
import type { FooterData } from './footer.schema';
import type { ContactData } from '../contact/contact.schema';
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export async function getFooterData(): Promise<FooterData | null> {
    try {
        const res = await fetch(`${NEXT_PUBLIC_URL}/api/footer`, { cache: 'no-store' });
        if (!res.ok) {
            console.error("Failed to fetch footer data, status:", res.status);
            return null;
        }
        return res.json();
    } catch(error) {
        console.error("Error fetching footer data:", error);
        return null;
    }
}

export async function getFooterContactData(): Promise<ContactData | null> {
    try {
        const res = await fetch(`${NEXT_PUBLIC_URL}/api/contact`, { cache: 'no-store' });
        if (!res.ok) {
            console.error("Failed to fetch contact data for footer, status:", res.status);
            return null;
        }
        return res.json();
    } catch(error) {
        console.error("Error fetching contact data for footer:", error);
        return null;
    }
}
