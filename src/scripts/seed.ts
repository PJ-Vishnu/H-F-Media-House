import { MongoClient } from 'mongodb';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI||"mongodb://localhost:27017/CMS2";
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
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password', salt);
        await db.collection('admin').insertOne({
            email: 'admin@example.com',
            passwordHash: passwordHash,
        });
        console.log('✓ Seeded admin');
        
        // Hero Data
        await db.collection('hero').insertOne({
          headline: 'Creating Stories',
          subheadline: 'We are a creative film and photo production house based in New York. We are committed to capturing your most precious moments and turning them into cinematic stories you can cherish forever.',
          ctaText: 'Explore Now',
          ctaLink: '#portfolio',
          images: [
            { src: 'https://picsum.photos/600/800?random=1', alt: 'Man with a camera' },
            { src: 'https://picsum.photos/600/800?random=2', alt: 'Film set lighting' },
            { src: 'https://picsum.photos/600/800?random=3', alt: 'Video editing suite' },
            { src: 'https://picsum.photos/600/800?random=4', alt: 'Drone flying over a landscape' },
            { src: 'https://picsum.photos/600/800?random=5', alt: 'Podcast recording microphone' },
            { src: 'https://picsum.photos/600/800?random=6', alt: 'Photographer in action' },
          ],
        });
        console.log('✓ Seeded hero');

        // Gallery Images
        await db.collection('gallery').insertMany([
          { src: 'https://picsum.photos/800/600?random=11', alt: 'Couple walking on a hill', order: 1, colSpan: 2, rowSpan: 2 },
          { src: 'https://picsum.photos/400/300?random=12', alt: 'Black and white wedding photo', order: 2, colSpan: 1, rowSpan: 1 },
          { src: 'https://picsum.photos/400/300?random=13', alt: 'Couple reflected in a window', order: 3, colSpan: 1, rowSpan: 1 },
          { src: 'https://picsum.photos/400/300?random=14', alt: 'A groom smiling', order: 4, colSpan: 1, rowSpan: 1 },
          { src: 'https://picsum.photos/400/300?random=15', alt: 'A bride smiling', order: 5, colSpan: 1, rowSpan: 1 },
          { src: 'https://picsum.photos/800/300?random=16', alt: 'Wedding rings', order: 6, colSpan: 2, rowSpan: 1 },
        ]);
        console.log('✓ Seeded gallery');

        // About Data
        await db.collection('about').insertOne({
          title: 'Our Story Behind the Lens',
          content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',
          imageUrl: 'https://picsum.photos/1200/800?random=20',
          features: [
            { title: 'Creative & Emotional', description: 'We believe every moment has a story to tell. We turn your special moments into timeless memories.' },
            { title: 'Modern & Professional', description: 'We use the latest technology and techniques to produce high-quality content that exceeds expectations.' },
            { title: 'Passionate & Dedicated', description: 'Our team is passionate about storytelling and dedicated to delivering exceptional results for every client.' },
          ]
        });
        console.log('✓ Seeded about');
        
        // Services
        await db.collection('services').insertMany([
          { title: 'Photography', description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', icon: 'Camera', image: 'https://picsum.photos/600/800?random=41' },
          { title: 'Videography', description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', icon: 'Video', image: 'https://picsum.photos/600/800?random=42' },
          { title: 'Content Creation', description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', icon: 'Wand', image: 'https://picsum.photos/600/800?random=43' },
        ]);
        console.log('✓ Seeded services');

        // Portfolio Items
        await db.collection('portfolio').insertMany([
          { title: 'Project Alpha', description: 'A documentary short on urban exploration.', imageUrl: 'https://picsum.photos/600/400?random=31', category: 'Video', order: 1 },
          { title: 'Project Beta', description: 'Brand photography for a new startup.', imageUrl: 'https://picsum.photos/600/400?random=32', category: 'Photography', order: 2 },
          { title: 'Project Gamma', description: 'Animated explainer video for a tech company.', imageUrl: 'https://picsum.photos/600/400?random=33', category: 'Animation', order: 3 },
          { title: 'Project Delta', description: 'Event coverage for a major music festival.', imageUrl: 'https://picsum.photos/600/400?random=34', category: 'Video', order: 4 },
        ]);
        console.log('✓ Seeded portfolio');

        // Testimonials
        await db.collection('testimonials').insertMany([
          { quote: 'It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed metus id magna efficitur similique.', author: 'Leo', company: 'Marketer', avatar: 'https://i.pravatar.cc/150?u=Leo' },
          { quote: 'It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed metus id magna efficitur similique.', author: 'Ana', company: 'Photographer', avatar: 'https://i.pravatar.cc/150?u=Ana' },
          { quote: 'It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed metus id magna efficitur similique.', author: 'John', company: 'Videographer', avatar: 'https://i.pravatar.cc/150?u=John' },
        ]);
        console.log('✓ Seeded testimonials');
        
        // Video Data
        await db.collection('video').insertOne({
          title: 'Check Out Our Latest Work',
          description: 'A showcase of our recent projects, capturing unique stories and breathtaking moments. See our passion in action.',
          videoType: 'youtube',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          videoThumbnail: 'https://picsum.photos/1280/720?random=51'
        });
        console.log('✓ Seeded video');

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

    