import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const client = new MongoClient(uri);

async function seed() {
    console.log('Seeding database...');
    try {
        await client.connect();
        const db = client.db("hf-media-house");
        console.log("Connected to database!");

        // Clear existing data
        const collections = await db.listCollections().toArray();
        for (const collection of collections) {
            console.log(`Dropping collection: ${collection.name}`);
            await db.collection(collection.name).drop();
        }

        // Admin User
        await db.collection('admin').insertOne({
            email: 'admin@example.com',
            password_DO_NOT_STORE_IN_PLAIN_TEXT: 'password',
        });
        console.log('✓ Seeded admin');
        
        // Hero Data
        await db.collection('hero').insertOne({
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
        console.log('✓ Seeded hero');

        // Gallery Images
        await db.collection('gallery').insertMany([
          { src: 'https://picsum.photos/800/600?random=11', alt: 'Couple walking on a hill', 'data-ai-hint': 'couple landscape', order: 1 },
          { src: 'https://picsum.photos/400/300?random=12', alt: 'Black and white wedding photo', 'data-ai-hint': 'wedding black-white', order: 2 },
          { src: 'https://picsum.photos/400/300?random=13', alt: 'Couple reflected in a window', 'data-ai-hint': 'couple reflection', order: 3 },
          { src: 'https://picsum.photos/800/300?random=14', alt: 'Wedding rings', 'data-ai-hint': 'wedding rings', order: 4 },
        ]);
        console.log('✓ Seeded gallery');

        // About Data
        await db.collection('about').insertOne({
          title: 'Our Story Behind the Lens',
          content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',
          imageUrl: 'https://picsum.photos/1200/800?random=20',
          'data-ai-hint': 'camera lens',
        });
        console.log('✓ Seeded about');
        
        // Services
        await db.collection('services').insertMany([
          { title: 'Photography', description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', icon: 'Camera' },
          { title: 'Videography', description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', icon: 'Video' },
          { title: 'Content Creation', description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', icon: 'Wand' },
        ]);
        console.log('✓ Seeded services');

        // Portfolio Items
        await db.collection('portfolio').insertMany([
          { title: 'Project Alpha', description: 'A documentary short on urban exploration.', imageUrl: 'https://picsum.photos/600/400?random=31', 'data-ai-hint': 'urban exploration', category: 'Video', order: 1 },
          { title: 'Project Beta', description: 'Brand photography for a new startup.', imageUrl: 'https://picsum.photos/600/400?random=32', 'data-ai-hint': 'startup brand', category: 'Photography', order: 2 },
          { title: 'Project Gamma', description: 'Animated explainer video for a tech company.', imageUrl: 'https://picsum.photos/600/400?random=33', 'data-ai-hint': 'animated explainer', category: 'Animation', order: 3 },
          { title: 'Project Delta', description: 'Event coverage for a major music festival.', imageUrl: 'https://picsum.photos/600/400?random=34', 'data-ai-hint': 'music festival', category: 'Video', order: 4 },
        ]);
        console.log('✓ Seeded portfolio');

        // Testimonials
        await db.collection('testimonials').insertMany([
          { quote: 'It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed metus id magna efficitur similique.', author: 'Leo', company: 'Marketer' },
          { quote: 'It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed metus id magna efficitur similique.', author: 'Ana', company: 'Photographer' },
          { quote: 'It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed metus id magna efficitur similique.', author: 'John', company: 'Videographer' },
        ]);
        console.log('✓ Seeded testimonials');

        // Contact Data
        await db.collection('contact').insertOne({
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
        console.log('✓ Seeded contact');

        // Footer Data
        await db.collection('footer').insertOne({
            copyright: `Copyright @${new Date().getFullYear()} H&F Media. All rights reserved.`,
            links: [
                { title: 'Home', url: '/' },
                { title: 'About', url: '#about' },
                { title: 'Services', url: '#services' },
                { title: 'Contact', url: '#contact' },
            ]
        });
        console.log('✓ Seeded footer');

        console.log('Database seeded successfully!');

    } catch (error) {
        console.error('Failed to seed database:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

seed();
