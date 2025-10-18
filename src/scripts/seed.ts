
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
        const passwordHash = await bcrypt.hash('P@3wL#9sV^6dGq8F', salt);
        await db.collection('admin').insertOne({
            email: 'admin@hf-media-house.com',
            passwordHash: passwordHash,
        });
        console.log('✓ Seeded admin');
        
        // Hero Section
        await db.collection('hero').insertOne({
            headline: "Creating Stories",
            subheadline: "We are a creative film and photo production house based in New York. We are committed to capturing your most precious moments and turning them into cinematic stories you can cherish forever.",
            ctaText: "Explore Now",
            ctaLink: "#portfolio",
            images: []
        });
        console.log('✓ Seeded hero section');

        // About Section
        await db.collection('about').insertOne({
            title: 'Our Story Behind the Lens',
            content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
            imageUrl: '',
            features: [
                { title: 'Creative & Emotional', description: 'We believe every moment has a story to tell. We turn your special moments into timeless memories.' },
                { title: 'Modern & Professional', description: 'We use the latest technology and techniques to produce high-quality content that exceeds expectations.' },
                { title: 'Passionate & Dedicated', description: 'Our team is passionate about storytelling and dedicated to delivering exceptional results for every client.' },
            ]
        });
        console.log('✓ Seeded about section');

        // Services
        await db.collection('services').insertMany([
            { title: "Photography", description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.", icon: "Camera", image: "" },
            { title: "Videography", description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.", icon: "Video", image: "" },
            { title: "Content Creation", description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.", icon: "Wand", image: "" },
        ]);
        console.log('✓ Seeded services');

        // Portfolio
        await db.collection('portfolio').insertMany([
            { title: "Project Alpha", description: "A documentary short on urban exploration.", imageUrl: "", category: "Video", order: 1 },
            { title: "Project Beta", description: "Brand photography for a new startup.", imageUrl: "", category: "Photography", order: 2 },
            { title: "Project Gamma", description: "Animated explainer video for a tech company.", imageUrl: "", category: "Animation", order: 3 },
            { title: "Project Delta", description: "Event coverage for a major music festival.", imageUrl: "", category: "Video", order: 4 },
        ]);
        console.log('✓ Seeded portfolio');

        // Testimonials
        await db.collection('testimonials').insertMany([
            { quote: "It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed metus id magna efficitur similique.", author: "Leo", company: "Marketer", avatar: "" },
            { quote: "It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed metus id magna efficitur similique.", author: "Ana", company: "Photographer", avatar: "" },
            { quote: "It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed metus id magna efficitur similique.", author: "John", company: "Videographer", avatar: "" },
        ]);
        console.log('✓ Seeded testimonials');

        // Video Section
        await db.collection('video').insertOne({
            title: 'Check Out Our Latest Work',
            description: 'A showcase of our recent projects, capturing unique stories and breathtaking moments. See our passion in action.',
            videoType: 'youtube',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            videoThumbnail: ''
        });
        console.log('✓ Seeded video section');

        // Contact Section
        await db.collection('contact').insertOne({
            email: "hello@hfmedia.house",
            phone: "+1 (234) 567-890",
            address: "123 Media Lane, Creative City, 10001",
            imageUrl: '',
            socials: {
                facebook: "#",
                twitter: "#",
                instagram: "#",
                linkedin: "#",
                youtube: "#"
            }
        });
        console.log('✓ Seeded contact section');

        // Footer Section
        await db.collection('footer').insertOne({
            copyright: `Copyright @${new Date().getFullYear()} H&F Media. All rights reserved.`,
            links: [
                { title: 'Home', url: '/' },
                { title: 'About', url: '#about' },
                { title: 'Services', url: '#services' },
                { title: 'Contact', url: '#contact' },
            ]
        });
        console.log('✓ Seeded footer section');

        // SEO
        await db.collection('seo').insertOne({
            title: 'H&F Media House | Creative Film & Photo Production',
            description: 'A creative film and photo production house based in New York, specializing in cinematic storytelling for weddings, brands, and events.',
            keywords: 'film production, photography, video services, new york, wedding videographer, brand content',
            url: 'https://hf-media-house.com',
            ogImage: ''
        });
        console.log('✓ Seeded SEO');
        
        // The gallery and inquiries collections will be empty by default.
        console.log('✓ Seeded gallery (empty)');
        console.log('✓ Seeded inquiries (empty)');

        console.log('Database seeded successfully!');

    } catch (error) {
        console.error('Failed to seed database:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

seed();
