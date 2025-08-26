import { MongoClient, Db, WithId } from 'mongodb';
import type { HeroData } from '@/modules/hero/hero.schema';
import type { GalleryImage } from '@/modules/gallery/gallery.schema';
import type { AboutData } from '@/modules/about/about.schema';
import type { Service } from '@/modules/services/services.schema';
import type { PortfolioItem } from '@/modules/portfolio/portfolio.schema';
import type { Testimonial } from '@/modules/testimonials/testimonials.schema';
import type { ContactData } from '@/modules/contact/contact.schema';
import type { FooterData } from '@/modules/footer/footer.schema';
import type { AdminUser } from '@/modules/admin/admin.schema';


// Ensure the MONGODB_URI is set in your environment variables
const uri = process.env.MONGODB_URI;

let client: MongoClient;
let dbInstance: Db;
let isConnected = false;

async function connectToDb(): Promise<Db | null> {
  if (!uri) {
    console.warn('MONGODB_URI not found, running in fallback mode.');
    return null;
  }
  if (dbInstance && isConnected) {
    return dbInstance;
  }
  try {
    client = new MongoClient(uri);
    await client.connect();
    dbInstance = client.db("hf-media-house");
    isConnected = true;
    console.log("Successfully connected to MongoDB.");
    return dbInstance;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    isConnected = false;
    return null;
  }
}

// Helper to remove _id and set id
function mapDoc<T>(doc: WithId<any>): T {
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toHexString() } as T;
}

// Mock "DB" methods, now interacting with MongoDB
export const db = {
  // ADMIN
  getAdmin: async (): Promise<AdminUser> => {
    const db = await connectToDb();
    if (!db) return { email: '', password_DO_NOT_STORE_IN_PLAIN_TEXT: '' };
    const admin = await db.collection<AdminUser>('admin').findOne({});
    return admin ?? { email: '', password_DO_NOT_STORE_IN_PLAIN_TEXT: '' };
  },

  // HERO
  getHero: async (): Promise<HeroData> => {
    const db = await connectToDb();
    if (!db) return { headline: 'Welcome', subheadline: 'Please connect to database.', ctaText: 'Setup', ctaLink: '#', images: [] };
    const data = await db.collection<HeroData>('hero').findOne({});
    return data ?? { headline: '', subheadline: '', ctaText: '', ctaLink: '#', images: [] };
  },
  updateHero: async (data: HeroData) => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    await db.collection<HeroData>('hero').updateOne({}, { $set: data }, { upsert: true });
    return data;
  },
  
  // GALLERY
  getGallery: async (): Promise<GalleryImage[]> => {
    const db = await connectToDb();
    if (!db) return [];
    const images = await db.collection<GalleryImage>('gallery').find().sort({ order: 1 }).toArray();
    return images.map(mapDoc);
  },
  addGalleryImage: async (image: Omit<GalleryImage, 'id' | 'order'>): Promise<GalleryImage> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const count = await db.collection('gallery').countDocuments();
    const newImage = { ...image, order: count + 1 };
    const result = await db.collection('gallery').insertOne(newImage);
    return mapDoc({ ...newImage, _id: result.insertedId });
  },
  deleteGalleryImage: async (id: string): Promise<{ success: boolean }> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
    await db.collection('gallery').deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  },
  reorderGallery: async (orderedIds: string[]): Promise<GalleryImage[]> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index + 1 } },
      },
    }));
    if(bulkOps.length > 0) {
        await db.collection('gallery').bulkWrite(bulkOps);
    }
    return db.collection<GalleryImage>('gallery').find().sort({ order: 1 }).toArray().then(docs => docs.map(mapDoc));
  },

  // ABOUT
  getAbout: async (): Promise<AboutData> => {
    const db = await connectToDb();
    if (!db) return { title: 'About Us', content: 'Please connect to database.', imageUrl: '', 'data-ai-hint': ''};
    const data = await db.collection<AboutData>('about').findOne({});
    return data ?? { title: '', content: '', imageUrl: '', 'data-ai-hint': ''};
  },
  updateAbout: async (data: AboutData): Promise<AboutData> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    await db.collection('about').updateOne({}, { $set: data }, { upsert: true });
    return data;
  },

  // SERVICES
  getServices: async (): Promise<Service[]> => {
    const db = await connectToDb();
    if (!db) return [];
    return db.collection<Service>('services').find().toArray().then(docs => docs.map(mapDoc));
  },
  
  // PORTFOLIO
  getPortfolio: async (): Promise<PortfolioItem[]> => {
    const db = await connectToDb();
    if (!db) return [];
    const items = await db.collection<PortfolioItem>('portfolio').find().sort({ order: 1 }).toArray();
    return items.map(mapDoc);
  },
  addPortfolioItem: async (item: Omit<PortfolioItem, 'id' | 'order'>): Promise<PortfolioItem> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const count = await db.collection('portfolio').countDocuments();
    const newItem = { ...item, order: count + 1 };
    const result = await db.collection('portfolio').insertOne(newItem);
    return mapDoc({ ...newItem, _id: result.insertedId });
  },
  deletePortfolioItem: async (id: string): Promise<{ success: boolean }> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
    await db.collection('portfolio').deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  },
  reorderPortfolio: async (orderedIds: string[]): Promise<PortfolioItem[]> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
     const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index + 1 } },
      },
    }));
    if(bulkOps.length > 0) {
        await db.collection('portfolio').bulkWrite(bulkOps);
    }
    return db.collection<PortfolioItem>('portfolio').find().sort({ order: 1 }).toArray().then(docs => docs.map(mapDoc));
  },
  updatePortfolioItem: async (id: string, data: Partial<PortfolioItem>): Promise<PortfolioItem | undefined> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
    const { _id, ...updateData } = data as any; // Prevent _id from being in $set
    await db.collection('portfolio').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    const updatedDoc = await db.collection('portfolio').findOne({ _id: new ObjectId(id) });
    return updatedDoc ? mapDoc(updatedDoc) : undefined;
  },

  // TESTIMONIALS
  getTestimonials: async (): Promise<Testimonial[]> => {
    const db = await connectToDb();
    if (!db) return [];
    return db.collection<Testimonial>('testimonials').find().toArray().then(docs => docs.map(mapDoc));
  },

  // CONTACT
  getContact: async (): Promise<ContactData> => {
    const db = await connectToDb();
    if (!db) return { email: '', phone: '', address: '', socials: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' }};
    const data = await db.collection<ContactData>('contact').findOne({});
    return data ?? { email: '', phone: '', address: '', socials: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' }};
  },
  updateContact: async (data: ContactData): Promise<ContactData> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    await db.collection('contact').updateOne({}, { $set: data }, { upsert: true });
    return data;
  },

  // FOOTER
  getFooter: async (): Promise<FooterData> => {
    const db = await connectToDb();
    if (!db) return { copyright: '© 2024 Your Company', links: [] };
    const data = await db.collection<FooterData>('footer').findOne({});
    return data ?? { copyright: '', links: [] };
  },
  updateFooter: async (data: FooterData): Promise<FooterData> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    await db.collection('footer').updateOne({}, { $set: data }, { upsert: true });
    return data;
  },
};
