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
import type { SEOData } from '@/modules/seo/seo.schema';


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
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
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
    if (!db) return { email: 'admin@example.com', password_DO_NOT_STORE_IN_PLAIN_TEXT: 'password' };
    const admin = await db.collection<AdminUser>('admin').findOne({});
    return admin ?? { email: '', password_DO_NOT_STORE_IN_PLAIN_TEXT: '' };
  },

  // HERO
  getHero: async (): Promise<HeroData> => {
    const db = await connectToDb();
    if (!db) return {
      headline: 'Creating Stories',
      subheadline: 'We are a creative film and photo production house. Please connect to a database to see full content.',
      ctaText: 'Explore Now',
      ctaLink: '#portfolio',
      images: [
        { src: 'https://picsum.photos/600/800?random=1', alt: 'Man with a camera', 'data-ai-hint': 'camera gear' },
        { src: 'https://picsum.photos/600/800?random=2', alt: 'Film set lighting', 'data-ai-hint': 'film set' },
        { src: 'https://picsum.photos/600/800?random=3', alt: 'Video editing suite', 'data-ai-hint': 'video editing' },
      ],
    };
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
    if (!db) return [
        { id: '1', src: 'https://picsum.photos/800/600?random=11', alt: 'Couple walking on a hill', 'data-ai-hint': 'couple landscape', order: 1 },
        { id: '2', src: 'https://picsum.photos/400/300?random=12', alt: 'Black and white wedding photo', 'data-ai-hint': 'wedding black-white', order: 2 },
    ];
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
  updateGalleryImage: async (id: string, data: Partial<GalleryImage>): Promise<GalleryImage | undefined> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
    const { _id, ...updateData } = data as any; // Prevent _id from being in $set
    await db.collection('gallery').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    const updatedDoc = await db.collection('gallery').findOne({ _id: new ObjectId(id) });
    return updatedDoc ? mapDoc(updatedDoc) : undefined;
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
    if (!db) return { 
        title: 'Our Story Behind the Lens', 
        content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', 
        imageUrl: 'https://picsum.photos/1200/800?random=20', 
        'data-ai-hint': 'camera lens'
    };
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
    if (!db) return [
        { id: '1', title: 'Photography', description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', icon: 'Camera' },
        { id: '2', title: 'Videography', description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', icon: 'Video' },
    ];
    return db.collection<Service>('services').find().toArray().then(docs => docs.map(mapDoc));
  },
  
  // PORTFOLIO
  getPortfolio: async (): Promise<PortfolioItem[]> => {
    const db = await connectToDb();
    if (!db) return [
      { id: '1', title: 'Project Alpha', description: 'A documentary short on urban exploration.', imageUrl: 'https://picsum.photos/600/400?random=31', 'data-ai-hint': 'urban exploration', category: 'Video', order: 1 },
      { id: '2', title: 'Project Beta', description: 'Brand photography for a new startup.', imageUrl: 'https://picsum.photos/600/400?random=32', 'data-ai-hint': 'startup brand', category: 'Photography', order: 2 },
    ];
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
    if (!db) return [
      { id: '1', quote: 'It was a very good experience.', author: 'Leo', company: 'Marketer' },
      { id: '2', quote: 'It was a very good experience.', author: 'Ana', company: 'Photographer' },
    ];
    return db.collection<Testimonial>('testimonials').find().toArray().then(docs => docs.map(mapDoc));
  },

  // CONTACT
  getContact: async (): Promise<ContactData> => {
    const db = await connectToDb();
    if (!db) return { 
        email: 'hello@hfmedia.house', 
        phone: '+1 (234) 567-890', 
        address: '123 Media Lane, Creative City, 10001', 
        socials: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' }
    };
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
    if (!db) return { 
        copyright: `Copyright @${new Date().getFullYear()} H&F Media. All rights reserved.`, 
        links: [
            { title: 'Home', url: '/' },
            { title: 'About', url: '#about' },
        ] 
    };
    const data = await db.collection<FooterData>('footer').findOne({});
    return data ?? { copyright: '', links: [] };
  },
  updateFooter: async (data: FooterData): Promise<FooterData> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    await db.collection('footer').updateOne({}, { $set: data }, { upsert: true });
    return data;
  },

  // SEO
  getSEO: async (): Promise<SEOData> => {
    const db = await connectToDb();
    if (!db) return { 
        title: 'H&F Media House | Fallback Title', 
        description: 'This is fallback description for when the database is not connected.',
        keywords: 'media, photography, video',
        url: 'https://example.com',
        ogImage: 'https://picsum.photos/1200/630'
    };
    const data = await db.collection<SEOData>('seo').findOne({});
    return data ?? { title: '', description: '', keywords: '', url: '', ogImage: '' };
  },
  updateSEO: async (data: SEOData): Promise<SEOData> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    await db.collection('seo').updateOne({}, { $set: data }, { upsert: true });
    return data;
  },
};
