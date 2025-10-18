
import { MongoClient } from 'mongodb';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

//
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
        
        console.log('Database seeded successfully with admin user!');

    } catch (error) {
        console.error('Failed to seed database:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

seed();
