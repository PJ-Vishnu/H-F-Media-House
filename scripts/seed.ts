import fs from 'node:fs/promises';
import path from 'node:path';

// This script will seed the database with initial data.
// It writes a series of JSON files to the `src/lib/db` directory.
// The `db.ts` utility will then read from these files.

const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'db');

async function writeJsonFile(filename: string, data: any) {
    const filepath = path.join(DB_PATH, filename);
    await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✓ Wrote ${filename}`);
}

async function seed() {
    console.log('Seeding database...');
    
    try {
        // Ensure the db directory exists
        await fs.mkdir(DB_PATH, { recursive: true });

        // Admin User
        await writeJsonFile('admin.json', {
            email: 'admin@example.com',
            password_DO_NOT_STORE_IN_PLAIN_TEXT: 'password',
        });
        
        // Hero Data
        await writeJsonFile('hero.json', {
          headline: 'Creating Stories',
          subheadline: 'We are a creative film and photo production house based in New York. We are committed to capturing your most precious moments and turning them into cinematic stories you can cherish forever.',
          ctaText: 'Explore Now',
          ctaLink: '#portfolio',
          images: [
            { src: 'https://picsum.photos/600/800?random=1', alt: 'Man with a camera', 'data-ai-hint': 'camera gear' },
            { src: 'https://picsum.photos/600/800?random=2', alt: 'Film set lighting', 'data-ai-hint': 'film set' },
            { src: 'https://picsum.photos/600/800?random=3', alt: 'Video editing suite', 'data-ai-hint': 'video editing' },
            { src: 'https://picsum.photos/600/800?random=4', alt: 'Drone flying over a landscape', 'data-ai-hint': 'drone videography' },
            { src: 'https://picsum.photos/600/800?random=5', alt: 'Podcast recording microphone', 'data-ai-hint': 'podcast setup' },
            { src: 'https://picsum.photos/600/800?random=6', alt: 'Photographer in action', 'data-ai-hint': 'photographer action' },
          ],
        });

        // Gallery Images
        await writeJsonFile('gallery.json', [
          { id: '1', src: 'https://picsum.photos/800/600?random=11', alt: 'Couple walking on a hill', 'data-ai-hint': 'couple landscape', order: 1 },
          { id: '2', src: 'https://picsum.photos/400/300?random=12', alt: 'Black and white wedding photo', 'data-ai-hint': 'wedding black-white', order: 2 },
          { id: '3', src: 'https://picsum.photos/400/300?random=13', alt: 'Couple reflected in a window', 'data-ai-hint': 'couple reflection', order: 3 },
          { id: '4', src: 'https://picsum.photos/800/300?random=14', alt: 'Wedding rings', 'data-ai-hint': 'wedding rings', order: 4 },
        ]);

        // About Data
        await writeJsonFile('about.json', {
          title: 'Our Story Behind the Lens',
          content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',
          imageUrl: 'https://picsum.photos/1200/800?random=20',
          'data-ai-hint': 'camera lens',
        });
        
        // Services
        await writeJsonFile('services.json', [
          { id: '1', title: 'Photography', description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', icon: 'Camera' },
          { id: '2', title: 'Videography', description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', icon: 'Video' },
          { id: '3', title: 'Content Creation', description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', icon: 'Wand' },
        ]);

        // Portfolio Items
        await writeJsonFile('portfolio.json', [
          { id: '1', title: 'Project Alpha', description: 'A documentary short on urban exploration.', imageUrl: 'https://picsum.photos/600/400?random=31', 'data-ai-hint': 'urban exploration', category: 'Video', order: 1 },
          { id: '2', title: 'Project Beta', description: 'Brand photography for a new startup.', imageUrl: 'https://picsum.photos/600/400?random=32', 'data-ai-hint': 'startup brand', category: 'Photography', order: 2 },
          { id: '3', title: 'Project Gamma', description: 'Animated explainer video for a tech company.', imageUrl: 'https://picsum.photos/600/400?random=33', 'data-ai-hint': 'animated explainer', category: 'Animation', order: 3 },
          { id: '4', title: 'Project Delta', description: 'Event coverage for a major music festival.', imageUrl: 'https://picsum.photos/600/400?random=34', 'data-ai-hint': 'music festival', category: 'Video', order: 4 },
        ]);

        // Testimonials
        await writeJsonFile('testimonials.json', [
          { id: '1', quote: 'It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed metus id magna efficitur similique.', author: 'Leo', company: 'Marketer' },
          { id: '2', quote: 'It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed metus id magna efficitur similique.', author: 'Ana', company: 'Photographer' },
          { id: '3', quote: 'It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed metus id magna efficitur similique.', author: 'John', company: 'Videographer' },
        ]);

        // Contact Data
        await writeJsonFile('contact.json', {
          email: 'hello@hfmedia.house',
          phone: '+1 (234) 567-890',
          address: '123 Media Lane, Creative City, 10001',
          socials: {
            facebook: '#',
            twitter: '#',
            instagram: '#',
            linkedin: '#',
          },
        });

        // Footer Data
        await writeJsonFile('footer.json', {
            copyright: `Copyright @${new Date().getFullYear()} H&F Media. All rights reserved.`,
            links: [
                { title: 'Home', url: '/' },
                { title: 'About', url: '#about' },
                { title: 'Services', url: '#services' },
                { title: 'Contact', url: '#contact' },
            ]
        });

        console.log('Database seeded successfully!');

    } catch (error) {
        console.error('Failed to seed database:', error);
        process.exit(1);
    }
}

seed();
